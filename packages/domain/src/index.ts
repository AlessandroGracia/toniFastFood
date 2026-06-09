import type { ISODateTime, UUID } from "@tonios/contracts";

export interface EntityIdentity {
  id: UUID;
  tenantId: UUID;
}

export interface BranchScopedIdentity extends EntityIdentity {
  branchId: UUID;
}

export interface DomainEventMetadata {
  eventId: UUID;
  occurredAt: ISODateTime;
  correlationId: UUID;
  causationId?: UUID;
}
