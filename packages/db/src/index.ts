export const DATABASE_PROVIDER = "postgresql" as const;

export interface DatabaseRuntimeConfig {
  provider: typeof DATABASE_PROVIDER;
  url: string;
}
