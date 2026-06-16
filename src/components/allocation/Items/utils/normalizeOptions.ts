import type { ItemCodeOption } from '../types';

interface NormalizedOption {
  value: string;
  label: string;
  inventoryItemId?: string;
  description?: string;
}

export function normalizeItemCodeOptions(
  externalOptions?: ItemCodeOption[],
  internalOptions?: any[]
): NormalizedOption[] {
  if (externalOptions && externalOptions.length > 0) {
    return externalOptions.map((opt) => {
      if (opt && (opt.value !== undefined || opt.label !== undefined)) {
        return opt as NormalizedOption;
      }

      const value = opt?.value ?? opt?.itemCode ?? '';
      const label = opt?.label ?? (opt?.description ? `${opt.description}` : value);

      return {
        value,
        label,
        inventoryItemId: opt?.inventoryItemId,
        description: opt?.description,
      };
    });
  }

  return internalOptions ?? [];
}