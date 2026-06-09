import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  toSlug,
  validateCreateProductDto,
  validateEntityId,
  validateTenantId,
  validateUpdateProductDto
} from "./catalog.validation";
import type { CreateProductDto, ProductResponseDto, UpdateProductDto } from "./dto";
import { mapProduct } from "./product.mapper";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    validateCreateProductDto(dto);

    await this.ensureCategoryExists(dto.tenantId, dto.categoryId);

    const product = await this.prisma.product.create({
      data: {
        tenantId: dto.tenantId,
        categoryId: dto.categoryId,
        name: dto.name.trim(),
        slug: dto.slug?.trim() ?? toSlug(dto.name),
        description: dto.description?.trim(),
        sku: dto.sku?.trim(),
        barcode: dto.barcode?.trim(),
        status: dto.status ?? "ACTIVE",
        variants: {
          create: (dto.variants ?? []).map((variant, index) => ({
            tenantId: dto.tenantId,
            name: variant.name.trim(),
            sku: variant.sku?.trim(),
            barcode: variant.barcode?.trim(),
            priceCents: variant.priceCents ?? 0,
            currency: variant.currency ?? "USD",
            trackInventory: variant.trackInventory ?? true,
            sortOrder: variant.sortOrder ?? index,
            status: variant.status ?? "ACTIVE"
          }))
        }
      },
      include: { variants: true }
    });

    return mapProduct(product);
  }

  async findMany(tenantId: string): Promise<ProductResponseDto[]> {
    validateTenantId(tenantId);

    const products = await this.prisma.product.findMany({
      where: {
        tenantId,
        deletedAt: null
      },
      include: {
        variants: {
          where: { deletedAt: null },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
        }
      },
      orderBy: [{ name: "asc" }]
    });

    return products.map(mapProduct);
  }

  async findOne(tenantId: string, id: string): Promise<ProductResponseDto> {
    validateTenantId(tenantId);
    validateEntityId(id);

    const product = await this.prisma.product.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null
      },
      include: {
        variants: {
          where: { deletedAt: null },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
        }
      }
    });

    if (!product) {
      throw new NotFoundException("Product was not found.");
    }

    return mapProduct(product);
  }

  async update(tenantId: string, id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    validateTenantId(tenantId);
    validateEntityId(id);
    validateUpdateProductDto(dto);
    await this.findOne(tenantId, id);

    if (dto.categoryId) {
      await this.ensureCategoryExists(tenantId, dto.categoryId);
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        categoryId: dto.categoryId,
        name: dto.name?.trim(),
        slug: dto.slug?.trim(),
        description: dto.description === null ? null : dto.description?.trim(),
        sku: dto.sku === null ? null : dto.sku?.trim(),
        barcode: dto.barcode === null ? null : dto.barcode?.trim(),
        status: dto.status
      },
      include: {
        variants: {
          where: { deletedAt: null },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
        }
      }
    });

    return mapProduct(product);
  }

  async softDelete(tenantId: string, id: string): Promise<ProductResponseDto> {
    validateTenantId(tenantId);
    validateEntityId(id);
    await this.findOne(tenantId, id);

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: "ARCHIVED",
        variants: {
          updateMany: {
            where: { deletedAt: null },
            data: {
              deletedAt: new Date(),
              status: "ARCHIVED"
            }
          }
        }
      },
      include: {
        variants: {
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
        }
      }
    });

    return mapProduct(product);
  }

  private async ensureCategoryExists(tenantId: string, categoryId: string): Promise<void> {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        tenantId,
        deletedAt: null
      },
      select: { id: true }
    });

    if (!category) {
      throw new NotFoundException("Category was not found.");
    }
  }
}
