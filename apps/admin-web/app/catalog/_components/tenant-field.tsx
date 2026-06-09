"use client";

import { Input, Label } from "@tonios/ui";

interface TenantFieldProps {
  tenantId: string;
  onTenantIdChange: (tenantId: string) => void;
}

export function TenantField({ tenantId, onTenantIdChange }: TenantFieldProps) {
  return (
    <div className="catalog-tenant-field">
      <Label htmlFor="tenantId">Tenant ID</Label>
      <Input
        id="tenantId"
        placeholder="UUID del tenant"
        value={tenantId}
        onChange={(event) => onTenantIdChange(event.target.value)}
      />
    </div>
  );
}
