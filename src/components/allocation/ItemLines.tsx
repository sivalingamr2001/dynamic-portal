'use client';

import { Table, TableBody } from '@/components/ui/table';
import { AddLineButton } from './Items/AddLineButton';
import { useDemandMetrics } from './Items/hooks/useDemandMetrics';
import { useItemCodeSearch } from './Items/hooks/useItemCodeSearch';
import { ItemLineRow } from './Items/ItemLineRow';
import { ItemTableHeader } from './Items/ItemTableHeader';
import { normalizeItemCodeOptions } from './Items/utils/normalizeOptions';
import type { Props } from './Items/types';

export default function ItemLines({
  itemLines,
  onChange,
  onAdd,
  onRemove,
  ItemOperatingUnitDto,
  selectedOrgId,
  billToCustomerId,
  searchItemCodes,
  itemCodeOptions,
  loadingItemCodes,
}: Props) {
  const { internalOptions, isLoadingInternal, handleSearch } = useItemCodeSearch(searchItemCodes);
  const { demandMetrics, validationErrors, loadingMetrics, validateAndFetch } = useDemandMetrics();

  const normalizedItemCodeOptions = normalizeItemCodeOptions(itemCodeOptions, internalOptions);
  const isOrgDisabled = !selectedOrgId;

  const handleOrgChange = (lineId: number, orgId: number, orgCode: string) => {
    if (orgId) {
      onChange(lineId, 'organization', orgId);
      onChange(lineId, 'organizationCode', orgCode);

      const line = itemLines.find((l) => l.id === lineId);
      if (line?.itemCode) {
        validateAndFetch(lineId, orgId.toString(), line.itemCode, billToCustomerId);
      }
    } else {
      onChange(lineId, 'organization', '');
    }
  };

  const handleItemCodeChange = (lineId: number, option: any) => {
    if (!option) {
      onChange(lineId, 'itemCode', '');
      onChange(lineId, 'inventoryItemId', null);
      onChange(lineId, 'itemName', '');
      return;
    }

    onChange(lineId, 'itemCode', option.value);
    onChange(lineId, 'inventoryItemId', option.inventoryItemId);
    onChange(lineId, 'itemName', option.description || 'No description');

    const line = itemLines.find((l) => l.id === lineId);
    if (line?.organization) {
      validateAndFetch(lineId, line.organization, option.value, billToCustomerId);
    }
  };

  const handleQtyChange = (lineId: number, value: string) => {
    onChange(lineId, 'qty', value);
  };

  const handleDateChange = (lineId: number, value: string) => {
    onChange(lineId, 'targetDate', value);
  };

  const isItemCodeLoading = loadingItemCodes ?? isLoadingInternal;

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto rounded border border-slate-200 bg-white">
        <div className="max-h-55 overflow-y-auto custom-scrollbar">
          <Table className="w-full border-collapse">
            <ItemTableHeader />
            <TableBody>
              {itemLines.map((line, index) => (
                <ItemLineRow
                  key={line.id}
                  line={line}
                  index={index}
                  orgOptions={ItemOperatingUnitDto}
                  itemCodeOptions={normalizedItemCodeOptions}
                  isItemCodeLoading={isItemCodeLoading}
                  isOrgDisabled={isOrgDisabled}
                  isItemCodeDisabled={!line.organization}
                  metrics={demandMetrics[line.id]}
                  error={validationErrors[line.id]}
                  isMetricsLoading={loadingMetrics[line.id] ?? false}
                  onOrgChange={handleOrgChange}
                  onItemCodeChange={handleItemCodeChange}
                  onItemCodeSearch={handleSearch}
                  onQtyChange={handleQtyChange}
                  onDateChange={handleDateChange}
                  onRemove={onRemove}
                  canRemove={itemLines.length > 1}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <AddLineButton onAdd={onAdd} />
    </div>
  );
}