export type UUID = string;
export type ISODateTime = string;

export type ServiceStatus = "ok" | "degraded" | "down";

export interface HealthResponse {
  service: string;
  status: ServiceStatus;
  timestamp: ISODateTime;
}

export interface CommandMetadata {
  tenantId: UUID;
  branchId?: UUID;
  actorId?: UUID;
  deviceId?: UUID;
  correlationId: UUID;
  idempotencyKey?: string;
}

export interface EventEnvelope<TPayload = unknown> {
  eventId: UUID;
  eventType: string;
  eventVersion: number;
  occurredAt: ISODateTime;
  tenantId: UUID;
  branchId?: UUID;
  aggregateType: string;
  aggregateId: UUID;
  correlationId: UUID;
  causationId?: UUID;
  payload: TPayload;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  code: string;
  correlationId?: UUID;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface PaginatedResponse<TItem> {
  data: TItem[];
  meta: PaginationMeta;
}

export * from "./catalog.js";
export * from "./inventory.js";
