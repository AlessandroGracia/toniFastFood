import type { EventEnvelope, UUID } from "@tonios/contracts";

export type SyncStatus = "online" | "offline" | "syncing" | "conflict" | "degraded";

export interface LocalSyncEvent<TPayload = unknown> {
  localEventId: UUID;
  deviceId: UUID;
  localSequence: number;
  event: EventEnvelope<TPayload>;
}

export interface SyncBatch<TPayload = unknown> {
  batchId: UUID;
  deviceId: UUID;
  events: Array<LocalSyncEvent<TPayload>>;
}
