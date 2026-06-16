import { TableCell, TableRow } from '@/components/ui/table';
import { OrgSelect } from './OrgSelect';
import { ItemCodeSelect } from './ItemCodeSelect';
import { MetricsDisplay } from './MetricsDisplay';
import { QuantityInput } from './QuantityInput';
import { DateInput } from './DateInput';
import { ActionCell } from './ActionCell';
import type { ItemLine, ItemOperatingUnitDto, DemandMetrics } from './types';

interface ItemLineRowProps {
  line: ItemLine;
  index: number;
  orgOptions: ItemOperatingUnitDto[] | undefined;
  itemCodeOptions: any[];
  isItemCodeLoading: boolean;
  isOrgDisabled: boolean;
  isItemCodeDisabled: boolean;
  metrics: DemandMetrics | undefined;
  error: string | undefined;
  isMetricsLoading: boolean;
  onOrgChange: (id: number, orgId: number, orgCode: string) => void;
  onItemCodeChange: (id: number, option: any) => void;
  onItemCodeSearch: (searchTerm: string) => void;
  onQtyChange: (id: number, value: string) => void;
  onDateChange: (id: number, value: string) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
}

export function ItemLineRow({
  line,
  index,
  orgOptions,
  itemCodeOptions,
  isItemCodeLoading,
  isOrgDisabled,
  isItemCodeDisabled,
  metrics,
  error,
  isMetricsLoading,
  onOrgChange,
  onItemCodeChange,
  onItemCodeSearch,
  onQtyChange,
  onDateChange,
  onRemove,
  canRemove,
}: ItemLineRowProps) {
  const handleOrgChange = (orgId: number, orgCode: string) => {
    onOrgChange(line.id, orgId, orgCode);
  };

  const handleItemCodeSelect = (option: any) => {
    onItemCodeChange(line.id, option);
  };

  const handleQtyChange = (value: string) => {
    onQtyChange(line.id, value);
  };

  const handleDateChange = (value: string) => {
    onDateChange(line.id, value);
  };

  const handleRemove = () => {
    onRemove(line.id);
  };

  return (
    <TableRow className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
      <TableCell className="px-2 py-1 text-center text-xs text-slate-400 font-medium">
        {index + 1}
      </TableCell>

      <TableCell className="p-1">
        <OrgSelect
          value={line.itemCode ? line.organization.toString() : ''}
          options={orgOptions}
          isDisabled={isOrgDisabled}
          onChange={handleOrgChange}
        />
      </TableCell>

      <TableCell className="p-1">
        <ItemCodeSelect
          value={line.itemCode}
          options={itemCodeOptions}
          isLoading={isItemCodeLoading}
          isDisabled={isItemCodeDisabled}
          onSearch={onItemCodeSearch}
          onChange={handleItemCodeSelect}
        />
      </TableCell>

      <TableCell className="p-1">
        <MetricsDisplay
          itemName={line.itemName}
          isLoading={isMetricsLoading}
          error={error}
          metrics={metrics}
        />
      </TableCell>

      <TableCell className="p-1">
        <OrgSelect
          value={line.itemCode ? line.organization.toString() : ''}
          options={orgOptions}
          isDisabled={isOrgDisabled}
          onChange={handleOrgChange}
        />
      </TableCell>

      <TableCell className="p-1"><QuantityInput value={line.qty} onChange={handleQtyChange} /></TableCell>
      <TableCell className="p-1"><QuantityInput value={line.qty} onChange={handleQtyChange} /></TableCell>
      <TableCell className="p-1"><QuantityInput value={line.qty} onChange={handleQtyChange} /></TableCell>
      <TableCell className="p-1"><QuantityInput value={line.qty} onChange={handleQtyChange} /></TableCell>
      <TableCell className="p-1"><QuantityInput value={line.qty} onChange={handleQtyChange} /></TableCell>
      <TableCell className="p-1"><QuantityInput value={line.qty} onChange={handleQtyChange} /></TableCell>
      <TableCell className="p-1"><QuantityInput value={line.qty} onChange={handleQtyChange} /></TableCell>

      <TableCell className="p-1">
        <DateInput value={line.targetDate} onChange={handleDateChange} />
      </TableCell>

      <ActionCell isDisabled={!canRemove} onRemove={handleRemove} />
    </TableRow>
  );
}