import type { Permission } from "@tonios/auth";
import type { UUID } from "@tonios/contracts";

export interface TenantContext {
  tenantId: UUID;
  branchId?: UUID;
  userId?: UUID;
  deviceId?: UUID;
  correlationId: UUID;
  permissions: Permission[];
}

export function assertTenantContext(context: Partial<TenantContext>): asserts context is TenantContext {
  if (!context.tenantId || !context.correlationId || !context.permissions) {
    throw new Error("Tenant context is incomplete.");
  }
}
