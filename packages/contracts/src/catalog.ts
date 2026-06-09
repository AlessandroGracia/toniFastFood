export type CategoryStatusDto = "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type ProductStatusDto = "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type ProductVariantStatusDto = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "ARCHIVED";

export interface CreateCategoryDto {
  tenantId: string;
  name: string;
  slug?: string;
  description?: string;
  sortOrder?: number;
  status?: CategoryStatusDto;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string | null;
  sortOrder?: number;
  status?: CategoryStatusDto;
}

export interface CategoryResponseDto {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  status: CategoryStatusDto;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateProductVariantDto {
  name: string;
  sku?: string;
  barcode?: string;
  priceCents?: number;
  currency?: string;
  trackInventory?: boolean;
  sortOrder?: number;
  status?: ProductVariantStatusDto;
}

export interface CreateProductDto {
  tenantId: string;
  categoryId: string;
  name: string;
  slug?: string;
  description?: string;
  sku?: string;
  barcode?: string;
  status?: ProductStatusDto;
  variants?: CreateProductVariantDto[];
}

export interface UpdateProductDto {
  categoryId?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  sku?: string | null;
  barcode?: string | null;
  status?: ProductStatusDto;
}

export interface ProductVariantResponseDto {
  id: string;
  tenantId: string;
  productId: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  priceCents: number;
  currency: string;
  trackInventory: boolean;
  sortOrder: number;
  status: ProductVariantStatusDto;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductResponseDto {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  sku: string | null;
  barcode: string | null;
  status: ProductStatusDto;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  variants: ProductVariantResponseDto[];
}
