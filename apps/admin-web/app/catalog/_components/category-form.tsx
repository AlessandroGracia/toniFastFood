"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea } from "@tonios/ui";
import { catalogApi } from "../_lib/catalog-api";
import { useTenantId } from "../_lib/use-tenant-id";
import { TenantField } from "./tenant-field";

const categorySchema = z.object({
  tenantId: z.string().uuid("Tenant ID must be a valid UUID."),
  name: z.string().trim().min(1, "Name is required.").max(160),
  description: z.string().max(500).optional(),
  active: z.boolean()
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  mode: "create" | "edit";
}

export function CategoryForm({ mode }: CategoryFormProps) {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const { tenantId, setTenantId } = useTenantId();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      tenantId: "",
      name: "",
      description: "",
      active: true
    }
  });

  useEffect(() => {
    form.setValue("tenantId", tenantId);
  }, [form, tenantId]);

  useEffect(() => {
    if (mode !== "edit" || !params.id || !tenantId) {
      return;
    }

    async function loadCategory() {
      const category = await catalogApi.getCategory(tenantId, String(params.id));
      form.reset({
        tenantId,
        name: category.name,
        description: category.description ?? "",
        active: category.active
      });
    }

    void loadCategory().catch((err) => {
      setError(err instanceof Error ? err.message : "Unable to load category.");
    });
  }, [form, mode, params.id, tenantId]);

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    setTenantId(values.tenantId);

    try {
      if (mode === "create") {
        await catalogApi.createCategory({
          tenantId: values.tenantId,
          name: values.name,
          description: values.description || undefined,
          active: values.active
        });
      } else if (params.id) {
        await catalogApi.updateCategory(values.tenantId, String(params.id), {
          name: values.name,
          description: values.description || null,
          active: values.active
        });
      }

      router.push("/catalog/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save category.");
    }
  });

  return (
    <main className="catalog-shell">
      <header className="catalog-header">
        <div>
          <p className="eyebrow">Catalog v1</p>
          <h1>{mode === "create" ? "Create category" : "Edit category"}</h1>
        </div>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Category details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="catalog-form" onSubmit={onSubmit}>
            <TenantField
              tenantId={form.watch("tenantId")}
              onTenantIdChange={(value) => {
                form.setValue("tenantId", value);
                setTenantId(value);
              }}
            />
            <FieldError message={form.formState.errors.tenantId?.message} />
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} />
              <FieldError message={form.formState.errors.name?.message} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} {...form.register("description")} />
              <FieldError message={form.formState.errors.description?.message} />
            </div>
            <label className="catalog-checkbox">
              <input type="checkbox" {...form.register("active")} />
              Active
            </label>
            {error ? <p className="catalog-error">{error}</p> : null}
            <div className="catalog-form-actions">
              <Button type="button" variant="secondary" onClick={() => router.push("/catalog/categories")}>
                Cancel
              </Button>
              <Button type="submit">{mode === "create" ? "Create" : "Save"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="catalog-field-error">{message}</p> : null;
}
