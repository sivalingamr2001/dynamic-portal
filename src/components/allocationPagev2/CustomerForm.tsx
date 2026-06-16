import type { RegionDetailsDto, OperatingUnitDto } from "@/api/allocationApi";
import { cn } from "@/lib/utils";
import Select from "react-select";

export interface AddressDto {
  address1: string;
  address2?: string;
  address3?: string;
  city: string;
  postalCode: string;
  orgId: number;
  location: string;
}

export interface CustomerFormProps {
  formData: {
    territory: string;
    subTerritory: string;
    operatingUnit: string;
    billToCustomerId: string;
    billToCustomerName: string;
    billToLocation: string;
    billingAddress: string;
    shipToCustomerId: string;
    shipToCustomerName: string;
    shipToLocation: string;
    shippingAddress: string;
    remarks: string;
  };
  onChange: (field: string, value: any) => void;
  className?: string;
  regions?: RegionDetailsDto[];
  operatingUnits?: OperatingUnitDto[];
  billToCustomers?: { customerId: number; customerName: string }[];
  shipToCustomers?: { customerId: number; customerName: string }[];
  billtoAddresses?: AddressDto[]; // 👈 Array repositories from useAllocationForm hook
  shipToAddresses?: AddressDto[]; // 👈 Array repositories from useAllocationForm hook
}

export default function CustomerForm({
  formData,
  onChange,
  className,
  regions = [],
  operatingUnits = [],
  billToCustomers = [],
  shipToCustomers = [],
  billtoAddresses = [],
  shipToAddresses = [],
}: CustomerFormProps) {

  const uniqueTerritories = Array.from(new Set(regions.map((r) => r.region)));

  const billToOptions = billToCustomers.map((c) => ({
    value: c.customerId.toString(),
    label: c.customerName,
  }));

  const shipToOptions = shipToCustomers.map((c) => ({
    value: c.customerId.toString(),
    label: c.customerName,
  }));

  // Standard react-select micro style tokens (h-7 layout baseline)
  const compactSelectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "26px",
      height: "26px",
      fontSize: "11px",
      borderRadius: "4px",
      borderColor: "#e2e8f0",
      boxShadow: "none",
      "&:hover": { borderColor: "#cbd5e1" },
    }),
    valueContainer: (base: any) => ({ ...base, padding: "0 8px", height: "26px" }),
    input: (base: any) => ({ ...base, margin: "0px", padding: "0px" }),
    indicatorsContainer: (base: any) => ({ ...base, height: "26px" }),
    dropdownIndicator: (base: any) => ({ ...base, padding: "2px" }),
    clearIndicator: (base: any) => ({ ...base, padding: "2px" }),
    menu: (base: any) => ({ ...base, fontSize: "11px", zIndex: 40 }),
  };

  // Compiles active metadata segments into an array of distinct row definitions
  const getAddressRows = (addressObj?: AddressDto) => {
    if (!addressObj) return [];
    return [
      addressObj.address1 ? { label: "Line 1", value: addressObj.address1 } : null,
      addressObj.address2 ? { label: "Line 2", value: addressObj.address2 } : null,
      addressObj.address3 ? { label: "Line 3", value: addressObj.address3 } : null,
      addressObj.city ? { label: "City", value: addressObj.city } : null,
      addressObj.postalCode ? { label: "Pin Code", value: addressObj.postalCode } : null,
    ].filter(Boolean) as { label: string; value: string }[];
  };

  const billToAddressRows = getAddressRows(billtoAddresses[0]);
  const shipToAddressRows = getAddressRows(shipToAddresses[0]);

  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>

      {/* Row 1: Triple Geographic Selector Dropdowns */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {/* Territory Region Select Option */}
        <div className="flex flex-col gap-0.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Territory Region</label>
          <select
            value={formData.territory}
            onChange={(e) => onChange("territory", e.target.value)}
            className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 text-xs outline-none focus:border-slate-400"
          >
            <option value="">Select Territory</option>
            {uniqueTerritories.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Sub-Territory Select Option (SPLIT & FLATTEN FIXED) */}
        <div className="flex flex-col gap-0.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Sub-Territory</label>
          <select
            value={formData.subTerritory}
            onChange={(e) => onChange("subTerritory", e.target.value)}
            className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 text-xs outline-none disabled:bg-slate-50 disabled:text-slate-400"
            disabled={!formData.territory}
          >
            <option value="">Select Sub-Territory</option>
            {Array.from(
              new Set(
                regions
                  .filter((r) => r.region === formData.territory && r.subRegion)
                  .flatMap((r) => r.subRegion.split(",")) // Splits comma strings & flattens into a single array
                  .map((sub) => sub.trim()) // Cleans up any trailing whitespace
              )
            ).map((cleanSubTerritory) => (
              <option key={cleanSubTerritory} value={cleanSubTerritory}>
                {cleanSubTerritory}
              </option>
            ))}
          </select>
        </div>

        {/* Operating Unit Select Option */}
        <div className="flex flex-col gap-0.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Operating Unit</label>
          <select
            value={formData.operatingUnit}
            onChange={(e) => onChange("operatingUnit", e.target.value)}
            className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 text-xs outline-none focus:border-slate-400"
          >
            <option value="">Select Operating Unit</option>
            {operatingUnits.map((unit) => (
              <option key={unit.organizationId} value={unit.organizationId}>{unit.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Bill-To & Ship-To Structural Columns Side-by-Side */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">

        {/* Bill-To Stack */}
        <div className="flex flex-col gap-2 border-t border-slate-100 pt-2">
          <div className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Bill-To Details</div>

          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-medium text-slate-500">Bill-To Customer Name</label>
            <Select
              options={billToOptions}
              value={billToOptions.find((o) => o.value === formData.billToCustomerId) || null}
              onChange={(opt: any) => {
                onChange("billToCustomerId", opt ? opt.value : "");
                onChange("billToCustomerName", opt ? opt.label : "");
              }}
              placeholder="Search & select customer..."
              isClearable
              isSearchable
              styles={compactSelectStyles}
              isDisabled={!formData.territory}
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-medium text-slate-500">Bill-To Location</label>
            <input
              type="text"
              readOnly
              placeholder="Location will populate upon selection"
              value={billtoAddresses[0]?.location || formData.billToLocation}
              className="h-7 w-full rounded border border-slate-100 bg-slate-50 px-2 text-xs text-slate-600 font-medium outline-none cursor-not-allowed"
            />
          </div>

          {/* Key-Value Block Format for Remaining Lines Data Display */}
          {billToAddressRows.length > 0 && (
            <div className="rounded bg-slate-50/70 border border-slate-100 p-1.5 text-[10px] text-slate-500 font-medium leading-normal tracking-wide">
              <span className="text-slate-700 font-bold block mb-0.5 uppercase text-[9px]">Full Address Metadata:</span>
              {billToAddressRows.map((row, index) => (
                <p key={index} className="font-mono text-slate-600">
                  <span className="font-bold text-blue-500">{row.label}:</span> {row.value}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Ship-To Stack */}
        <div className="flex flex-col gap-2 border-t border-slate-100 pt-2">
          <div className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">Ship-To Details</div>

          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-medium text-slate-500">Ship-To Customer Name</label>
            <Select
              options={shipToOptions}
              value={shipToOptions.find((o) => o.value === formData.shipToCustomerId) || null}
              onChange={(opt: any) => {
                onChange("shipToCustomerId", opt ? opt.value : "");
                onChange("shipToCustomerName", opt ? opt.label : "");
              }}
              placeholder="Search & select shipping customer..."
              isClearable
              isSearchable
              styles={compactSelectStyles}
              isDisabled={!formData.territory}
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] font-medium text-slate-500">Ship-To Location</label>
            <input
              type="text"
              readOnly
              placeholder="Address details will populate upon selection"
              value={shipToAddresses[0]?.location || formData.shipToLocation}
              className="h-7 w-full rounded border border-slate-100 bg-slate-50 px-2 text-xs text-slate-600 font-medium outline-none cursor-not-allowed"
            />
          </div>

          {/* Key-Value Block Format for Remaining Lines Data Display */}
          {shipToAddressRows.length > 0 && (
            <div className="rounded bg-slate-50/70 border border-slate-100 p-1.5 text-[10px] text-slate-500 font-medium leading-normal tracking-wide">
              <span className="text-slate-700 font-bold block mb-0.5 uppercase text-[9px]">Full Address Metadata:</span>
              {shipToAddressRows.map((row, index) => (
                <p key={index} className="font-mono text-slate-600">
                  <span className="font-bold text-blue-500">{row.label}:</span> {row.value}
                </p>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Row 3: Compact Remarks Area */}
      <div className="flex flex-col gap-0.5 border-t border-slate-100 pt-2">
        <label className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">Remarks</label>
        <textarea
          value={formData.remarks}
          onChange={(e) => onChange("remarks", e.target.value)}
          rows={1.5}
          className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400 resize-none"
          placeholder="Add remarks for this allocation"
        />
      </div>

    </div>
  );
}
