import React, { useEffect, useState, useRef, type ChangeEvent } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { getBillToCustomersApi, getCustomerAddressesApi } from '@/api/allocationApi'
import type { CustomerDto, AddressDto } from '@/api/allocationApi'

interface BillToDetailsPanelProps {
  form: UseFormReturn<any>
  region?: string
  subRegion?: string
}

export const BillToDetailsPanel: React.FC<BillToDetailsPanelProps> = ({ form, region, subRegion }) => {
  const { register, setValue, watch, formState: { errors } } = form
  const containerRef = useRef<HTMLDivElement>(null)

  // Watch customerType to toggle input modes dynamically
  const customerType = watch('customerType') || "existing"
  const selectedBillToId = watch('billToId') || ""
  const selectedOrgId = watch('operatingUnit') || ""
  const selectedLocation = watch('billToLocation') || ""
  const currentAddressText = watch('billToAddress') || ""

  const [customers, setCustomers] = useState<CustomerDto[]>([])
  const [search, setSearch] = useState('')
  const [openDropdown, setOpenDropdown] = useState(false)
  const [locations, setLocations] = useState<AddressDto[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)

  useEffect(() => {
    if (!region || !subRegion || customerType === 'new') {
      setCustomers([])
      return
    }
    getBillToCustomersApi(region, subRegion)
      .then((data) => setCustomers(data || []))
      .catch((error) => {
        console.error('Failed to load Bill-To customers:', error)
        setCustomers([])
      })
  }, [region, subRegion, customerType])

  useEffect(() => {
    if (selectedBillToId && customers.length > 0 && customerType === 'existing') {
      const match = customers.find((c) => String(c.customerId) === String(selectedBillToId))
      if (match) setSearch(match.customerName || '')
    }
  }, [selectedBillToId, customers, customerType])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!selectedBillToId || !selectedOrgId || customerType === 'new') {
      setLocations([])
      return
    }

    setLoadingLocations(true)
    getCustomerAddressesApi(Number(selectedBillToId), 'BILL_TO', Number(selectedOrgId))
      .then((addressData) => {
        const addressArray = Array.isArray(addressData) ? addressData : [addressData]
        setLocations(addressArray.filter(Boolean))
      })
      .catch((err) => {
        console.error('Failed fetching Bill-To address indexes:', err)
        setLocations([])
      })
      .finally(() => setLoadingLocations(false))
  }, [selectedBillToId, selectedOrgId, customerType])

  const filteredCustomers = customers.filter((c) =>
    String(c.customerName || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleCustomerSelect = (cust: CustomerDto) => {
    setSearch(cust.customerName || '')
    setOpenDropdown(false)
    setValue('billToId', String(cust.customerId), { shouldValidate: true })
    setValue('billToCustomer', cust.customerName || '')
    setValue('billToLocation', '')
    setValue('billToAddress', '')
  }

  const handleLocationChange = (locName: string) => {
    setValue('billToLocation', locName, { shouldValidate: true })
    const match = locations.find((l) => String(l.location || '') === locName)
    if (match) {
      const fullAddress = [match.address1, match.address2, match.address3, match.city, match.postalCode]
        .filter(Boolean)
        .map(str => str.trim())
        .join(', ')
      setValue('billToAddress', fullAddress, { shouldValidate: true })
    }
  }

  useEffect(() => {
    // If exactly one location site is available for the current customer selection profile
    if (customerType === 'existing' && locations.length === 1 && !selectedLocation) {
      const defaultLocVal = String(locations[0].location || '');
      if (defaultLocVal) {
        // Trigger the active select option change handler function directly to populate the address text line block
        handleLocationChange(defaultLocVal);
      }
    }
  }, [locations, selectedLocation, customerType]);

  return (
    <div className="bg-card p-3 rounded-lg border border-border/80 space-y-2.5 shadow-xs" ref={containerRef}>
      <div className="border-b border-border pb-1.5 mb-1">
        <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Bill To Details</h4>
      </div>

      {/* Customer Name Field Row */}
      <div className="space-y-1 relative">
        <label className="text-[11px] text-muted-foreground">Bill-To Customer Name</label>
        {customerType === 'new' ? (
          // Renders manual typing field if customer type is NEW
          <Input
            className="h-8 text-xs bg-background"
            placeholder="Type customer account name..."
            {...register('billToCustomer', { required: true })}
          />
        ) : (
          // Renders search selector layout if customer type is EXISTING
          <div className="relative">
            <Input
              className="h-8 text-xs bg-background"
              placeholder={selectedOrgId ? "Search billing customer..." : "Select Operating Unit first"}
              value={search}
              disabled={!selectedOrgId}
              onClick={(e) => {
                e.stopPropagation()
                if (selectedOrgId) setOpenDropdown(true)
              }}
              onChange={(e) => {
                setSearch(e.target.value)
                setOpenDropdown(true)
              }}
            />
            {openDropdown && (
              <div className="absolute bg-muted top-full left-0 z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-popover shadow-md border-border" onClick={(e) => e.stopPropagation()}>
                {filteredCustomers.length === 0 && (
                  <div className="p-3 text-center text-xs text-muted-foreground">No records found</div>
                )}
                {filteredCustomers.map((cust) => (
                  <button
                    type="button"
                    key={cust.customerId}
                    className="w-full px-3 py-1.5 text-left hover:bg-accent text-xs border-b last:border-0 border-muted/40 block text-foreground truncate"
                    onClick={() => handleCustomerSelect(cust)}
                  >
                    {cust.customerId} - {cust.customerName}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Location Identification Row */}
      <div className="space-y-1">
        <label className="text-[11px] text-muted-foreground">
          Bill-To Location {loadingLocations && <span className="text-[10px] text-primary animate-pulse ml-1">(Loading...)</span>}
        </label>
        {customerType === 'new' ? (
          <Input
            className="h-8 text-xs bg-background"
            placeholder="Type location tag or code..."
            {...register('billToLocation', { required: true })}
          />
        ) : (
          <select
            value={selectedLocation}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleLocationChange(e.target.value)}
            disabled={!selectedBillToId || locations.length === 0}
            className="h-8 w-full rounded-md border border-input bg-input/20 px-2 py-1 text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            <option value="">{selectedBillToId ? "Choose site location" : "Select customer first"}</option>
            {locations.map((loc, idx) => {
              const locVal = String(loc.location || '')
              return (
                <option key={idx} value={locVal} className="text-xs">
                  {locVal}
                </option>
              )
            })}
          </select>
        )}
      </div>

      {/* Address Matrix block */}
      <div className="space-y-1.5">
        <label className="text-[11px] text-muted-foreground">Billing Address</label>
        {customerType === 'new' ? (
          // Renders editable standard text input field for manual setup entry tracking
          <Input
            className="h-8 text-xs bg-background"
            placeholder="Enter full physical address structure..."
            {...register('billToAddress', { required: true })}
          />
        ) : (
          // Renders clear read-only visual viewport panel card for standard selection profiles
          <div className="text-xs p-2.5 min-h-8 flex items-center rounded-md border border-border/80 bg-muted/40 text-foreground leading-normal break-all shadow-xs">
            {currentAddressText ? currentAddressText : <span className="text-muted-foreground/70 italic">Address details will populate upon selecting a location site...</span>}
          </div>
        )}
        {customerType === 'existing' && <input type="hidden" {...register('billToAddress')} />}
      </div>
    </div>
  )
}
