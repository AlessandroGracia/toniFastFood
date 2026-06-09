"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CategoryResponseDto, PaginatedResponse, ProductResponseDto } from "@tonios/contracts";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@tonios/ui";
import { catalogApi } from "../_lib/catalog-api";
import { useTenantId } from "../_lib/use-tenant-id";
import { DataTable } from "./data-table";
import { PaginationControls } from "./pagination-controls";
import { TenantField } from "./tenant-field";

export function ProductListClient() {
  const { tenantId, setTenantId } = useTenantId();
  const [result, setResult] = useState<PaginatedResponse<ProductResponseDto> | null>(null);
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    if (!tenantId) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [productResponse, categoryResponse] = await Promise.all([
        catalogApi.listProducts({
          tenantId,
          page,
          pageSize: 10,
          search: search || undefined,
          active: active === "" ? undefined : active === "true",
          categoryId: categoryId || undefined
        }),
        catalogApi.listCategories({ tenantId, page: 1, pageSize: 100 })
      ]);

      setResult(productResponse);
      setCategories(categoryResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [active, categoryId, page, search, tenantId]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const categoryNameById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  const columns = useMemo<Array<ColumnDef<ProductResponseDto>>>(
    () => [
      {
        accessorKey: "name",
        header: "Name"
      },
      {
        accessorKey: "categoryId",
        header: "Category",
        cell: ({ row }) => categoryNameById.get(row.original.categoryId) ?? "Unknown"
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => `$${row.original.price.toFixed(2)}`
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
              href={`/catalog/products/${row.original.id}/edit`}
            >
              Edit
            </Link>
            <Button
              type="button"
              variant="danger"
              onClick={async () => {
                if (!window.confirm("Archive this product?")) {
                  return;
                }

                await catalogApi.deleteProduct(tenantId, row.original.id);
                await loadProducts();
              }}
            >
              Archive
            </Button>
          </div>
        )
      }
    ],
    [categoryNameById, loadProducts, tenantId]
  );

  return (
    <main className="catalog-shell">
      <header className="catalog-header">
        <div>
          <p className="eyebrow">Catalog v1</p>
          <h1>Products</h1>
        </div>
        <Link className="tonios-button tonios-button--default" href="/catalog/products/new">
          New product
        </Link>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Product list</CardTitle>
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
              value={categoryId}
              onChange={(event) => {
                setPage(1);
                setCategoryId(event.target.value);
              }}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
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
          {loading ? <p className="catalog-muted">Loading products...</p> : null}
          <DataTable
            columns={columns}
            data={result?.data ?? []}
            emptyLabel={tenantId ? "No products found." : "Enter a tenant ID to load products."}
          />
          <PaginationControls meta={result?.meta ?? null} onPageChange={setPage} />
        </CardContent>
      </Card>
    </main>
  );
}
