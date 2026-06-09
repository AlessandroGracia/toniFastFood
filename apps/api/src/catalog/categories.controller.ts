import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from "@nestjs/common";
import type { PaginatedResponse } from "@tonios/contracts";
import { CategoriesService } from "./categories.service";
import type {
  CategoryListQueryDto,
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto
} from "./dto";

@Controller("catalog/categories")
export class CategoriesController {
  private readonly categoriesService: CategoriesService;

  constructor(@Inject(CategoriesService) categoriesService: CategoriesService) {
    this.categoriesService = categoriesService;
  }

  @Post()
  create(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesService.create(dto);
  }

  @Get()
  findMany(@Query() query: CategoryListQueryDto): Promise<PaginatedResponse<CategoryResponseDto>> {
    return this.categoriesService.findMany(query);
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
