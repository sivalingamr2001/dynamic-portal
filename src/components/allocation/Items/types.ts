export interface ItemLine {
  id: number;
  organization: string;
  itemCode: string;
  itemName: string;
  qty: string;
  targetDate: string;
}

export interface ItemOperatingUnitDto {
  organizationId: number;
  organizationCode: string;
}

export interface ItemCodeOption {
  inventoryItemId: string;
  itemCode: string;
  description: string;
}

export interface DemandMetrics {
  demand: number;
  forecast: number;
  safety_stock: number;
  recommended_qty: number;
}

export interface Props {
  itemLines: ItemLine[];
  onChange: (id: number, field: string, value: any) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
  ItemOperatingUnitDto?: ItemOperatingUnitDto[];
  selectedOrgId?: string;
  billToCustomerId: string;
  billToLocationId: string;
  searchItemCodes?: (searchTerm: string) => void;
  itemCodeOptions?: ItemCodeOption[];
  loadingItemCodes?: boolean;
}