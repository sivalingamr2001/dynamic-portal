'use client';

import type { ItemOperatingUnitDto } from '@/api/allocationApi';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Select from 'react-select';
import { Select as Sel, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ItemLine {
  id: number;
  organization: string;
  itemCode: string;
  itemName: string;
  qty: string;
  targetDate: string;
}

interface ItemLinesProps {
  itemLines: ItemLine[];
  onChange: (id: number, field: string, value: any) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
  ItemOperatingUnitDto?: ItemOperatingUnitDto[];
  selectedOrgId?: string;
  billToCustomerId: string;
  billToLocationId: string;
  searchItemCodes?: (searchTerm: string) => void;
  itemCodeOptions?: { inventoryItemId: string; itemCode: string; description: string }[];
  loadingItemCodes?: boolean;
}

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
  loadingItemCodes
}: ItemLinesProps) {
  const [itemCodeOptionsInternal, setItemCodeOptionsInternal] = useState<any[]>([]);
  const [loadingItemCodesInternal, setLoadingItemCodesInternal] = useState(false);
  const [demandMetrics, setDemandMetrics] = useState<Record<number, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});
  const [loadingMetrics, setLoadingMetrics] = useState<Record<number, boolean>>({});

  // Normalize incoming option shapes so react-select always receives { value, label } objects
  const normalizedItemCodeOptions = (itemCodeOptions && itemCodeOptions.length)
    ? itemCodeOptions.map((opt: any) => {
      // If already in { value, label } shape, keep as-is
      if (opt && (opt.value !== undefined || opt.label !== undefined)) return opt;

      const value = opt?.value ?? opt?.itemCode ?? '';
      const label = opt?.label ?? (opt?.description ? `${opt.description}` : value);
      return { value, label, inventoryItemId: opt?.inventoryItemId, description: opt?.description };
    })
    : itemCodeOptionsInternal;

  // Mock fallback search function when an external search handler is not provided
  const searchItemCodesInternal = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setItemCodeOptionsInternal([]);
      return;
    }

    setLoadingItemCodesInternal(true);
    setLoadingItemCodesInternal(false);
  };

  // Mock function to validate RRS category and fetch demand metrics
  const validateAndFetchMetrics = async (
    lineId: number,
    organizationId: string,
    itemCode: string
  ) => {
    if (!billToCustomerId || !organizationId || !itemCode) {
      return;
    }

    setLoadingMetrics((prev) => ({ ...prev, [lineId]: true }));
    setValidationErrors((prev) => ({ ...prev, [lineId]: '' }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const isValidCategory = Math.random() > 0.1; // 90% success rule metrics simulation
      if (!isValidCategory) {
        setValidationErrors((prev) => ({
          ...prev,
          [lineId]: 'Cannot create this item as per validation rules (RRS category mismatch)',
        }));
        setLoadingMetrics((prev) => ({ ...prev, [lineId]: false }));
        return;
      }

      const mockMetrics = {
        demand: Math.floor(Math.random() * 1000) + 100,
        forecast: Math.floor(Math.random() * 500) + 50,
        safety_stock: Math.floor(Math.random() * 200) + 10,
        recommended_qty: Math.floor(Math.random() * 800) + 100,
      };

      setDemandMetrics((prev) => ({ ...prev, [lineId]: mockMetrics }));
    } catch (error) {
      setValidationErrors((prev) => ({
        ...prev,
        [lineId]: 'Error fetching demand metrics. Please try again.',
      }));
    } {
      setLoadingMetrics((prev) => ({ ...prev, [lineId]: false }));
    }
  };

  const handleItemCodeChange = (lineId: number, option: any) => {
    if (!option) {
      onChange(lineId, 'itemCode', '');
      onChange(lineId, 'inventoryItemId', null);
      onChange(lineId, 'itemName', ''); // Clears auto-populated description input box
      return;
    }

    // Save InventoryItemId for API payloads, use Description as the row item name display text
    onChange(lineId, 'itemCode', option.value); // Selected Item Code text string
    onChange(lineId, 'inventoryItemId', option.inventoryItemId); // API numerical ID key
    onChange(lineId, 'itemName', option.description || 'No description'); // Auto-populates input field

    // If an organization is already selected for this line, validate and fetch metrics
    const currentLine = itemLines.find((l) => l.id === lineId);
    if (currentLine?.organization) {
      validateAndFetchMetrics(lineId, currentLine.organization, option.value);
    }
  };

  const handleOrganizationChange = (lineId: number, option: any) => {
    if (option) {
      onChange(lineId, 'organization', option.value);

      const line = itemLines.find((l) => l.id === lineId);
      if (line?.itemCode) {
        validateAndFetchMetrics(lineId, option.value, line.itemCode);
      }
    }
  };

  // Custom react-select micro overrides to strictly match input baseline dimensions (h-6.5)
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: '26px',
      height: '26px',
      fontSize: '11px',
      borderRadius: '4px',
      borderColor: '#e2e8f0',
      backgroundColor: '#ffffff',
      boxShadow: 'none',
      '&:hover': { borderColor: '#cbd5e1' },
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '0 6px',
      height: '26px',
    }),
    input: (base: any) => ({
      ...base,
      margin: '0px',
      padding: '0px',
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      height: '26px',
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: '2px',
    }),
    clearIndicator: (base: any) => ({
      ...base,
      padding: '2px',
    }),
    menu: (base: any) => ({
      ...base,
      fontSize: '11px',
      zIndex: 1000,
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 1000,
    }),
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Bounding box wrapper with a sticky layout header and vertical scrolling trigger */}
      <div className="overflow-x-auto rounded border border-slate-200 bg-white">
        {/* 
        This wrapper caps the height to exactly 5 rows (~220px). 
        It isolates vertical scrolling to the data rows while keeping the outer layout perfectly intact.
      */}
        <div className="max-h-55 overflow-y-auto custom-scrollbar">
          <Table className="w-full border-collapse">
            {/* Make the header sticky so it stays visible while scrolling the rows */}
            <TableHeader className="bg-slate-50/90 sticky top-0 z-10 border-b border-slate-200 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
              <TableRow className="h-7">
                <TableHead className="h-7 w-8 px-2 text-[10px] font-bold uppercase text-slate-500">#</TableHead>
                <TableHead className="h-7 w-28 px-2 text-[10px] font-bold uppercase text-slate-500">Org</TableHead>
                <TableHead className="h-7 w-40 px-2 text-[10px] font-bold uppercase text-slate-500">Item Code</TableHead>
                <TableHead className="h-7 px-2 text-[10px] font-bold uppercase text-slate-500">Description</TableHead>
                <TableHead className="h-7 w-28 px-2 text-[10px] font-bold uppercase text-slate-500">Weeks</TableHead>
                <TableHead className="h-7 w-20 px-2 text-[10px] font-bold uppercase text-slate-500">PEND Qty (BIN)</TableHead>
                <TableHead className="h-7 w-20 px-2 text-[10px] font-bold uppercase text-slate-500">RSV Qty (BIN)</TableHead>
                <TableHead className="h-7 w-20 px-2 text-[10px] font-bold uppercase text-slate-500">PICKED Qty (BIN)</TableHead>
                <TableHead className="h-7 w-20 px-2 text-[10px] font-bold uppercase text-slate-500">BIN Qty (BIN)</TableHead>
                <TableHead className="h-7 w-20 px-2 text-[10px] font-bold uppercase text-slate-500">BIN RSV Qty (BIN)</TableHead>
                <TableHead className="h-7 w-20 px-2 text-[10px] font-bold uppercase text-slate-500">Qty (BIN)</TableHead>
                <TableHead className="h-7 w-20 px-2 text-[10px] font-bold uppercase text-slate-500">Qty (BIN)</TableHead>
                <TableHead className="h-7 w-28 px-2 text-[10px] font-bold uppercase text-slate-500">Target Date</TableHead>
                <TableHead className="h-7 w-8 px-2 text-center text-[10px] font-bold uppercase text-slate-500">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {itemLines.map((line, index) => {
                const metrics = demandMetrics[line.id];
                const error = validationErrors[line.id];

                return (
                  <TableRow key={line.id} className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors">
                    <TableCell className="px-2 py-1 text-center text-xs text-slate-400 font-medium">
                      {index + 1}
                    </TableCell>

                    {/* Organization Cell */}
                    <TableCell className="p-1">
                      <Sel
                        // 1. Convert the active number ID to a string format so Shadcn can track it natively
                        value={line.itemCode ? line.organization.toString() : ""}
                        onValueChange={(selectedValueStr) => {
                          // Find the master DTO row item that matches this selected ID string
                          const matchedOu = ItemOperatingUnitDto?.find(
                            (ou) => ou.organizationId.toString() === selectedValueStr
                          );

                          if (matchedOu) {
                            // 2. FOR API: Send the true numerical organizationId back up to your hook state
                            onChange(line.id, "organization", matchedOu.organizationId);

                            // Save the UI display code representation alongside it if your layout requires it
                            onChange(line.id, "organizationCode", matchedOu.organizationCode);
                          } else {
                            onChange(line.id, "organization", "");
                          }
                        }}
                        disabled={!selectedOrgId}
                      >
                        {/* Compact trigger layout with chevron stripped out */}
                        <SelectTrigger className="h-[26px] w-full border-slate-200 bg-white px-2 py-0 text-xs font-medium text-slate-700 shadow-none outline-none focus:ring-0 focus:border-slate-400 gap-0 rounded [&>svg]:hidden justify-start">
                          <SelectValue placeholder="Select Org..." />
                        </SelectTrigger>

                        <SelectContent className="text-xs min-w-[var(--radix-select-trigger-width)] max-h-[200px] bg-background text-foreground z-50">
                          {ItemOperatingUnitDto?.map((ou) => (
                            <SelectItem
                              // 3. Keep the underlying tracking value mapped strictly to the ID string for your API handlers
                              key={ou.organizationId}
                              value={ou.organizationCode.toString()}
                              className="text-xs py-1 px-2 font-medium cursor-pointer"
                            >
                              {/* 4. FOR UI: Render the code string description directly inside the viewport text slot */}
                              {ou.organizationCode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Sel>
                    </TableCell>



                    {/* Item Code Cell (With Custom 3-Field Display Layout) */}
                    <TableCell className="p-1">
                      <Select
                        options={normalizedItemCodeOptions?.length ? normalizedItemCodeOptions : itemCodeOptionsInternal}
                        onInputChange={(value) => {
                          if (searchItemCodes) {
                            searchItemCodes(value)
                          } else {
                            searchItemCodesInternal(value)
                          }
                        }}
                        onChange={(option) => handleItemCodeChange(line.id, option)}
                        value={
                          (normalizedItemCodeOptions ?? itemCodeOptionsInternal).find((o: any) => o.value === line.itemCode) ||
                          (line.itemCode ? { value: line.itemCode, label: line.itemCode } : null)
                        }
                        placeholder="Search code..."
                        isLoading={loadingItemCodes ?? loadingItemCodesInternal}
                        isClearable
                        styles={selectStyles}
                        isDisabled={!line.organization}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        formatOptionLabel={(option: any) => {
                          const itemCode = option.value || option.itemCode || "N/A";

                          return (
                            <div className="flex flex-col gap-0.5 py-0.5 text-[11px] leading-tight text-left">
                              <div className="flex items-center justify-between font-semibold text-slate-800 gap-4">
                                <span className="text-primary font-mono">{itemCode}</span>
                              </div>
                            </div>
                          );
                        }}
                      />
                    </TableCell>

                    {/* Dense Information Column: Handles title inputs + inline metric grids */}
                    <TableCell className="p-1">
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-x-2 gap-y-0.5 flex-wrap text-[10px] font-medium text-slate-500 bg-slate-50/80 px-1.5 py-0.5 rounded border border-slate-100 max-w-max">
                          <span className="text-primary font-mono">{line.itemName}</span>
                        </div>

                        {/* Async loader notification layer */}
                        {loadingMetrics[line.id] && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium px-0.5">
                            <Loader2 className="h-2.5 w-2.5 animate-spin text-slate-400" /> Verifying constraints...
                          </span>
                        )}

                        {/* Inline error alerts replacing standalone components */}
                        {error && (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 max-w-max">
                            <AlertCircle className="h-2.5 w-2.5 shrink-0" /> {error}
                          </span>
                        )}

                        {/* Ultra-compact side-by-side dashboard statistics loop */}
                        {!error && metrics && (
                          <div className="flex items-center gap-x-2 gap-y-0.5 flex-wrap text-[10px] font-medium text-slate-500 bg-slate-50/80 px-1.5 py-0.5 rounded border border-slate-100 max-w-max">
                            <span className="text-slate-700 font-bold">Metrics:</span>
                            <span>Dem: <strong className="text-slate-900">{metrics.demand}</strong></span>
                            <span>Fcst: <strong className="text-slate-900">{metrics.forecast}</strong></span>
                            <span>Safety: <strong className="text-slate-900">{metrics.safety_stock}</strong></span>
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-0.5 rounded">Rec Qty: {metrics.recommended_qty}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="p-1">
                      <Sel
                        // 1. Convert the active number ID to a string format so Shadcn can track it natively
                        value={line.itemCode ? line.organization.toString() : ""}
                        onValueChange={(selectedValueStr) => {
                          // Find the master DTO row item that matches this selected ID string
                          const matchedOu = ItemOperatingUnitDto?.find(
                            (ou) => ou.organizationId.toString() === selectedValueStr
                          );

                          if (matchedOu) {
                            // 2. FOR API: Send the true numerical organizationId back up to your hook state
                            onChange(line.id, "organization", matchedOu.organizationId);

                            // Save the UI display code representation alongside it if your layout requires it
                            onChange(line.id, "organizationCode", matchedOu.organizationCode);
                          } else {
                            onChange(line.id, "organization", "");
                          }
                        }}
                        disabled={!selectedOrgId}
                      >
                        {/* Compact trigger layout with chevron stripped out */}
                        <SelectTrigger className="h-[26px] w-full border-slate-200 bg-white px-2 py-0 text-xs font-medium text-slate-700 shadow-none outline-none focus:ring-0 focus:border-slate-400 gap-0 rounded [&>svg]:hidden justify-start">
                          <SelectValue placeholder="Select Org..." />
                        </SelectTrigger>

                        <SelectContent className="text-xs min-w-[var(--radix-select-trigger-width)] max-h-[200px] bg-background text-foreground z-50">
                          {ItemOperatingUnitDto?.map((ou) => (
                            <SelectItem
                              // 3. Keep the underlying tracking value mapped strictly to the ID string for your API handlers
                              key={ou.organizationId}
                              value={ou.organizationCode.toString()}
                              className="text-xs py-1 px-2 font-medium cursor-pointer"
                            >
                              {/* 4. FOR UI: Render the code string description directly inside the viewport text slot */}
                              {ou.organizationCode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Sel>
                    </TableCell>


                    <TableCell className="p-1">
                      <Input
                        type="number"
                        value={line.qty}
                        onChange={(e) => onChange(line.id, 'qty', e.target.value)}
                        placeholder="0"
                        min="0"
                        className="h-6 px-1.5 text-xs text-right border-slate-200 focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        value={line.qty}
                        onChange={(e) => onChange(line.id, 'qty', e.target.value)}
                        placeholder="0"
                        min="0"
                        className="h-6 px-1.5 text-xs text-right border-slate-200 focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        value={line.qty}
                        onChange={(e) => onChange(line.id, 'qty', e.target.value)}
                        placeholder="0"
                        min="0"
                        className="h-6 px-1.5 text-xs text-right border-slate-200 focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        value={line.qty}
                        onChange={(e) => onChange(line.id, 'qty', e.target.value)}
                        placeholder="0"
                        min="0"
                        className="h-6 px-1.5 text-xs text-right border-slate-200 focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        value={line.qty}
                        onChange={(e) => onChange(line.id, 'qty', e.target.value)}
                        placeholder="0"
                        min="0"
                        className="h-6 px-1.5 text-xs text-right border-slate-200 focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        value={line.qty}
                        onChange={(e) => onChange(line.id, 'qty', e.target.value)}
                        placeholder="0"
                        min="0"
                        className="h-6 px-1.5 text-xs text-right border-slate-200 focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="number"
                        value={line.qty}
                        onChange={(e) => onChange(line.id, 'qty', e.target.value)}
                        placeholder="0"
                        min="0"
                        className="h-6 px-1.5 text-xs text-right border-slate-200 focus-visible:ring-1"
                      />
                    </TableCell>

                    <TableCell className="p-1">
                      <Input
                        type="date"
                        value={line.targetDate}
                        onChange={(e) => onChange(line.id, 'targetDate', e.target.value)}
                        className="h-6 px-1.5 text-xs border-slate-200 focus-visible:ring-1 text-slate-600"
                      />
                    </TableCell>

                    <TableCell className="p-1 text-center">
                      <button
                        type="button"
                        onClick={() => onRemove(line.id)}
                        disabled={itemLines.length === 1}
                        className="inline-flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

          </Table>
        </div>
      </div>

      {/* Dashed line action controller */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-6 items-center gap-1 rounded border border-dashed border-slate-300 bg-white px-2.5 text-[10px] font-bold text-slate-600 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <Plus className="h-3 w-3" /> Add Item Line
        </button>
      </div>
    </div>
  );
}
