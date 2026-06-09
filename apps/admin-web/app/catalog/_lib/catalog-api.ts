import { createCatalogApiClient } from "@tonios/api-sdk";

export const catalogApi = createCatalogApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/v1"
});

export const tenantStorageKey = "tonios.admin.tenantId";
