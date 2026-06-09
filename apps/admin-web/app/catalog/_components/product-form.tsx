"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { CategoryResponseDto } from "@tonios/contracts";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select, Textarea } from "@tonios/ui";
import { catalogApi } from "../_lib/catalog-api";
import { useTenantId } from "../_lib/use-tenant-id";
import { TenantField } from "./tenant-field";

const productSchema = z.object({
  tenantId: z.string().uuid("Tenant ID must be a valid UUID."),
  categoryId: z.string().uuid("Category is required."),
  name: z.string().trim().min(1, "Name is required.").max(180),
  description: z.string().max(800).optional(),
  price: z.coerce.number().min(0, "Price must be greater than or equal to zero."),
  imageUrl: z
    .string()
    .max(1000)
    .optional()
    .refine(
      (value) => !value || value.startsWith("https://") || value.startsWith("http://") || value.startsWith("/"),
      "Image URL must be absolute or application-relative."
    ),
  active: z.boolean()
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  mode: "create" | "edit";
}

export function ProductForm({ mode }: ProductFormProps) {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const { tenantId, setTenantId } = useTenantId();
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      tenantId: "",
      categoryId: "",
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      active: true
    }
  });

  useEffect(() => {
    form.setValue("tenantId", tenantId);
  }, [form, tenantId]);

  useEffect(() => {
    if (!tenantId) {
      setCategories([]);
      return;
    }

    async function loadCategories() {
      const response = await catalogApi.listCategories({
        tenantId,
        page: 1,
        pageSize: 100
      });
      setCategories(response.data);
    }

    void loadCategories().catch((err) => {
      setError(err instanceof Error ? err.message : "Unable to load categories.");
    });
  }, [tenantId]);

  useEffect(() => {
    if (mode !== "edit" || !params.id || !tenantId) {
      return;
    }

    async function loadProduct() {
      const product = await catalogApi.getProduct(tenantId, String(params.id));
      form.reset({
        tenantId,
        categoryId: product.categoryId,
        name: product.name,
        description: product.description ?? "",
        price: product.price,
        imageUrl: product.imageUrl ?? "",
        active: product.active
      });
    }

    void loadProduct().catch((err) => {
      setError(err instanceof Error ? err.message : "Unable to load product.");
    });
  }, [form, mode, params.id, tenantId]);

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    setTenantId(values.tenantId);

    try {
      if (mode === "create") {
        await catalogApi.createProduct({
          tenantId: values.tenantId,
          categoryId: values.categoryId,
          name: values.name,
          description: values.description || undefined,
          price: values.price,
          imageUrl: values.imageUrl || undefined,
          active: values.active
        });
      } else if (params.id) {
        await catalogApi.updateProduct(values.tenantId, String(params.id), {
          categoryId: values.categoryId,
          name: values.name,
          description: values.description || null,
          price: values.price,
          imageUrl: values.imageUrl || null,
          active: values.active
        });
      }

      router.push("/catalog/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save product.");
    }
  });

  return (
    <main className="catalog-shell">
      <header className="catalog-header">
        <div>
          <p className="eyebrow">Catalog v1</p>
          <h1>{mode === "create" ? "Create product" : "Edit product"}</h1>
        </div>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Product details</CardTitle>
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
              <Label htmlFor="categoryId">Category</Label>
              <Select id="categoryId" {...form.register("categoryId")}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              <FieldError message={form.formState.errors.categoryId?.message} />
            </div>
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
            <div className="catalog-two-columns">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" step="0.01" type="number" {...form.register("price")} />
                <FieldError message={form.formState.errors.price?.message} />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" {...form.register("imageUrl")} />
                <FieldError message={form.formState.errors.imageUrl?.message} />
              </div>
            </div>
            <label className="catalog-checkbox">
              <input type="checkbox" {...form.register("active")} />
              Active
            </label>
            {error ? <p className="catalog-error">{error}</p> : null}
            <div className="catalog-form-actions">
              <Button type="button" variant="secondary" onClick={() => router.push("/catalog/products")}>
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
