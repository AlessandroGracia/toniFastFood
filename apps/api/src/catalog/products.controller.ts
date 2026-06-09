import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import type { PaginatedResponse } from "@tonios/contracts";
import type {
  CreateProductDto,
  ProductListQueryDto,
  ProductResponseDto,
  UpdateProductDto
} from "./dto";
import { ProductsService } from "./products.service";

@Controller("catalog/products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    return this.productsService.create(dto);
  }

  @Get()
  findMany(@Query() query: ProductListQueryDto): Promise<PaginatedResponse<ProductResponseDto>> {
    return this.productsService.findMany(query);
  }

  @Get(":id")
  findOne(
    @Query("tenantId") tenantId: string,
    @Param("id") id: string
  ): Promise<ProductResponseDto> {
    return this.productsService.findOne(tenantId, id);
  }

  @Put(":id")
  update(
    @Query("tenantId") tenantId: string,
    @Param("id") id: string,
    @Body() dto: UpdateProductDto
  ): Promise<ProductResponseDto> {
    return this.productsService.update(tenantId, id, dto);
  }

  @Delete(":id")
  softDelete(
    @Query("tenantId") tenantId: string,
    @Param("id") id: string
  ): Promise<ProductResponseDto> {
    return this.productsService.softDelete(tenantId, id);
  }
}
