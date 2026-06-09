export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => Promise<string | undefined> | string | undefined;
}

export function createApiClient(config: ApiClientConfig): ApiClientConfig {
  return config;
}
