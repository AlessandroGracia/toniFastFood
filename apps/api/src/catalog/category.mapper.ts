import type { CategoryResponseDto } from "./dto";

interface CategoryRecord {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  sortOrder: number;
  status: CategoryResponseDto["status"];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export function mapCategory(category: CategoryRecord): CategoryResponseDto {
  return {
    id: category.id,
    tenantId: category.tenantId,
    name: category.name,
    slug: category.slug,
    description: category.description,
    active: category.active,
    sortOrder: category.sortOrder,
    status: category.status,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
    deletedAt: category.deletedAt?.toISOString() ?? null
  };
}
