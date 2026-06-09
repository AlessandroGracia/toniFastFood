import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { PaginatedResponse } from "@tonios/contracts";
import { PrismaService } from "../prisma/prisma.service";
import { mapCategory } from "./category.mapper";
import {
  normalizeCategoryListQuery,
  statusFromActive,
  toSlug,
  validateCreateCategoryDto,
  validateEntityId,
  validateTenantId,
  validateUpdateCategoryDto
} from "./catalog.validation";
import type {
  CategoryListQueryDto,
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto
} from "./dto";

@Injectable()
export class CategoriesService {
  private readonly prisma: PrismaService;

  constructor(@Inject(PrismaService) prisma: PrismaService) {
    this.prisma = prisma;
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    validateCreateCategoryDto(dto);

    const category = await this.prisma.category.create({
      data: {
        tenantId: dto.tenantId,
        name: dto.name.trim(),
        slug: dto.slug?.trim() ?? toSlug(dto.name),
        description: dto.description?.trim(),
        active: dto.active ?? true,
        sortOrder: dto.sortOrder ?? 0,
        status: dto.status ?? statusFromActive(dto.active, "ACTIVE", "INACTIVE") ?? "ACTIVE"
      }
    });

    return mapCategory(category);
  }

  async findMany(query: CategoryListQueryDto): Promise<PaginatedResponse<CategoryResponseDto>> {
    const { tenantId, page, pageSize, search, active } = normalizeCategoryListQuery(query);
    const where = {
      tenantId,
      deletedAt: null,
      ...(active === undefined ? {} : { active }),
      ...(search === undefined ? {} : { name: { contains: search, mode: "insensitive" as const } })
    };

    const [categories, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.category.count({ where })
    ]);

    return {
      data: categories.map(mapCategory),
      meta: {
        page,
        pageSize,
        total,
        pageCount: Math.ceil(total / pageSize)
      }
    };
  }

  async findOne(tenantId: string, id: string): Promise<CategoryResponseDto> {
    validateTenantId(tenantId);
    validateEntityId(id);

    const category = await this.prisma.category.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null
      }
    });

    if (!category) {
      throw new NotFoundException("Category was not found.");
    }

    return mapCategory(category);
  }

  async update(tenantId: string, id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    validateTenantId(tenantId);
    validateEntityId(id);
    validateUpdateCategoryDto(dto);
    await this.findOne(tenantId, id);

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        slug: dto.slug?.trim(),
        description: dto.description === null ? null : dto.description?.trim(),
        active: dto.active,
        sortOrder: dto.sortOrder,
        status: dto.status ?? statusFromActive(dto.active, "ACTIVE", "INACTIVE")
      }
    });

    return mapCategory(category);
  }

  async softDelete(tenantId: string, id: string): Promise<CategoryResponseDto> {
    validateTenantId(tenantId);
    validateEntityId(id);
    await this.findOne(tenantId, id);

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        active: false,
        status: "ARCHIVED"
      }
    });

    return mapCategory(category);
  }
}
