import type {
  CategoryListQueryDto,
  CategoryResponseDto,
  CreateCategoryDto,
  CreateProductDto,
  PaginatedResponse,
  ProductListQueryDto,
  ProductResponseDto,
  UpdateCategoryDto,
  UpdateProductDto
} from "@tonios/contracts";
import type { ApiClientConfig } from "./index";

export interface CatalogApiClient {
  listCategories(query: CategoryListQueryDto): Promise<PaginatedResponse<CategoryResponseDto>>;
  getCategory(tenantId: string, id: string): Promise<CategoryResponseDto>;
  createCategory(dto: CreateCategoryDto): Promise<CategoryResponseDto>;
  updateCategory(tenantId: string, id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto>;
  deleteCategory(tenantId: string, id: string): Promise<CategoryResponseDto>;
  listProducts(query: ProductListQueryDto): Promise<PaginatedResponse<ProductResponseDto>>;
  getProduct(tenantId: string, id: string): Promise<ProductResponseDto>;
  createProduct(dto: CreateProductDto): Promise<ProductResponseDto>;
  updateProduct(tenantId: string, id: string, dto: UpdateProductDto): Promise<ProductResponseDto>;
  deleteProduct(tenantId: string, id: string): Promise<ProductResponseDto>;
}

export function createCatalogApiClient(config: ApiClientConfig): CatalogApiClient {
  return {
    listCategories: (query) => request(config, `/catalog/categories?${toQuery(query)}`),
    getCategory: (tenantId, id) =>
      request(config, `/catalog/categories/${id}?${toQuery({ tenantId })}`),
    createCategory: (dto) => request(config, "/catalog/categories", "POST", dto),
    updateCategory: (tenantId, id, dto) =>
      request(config, `/catalog/categories/${id}?${toQuery({ tenantId })}`, "PUT", dto),
    deleteCategory: (tenantId, id) =>
      request(config, `/catalog/categories/${id}?${toQuery({ tenantId })}`, "DELETE"),
    listProducts: (query) => request(config, `/catalog/products?${toQuery(query)}`),
    getProduct: (tenantId, id) => request(config, `/catalog/products/${id}?${toQuery({ tenantId })}`),
    createProduct: (dto) => request(config, "/catalog/products", "POST", dto),
    updateProduct: (tenantId, id, dto) =>
      request(config, `/catalog/products/${id}?${toQuery({ tenantId })}`, "PUT", dto),
    deleteProduct: (tenantId, id) =>
      request(config, `/catalog/products/${id}?${toQuery({ tenantId })}`, "DELETE")
  };
}

async function request<TResponse>(
  config: ApiClientConfig,
  path: string,
  method = "GET",
  body?: unknown
): Promise<TResponse> {
  const headers = new Headers({ Accept: "application/json" });
  const token = await config.getAccessToken?.();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${config.baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `ToniOS API request failed with status ${response.status}.`);
  }

  return (await response.json()) as TResponse;
}

function toQuery(values: object): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (
      value !== undefined &&
      value !== "" &&
      (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    ) {
      params.set(key, String(value));
    }
  }

  return params.toString();
}
