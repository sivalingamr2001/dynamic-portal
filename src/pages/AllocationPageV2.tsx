'use client';

import CustomerForm from "@/components/allocationPagev2/CustomerForm";
import ItemLines from "@/components/allocationPagev2/ItemLines";
import OpenPoolForm from "@/components/allocationPagev2/OpenPoolForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllocationForm } from "@/features/Allocation/hooks/useAllocationForm";
import { PageHeader } from "@/Layout/PageHeader";
import { ChevronDown, ClipboardList, Send } from "lucide-react";
import { useState } from "react";

interface ItemLine {
    id: number;
    organization: string;
    itemCode: string;
    itemName: string;
    qty: string;
    targetDate: string;
}

export default function AllocationPageV2() {
    // Initialize your custom API data tracking layer hook 
    const allocationHook = useAllocationForm();

    // Keep the local state for structural layout navigation visibility toggles
    const [mode, setMode] = useState<'customer' | 'pool'>('customer');
    const [remarks, setRemarks] = useState<string>('');
    const [itemLines, setItemLines] = useState<ItemLine[]>([
        { id: 1, organization: '', itemCode: '', itemName: '', qty: '', targetDate: '' },
    ]);

    const handleItemLineChange = (id: number, field: string, value: any) => {
        setItemLines((prev) =>
            prev.map((line) =>
                line.id === id
                    ? ({ ...line, [field]: value })
                    : line
            )
        );
    };

    const handleAddItemLine = () => {
        setItemLines((prev) => [
            ...prev,
            {
                id: prev.length ? Math.max(...prev.map((line) => line.id)) + 1 : 1,
                organization: '',
                itemCode: '',
                itemName: '',
                qty: '',
                targetDate: '',
            },
        ]);
    };

    const handleRemoveItemLine = (id: number) => {
        setItemLines((prev) => prev.filter((line) => line.id !== id));
    };

    // Assemble a consolidated object wrapper for the CustomerForm payload
    const customerFormData = {
        territory: allocationHook.selectedRegion,
        subTerritory: allocationHook.selectedSubRegion,
        operatingUnit: allocationHook.selectedOrgId?.toString() || '',
        billToCustomerId: allocationHook.selectedBillToCustomer?.toString() || '',
        billToCustomerName: allocationHook.billToCustomers.find(c => c.customerId === allocationHook.selectedBillToCustomer)?.customerName || '',
        billToLocation: allocationHook.selectedBillToAddress,
        billingAddress: '',
        shipToCustomerId: allocationHook.selectedShipToCustomer?.toString() || '',
        shipToCustomerName: allocationHook.shipToCustomers.find(c => c.customerId === allocationHook.selectedShipToCustomer)?.customerName || '',
        shipToLocation: allocationHook.selectedShipToAddress,
        shippingAddress: '',
        remarks: remarks,
    };

    // Centralized handler matching field mappings cleanly down into the state setters
    const handleFormChange = (field: string, value: any) => {
        switch (field) {
            case "territory":
                allocationHook.setSelectedRegion(value);
                allocationHook.setSelectedSubRegion(''); // Reset downstream dependencies
                break;
            case "subTerritory":
                allocationHook.setSelectedSubRegion(value);
                break;
            case "operatingUnit":
                allocationHook.setSelectedOrgId(value ? Number(value) : null);
                break;
            case "billToCustomerName":
                // Handle searching or matching logic; sets the key ID downstream
                const selectedBillTo = allocationHook.billToCustomers.find(c => c.customerName.toLowerCase().includes(value.toLowerCase()));
                if (selectedBillTo) allocationHook.setSelectedBillToCustomer(selectedBillTo.customerId);
                break;
            case "shipToCustomerName":
                const selectedShipTo = allocationHook.shipToCustomers.find(c => c.customerName.toLowerCase().includes(value.toLowerCase()));
                if (selectedShipTo) allocationHook.setSelectedShipToCustomer(selectedShipTo.customerId);
                break;
            case "remarks":
                setRemarks(value);
                break;
            default:
                break;
        }
    };

    return (
        <main className="min-h-screen bg-slate-50/50 p-0">
            <div className="mx-auto flex flex-col gap-4">

                {/* Compact Page Header Layer */}
                <PageHeader
                    icon={ClipboardList}
                    title="New BIN Allocation"
                    description="Forecast commitment — allocate stock by customer or open pool"
                    action={
                        <Button size="sm" className="px-3 text-xs font-semibold gap-1.5 shadow-xs bg-green-600" disabled={allocationHook.loading}>
                            <Send className="h-3.5 w-3.5" /> Submit for Approval
                        </Button>
                    }
                />

                {/* Space-saving Inline Allocation Type Row */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-3">
                    <div className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                        Allocation Type
                    </div>
                    <Tabs value={mode} onValueChange={(v) => setMode(v as 'customer' | 'pool')} className="w-full sm:w-auto">
                        <TabsList className="grid w-full sm:w-64 h-7 grid-cols-2 p-0.5 bg-slate-100 border border-slate-200/60 rounded-md">
                            <TabsTrigger value="customer" className="h-6 text-xs font-medium rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-xs">
                                Select Customer
                            </TabsTrigger>
                            <TabsTrigger value="pool" className="h-6 text-xs font-medium rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-xs">
                                Open Pool
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Dynamic Details Core Form Element Panel Block */}
                <details className="group bg-white rounded border border-slate-200 p-3 shadow-2xs w-full" open>
                    {/* Clickable Header Area Container */}
                    <summary className="flex w-full cursor-pointer list-none items-center justify-between outline-none select-none">
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2.5">
                            <span className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                                Header Details
                            </span>
                            {/* Dynamic visual preview summary string visible ONLY when the panel is closed */}
                            <span className="text-xs font-medium text-slate-400 transition-all duration-150 truncate max-w-xl group-open:invisible group-open:opacity-0 group-open:max-w-0">
                                {mode === 'customer' ? (
                                    [
                                        customerFormData.territory ? `Territory: ${customerFormData.territory}` : null,
                                        customerFormData.subTerritory ? `Sub: ${customerFormData.subTerritory}` : null,
                                        customerFormData.billToCustomerName ? `Client: ${customerFormData.billToCustomerName}` : null
                                    ].filter(Boolean).join(" | ") || "(No customer parameters configured)"
                                ) : (
                                    remarks ? `Pool Remarks: ${remarks}` : "(Open Pool - No remarks added)"
                                )}
                            </span>
                        </div>
                        {/* Animated compact layout toggle indicator icon arrow */}
                        <div className="flex h-5 w-5 items-center justify-center rounded border border-slate-100 bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100/80">
                            <ChevronDown className="h-3.5 w-3.5 ease-in-out transition-transform duration-200 group-open:rotate-180" />
                        </div>
                    </summary>

                    {/* Form Field Area Content Grid Container (renders cleanly upon expand) */}
                    <div className="mt-3 border-t border-slate-100 pt-3 w-full animate-in fade-in duration-200">
                        {mode === 'customer' ? (
                            <CustomerForm
                                formData={customerFormData}
                                onChange={handleFormChange}
                                className="text-xs"
                                regions={allocationHook.regions}
                                operatingUnits={allocationHook.operatingUnits}
                                billToCustomers={allocationHook.billToCustomers}
                                shipToCustomers={allocationHook.shipToCustomers}
                                billtoAddresses={allocationHook.billToAddresses}
                                shipToAddresses={allocationHook.shipToAddresses}
                            />
                        ) : (
                            <OpenPoolForm
                                remarks={remarks}
                                onChange={(value) => setRemarks(value)}
                            />
                        )}
                    </div>
                </details>

                {/* Operational Item Rows Grid Table Panel */}
                <div className="bg-white rounded border border-slate-200 p-3 shadow-2xs">
                    <div className="text-xs font-bold tracking-wide text-slate-500 uppercase mb-2">
                        Item Lines
                    </div>
                    <ItemLines
                        itemLines={itemLines}
                        onChange={(id, field, value) => {
                            handleItemLineChange(id, field, value);
                            if (field === 'itemCode') {
                                allocationHook.fetchSingleItemByCode(value);
                            }
                        }}
                        onAdd={handleAddItemLine}
                        onRemove={handleRemoveItemLine}
                        ItemOperatingUnitDto={allocationHook.itemOperatingUnits}
                        selectedOrgId={customerFormData.operatingUnit}
                        billToCustomerId={customerFormData.billToCustomerId}
                        billToLocationId={customerFormData.billToLocation}
                        searchItemCodes={(searchTerm: string) => allocationHook.searchInventoryItems(1, 15, searchTerm)}
                        itemCodeOptions={allocationHook.itemsData?.data.map((item) => ({
                            inventoryItemId: item.inventoryItemId,
                            itemCode: item.itemCode,
                            description: item.description,
                        })) || []}
                        loadingItemCodes={allocationHook.loading}
                    />
                </div>

            </div>
        </main>
    );
}
