import { BadRequestException } from "@nestjs/common";
import type {
  CreateCategoryDto,
  CreateProductDto,
  CreateProductVariantDto,
  ProductStatusDto,
  ProductVariantStatusDto,
  UpdateCategoryDto,
  UpdateProductDto
} from "./dto";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const categoryStatuses = new Set(["ACTIVE", "INACTIVE", "ARCHIVED"]);
const productStatuses = new Set(["ACTIVE", "INACTIVE", "ARCHIVED"]);
const productVariantStatuses = new Set(["ACTIVE", "INACTIVE", "OUT_OF_STOCK", "ARCHIVED"]);
const currencyPattern = /^[A-Z]{3}$/;

export function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateTenantId(tenantId: string): void {
  validateUuid(tenantId, "tenantId");
}

export function validateCategoryId(categoryId: string): void {
  validateUuid(categoryId, "categoryId");
}

export function validateEntityId(id: string, field = "id"): void {
  validateUuid(id, field);
}

function validateUuid(value: string, field: string): void {
  if (!uuidPattern.test(value)) {
    throw new BadRequestException(`${field} must be a valid UUID.`);
  }
}

export function validateCreateCategoryDto(dto: CreateCategoryDto): void {
  validateTenantId(dto.tenantId);
  validateRequiredText(dto.name, "name", 160);
  validateOptionalText(dto.slug, "slug", 180);
  validateOptionalText(dto.description, "description", 500);
  validateOptionalInteger(dto.sortOrder, "sortOrder");
  validateEnum(dto.status, categoryStatuses, "status");
}

export function validateUpdateCategoryDto(dto: UpdateCategoryDto): void {
  validateOptionalText(dto.name, "name", 160);
  validateOptionalText(dto.slug, "slug", 180);
  validateNullableText(dto.description, "description", 500);
  validateOptionalInteger(dto.sortOrder, "sortOrder");
  validateEnum(dto.status, categoryStatuses, "status");
}

export function validateCreateProductDto(dto: CreateProductDto): void {
  validateTenantId(dto.tenantId);
  validateCategoryId(dto.categoryId);
  validateRequiredText(dto.name, "name", 180);
  validateOptionalText(dto.slug, "slug", 200);
  validateOptionalText(dto.description, "description", 800);
  validateOptionalText(dto.sku, "sku", 80);
  validateOptionalText(dto.barcode, "barcode", 80);
  validateEnum(dto.status, productStatuses, "status");

  for (const variant of dto.variants ?? []) {
    validateCreateProductVariantDto(variant);
  }
}

export function validateUpdateProductDto(dto: UpdateProductDto): void {
  if (dto.categoryId !== undefined) {
    validateCategoryId(dto.categoryId);
  }

  validateOptionalText(dto.name, "name", 180);
  validateOptionalText(dto.slug, "slug", 200);
  validateNullableText(dto.description, "description", 800);
  validateNullableText(dto.sku, "sku", 80);
  validateNullableText(dto.barcode, "barcode", 80);
  validateEnum<ProductStatusDto>(dto.status, productStatuses, "status");
}

function validateCreateProductVariantDto(dto: CreateProductVariantDto): void {
  validateRequiredText(dto.name, "variants.name", 180);
  validateOptionalText(dto.sku, "variants.sku", 80);
  validateOptionalText(dto.barcode, "variants.barcode", 80);
  validateOptionalInteger(dto.priceCents, "variants.priceCents");
  validateOptionalInteger(dto.sortOrder, "variants.sortOrder");
  validateEnum<ProductVariantStatusDto>(dto.status, productVariantStatuses, "variants.status");

  if (dto.currency !== undefined && !currencyPattern.test(dto.currency)) {
    throw new BadRequestException("variants.currency must be a three-letter ISO currency code.");
  }

  if (dto.priceCents !== undefined && dto.priceCents < 0) {
    throw new BadRequestException("variants.priceCents must be greater than or equal to zero.");
  }
}

function validateRequiredText(value: string | undefined, field: string, maxLength: number): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new BadRequestException(`${field} is required.`);
  }

  validateTextLength(value, field, maxLength);
}

function validateOptionalText(value: string | undefined, field: string, maxLength: number): void {
  if (value === undefined) {
    return;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new BadRequestException(`${field} must be a non-empty string.`);
  }

  validateTextLength(value, field, maxLength);
}

function validateNullableText(
  value: string | null | undefined,
  field: string,
  maxLength: number
): void {
  if (value === null || value === undefined) {
    return;
  }

  validateOptionalText(value, field, maxLength);
}

function validateTextLength(value: string, field: string, maxLength: number): void {
  if (value.trim().length > maxLength) {
    throw new BadRequestException(`${field} must be ${maxLength} characters or fewer.`);
  }
}

function validateOptionalInteger(value: number | undefined, field: string): void {
  if (value === undefined) {
    return;
  }

  if (!Number.isInteger(value)) {
    throw new BadRequestException(`${field} must be an integer.`);
  }
}

function validateEnum<T extends string>(
  value: T | undefined,
  allowedValues: Set<string>,
  field: string
): void {
  if (value === undefined) {
    return;
  }

  if (!allowedValues.has(value)) {
    throw new BadRequestException(`${field} is not supported.`);
  }
}
