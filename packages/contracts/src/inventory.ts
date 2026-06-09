export type InventoryItemStatusDto = "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type InventoryMovementTypeDto = "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT" | "WASTE";
export type InventoryMovementStatusDto = "POSTED" | "VOIDED" | "REVERSED";

export interface InventoryItemResponseDto {
  id: string;
  tenantId: string;
  branchId: string;
  productVariantId: string;
  name: string;
  sku: string | null;
  barcode: string | null;
  unit: string;
  quantityOnHand: string;
  reorderPoint: string | null;
  status: InventoryItemStatusDto;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface InventoryMovementResponseDto {
  id: string;
  tenantId: string;
  branchId: string;
  inventoryItemId: string;
  type: InventoryMovementTypeDto;
  status: InventoryMovementStatusDto;
  quantity: string;
  unitCostCents: number | null;
  reason: string | null;
  referenceType: string | null;
  referenceId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
