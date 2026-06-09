import type { EventEnvelope, UUID } from "@tonios/contracts";

export type RealtimeConnectionState = "idle" | "connecting" | "connected" | "reconnecting" | "closed";

export interface RealtimeSubscription {
  tenantId: UUID;
  branchId?: UUID;
  channel: string;
  cursor?: string;
}

export interface RealtimeMessage<TPayload = unknown> {
  cursor: string;
  event: EventEnvelope<TPayload>;
}
