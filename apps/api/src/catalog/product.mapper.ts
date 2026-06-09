import type { ProductResponseDto, ProductVariantResponseDto } from "./dto";

interface ProductVariantRecord {
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
  status: ProductVariantResponseDto["status"];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface ProductRecord {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | { toNumber(): number };
  active: boolean;
  imageUrl: string | null;
  sku: string | null;
  barcode: string | null;
  status: ProductResponseDto["status"];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  variants: ProductVariantRecord[];
}

export function mapProduct(product: ProductRecord): ProductResponseDto {
  return {
    id: product.id,
    tenantId: product.tenantId,
    categoryId: product.categoryId,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: typeof product.price === "number" ? product.price : product.price.toNumber(),
    active: product.active,
    imageUrl: product.imageUrl,
    sku: product.sku,
    barcode: product.barcode,
    status: product.status,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    deletedAt: product.deletedAt?.toISOString() ?? null,
    variants: product.variants.map(mapProductVariant)
  };
}

function mapProductVariant(variant: ProductVariantRecord): ProductVariantResponseDto {
  return {
    id: variant.id,
    tenantId: variant.tenantId,
    productId: variant.productId,
    name: variant.name,
    sku: variant.sku,
    barcode: variant.barcode,
    priceCents: variant.priceCents,
    currency: variant.currency,
    trackInventory: variant.trackInventory,
    sortOrder: variant.sortOrder,
    status: variant.status,
    createdAt: variant.createdAt.toISOString(),
    updatedAt: variant.updatedAt.toISOString(),
    deletedAt: variant.deletedAt?.toISOString() ?? null
  };
}
