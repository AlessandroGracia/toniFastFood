"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CategoryResponseDto, PaginatedResponse } from "@tonios/contracts";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@tonios/ui";
import { catalogApi } from "../_lib/catalog-api";
import { useTenantId } from "../_lib/use-tenant-id";
import { DataTable } from "./data-table";
import { PaginationControls } from "./pagination-controls";
import { TenantField } from "./tenant-field";

export function CategoryListClient() {
  const { tenantId, setTenantId } = useTenantId();
  const [result, setResult] = useState<PaginatedResponse<CategoryResponseDto> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    if (!tenantId) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await catalogApi.listCategories({
        tenantId,
        page,
        pageSize: 10,
        search: search || undefined,
        active: active === "" ? undefined : active === "true"
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }, [active, page, search, tenantId]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const columns = useMemo<Array<ColumnDef<CategoryResponseDto>>>(
    () => [
      {
        accessorKey: "name",
        header: "Name"
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => row.original.description || "No description"
      },
      {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => (
          <Badge tone={row.original.active ? "positive" : "neutral"}>
            {row.original.active ? "Active" : "Inactive"}
          </Badge>
        )
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="catalog-row-actions">
            <Link
              className="tonios-button tonios-button--secondary"
              href={`/catalog/categories/${row.original.id}/edit`}
            >
              Edit
            </Link>
            <Button
              type="button"
              variant="danger"
              onClick={async () => {
                if (!window.confirm("Archive this category?")) {
                  return;
                }

                await catalogApi.deleteCategory(tenantId, row.original.id);
                await loadCategories();
              }}
            >
              Archive
            </Button>
          </div>
        )
      }
    ],
    [loadCategories, tenantId]
  );

  return (
    <main className="catalog-shell">
      <header className="catalog-header">
        <div>
          <p className="eyebrow">Catalog v1</p>
          <h1>Categories</h1>
        </div>
        <Link className="tonios-button tonios-button--default" href="/catalog/categories/new">
          New category
        </Link>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Category list</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="catalog-toolbar">
            <TenantField tenantId={tenantId} onTenantIdChange={setTenantId} />
            <Input
              placeholder="Search by name"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
            />
            <Select
              value={active}
              onChange={(event) => {
                setPage(1);
                setActive(event.target.value);
              }}
            >
              <option value="">All states</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </div>
          {error ? <p className="catalog-error">{error}</p> : null}
          {loading ? <p className="catalog-muted">Loading categories...</p> : null}
          <DataTable
            columns={columns}
            data={result?.data ?? []}
            emptyLabel={tenantId ? "No categories found." : "Enter a tenant ID to load categories."}
          />
          <PaginationControls meta={result?.meta ?? null} onPageChange={setPage} />
        </CardContent>
      </Card>
    </main>
  );
}
