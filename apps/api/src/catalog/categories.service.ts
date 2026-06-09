import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { mapCategory } from "./category.mapper";
import {
  toSlug,
  validateCreateCategoryDto,
  validateEntityId,
  validateTenantId,
  validateUpdateCategoryDto
} from "./catalog.validation";
import type { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from "./dto";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    validateCreateCategoryDto(dto);

    const category = await this.prisma.category.create({
      data: {
        tenantId: dto.tenantId,
        name: dto.name.trim(),
        slug: dto.slug?.trim() ?? toSlug(dto.name),
        description: dto.description?.trim(),
        sortOrder: dto.sortOrder ?? 0,
        status: dto.status ?? "ACTIVE"
      }
    });

    return mapCategory(category);
  }

  async findMany(tenantId: string): Promise<CategoryResponseDto[]> {
    validateTenantId(tenantId);

    const categories = await this.prisma.category.findMany({
      where: {
        tenantId,
        deletedAt: null
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    });

    return categories.map(mapCategory);
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
        sortOrder: dto.sortOrder,
        status: dto.status
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
        status: "ARCHIVED"
      }
    });

    return mapCategory(category);
  }
}
