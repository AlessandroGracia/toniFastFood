export type Permission = `${string}.${string}`;

export interface Principal {
  userId: string;
  tenantId: string;
  branchIds: string[];
  permissions: Permission[];
}

export function hasPermission(principal: Principal, permission: Permission): boolean {
  return principal.permissions.includes(permission);
}
