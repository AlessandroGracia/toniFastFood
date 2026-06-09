import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import type { CreateProductDto, ProductResponseDto, UpdateProductDto } from "./dto";
import { ProductsService } from "./products.service";

@Controller("catalog/products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    return this.productsService.create(dto);
  }

  @Get()
  findMany(@Query("tenantId") tenantId: string): Promise<ProductResponseDto[]> {
    return this.productsService.findMany(tenantId);
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
