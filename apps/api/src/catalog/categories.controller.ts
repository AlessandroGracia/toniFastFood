import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import type { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from "./dto";

@Controller("catalog/categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesService.create(dto);
  }

  @Get()
  findMany(@Query("tenantId") tenantId: string): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findMany(tenantId);
  }

  @Get(":id")
  findOne(
    @Query("tenantId") tenantId: string,
    @Param("id") id: string
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.findOne(tenantId, id);
  }

  @Put(":id")
  update(
    @Query("tenantId") tenantId: string,
    @Param("id") id: string,
    @Body() dto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.update(tenantId, id, dto);
  }

  @Delete(":id")
  softDelete(
    @Query("tenantId") tenantId: string,
    @Param("id") id: string
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.softDelete(tenantId, id);
  }
}
