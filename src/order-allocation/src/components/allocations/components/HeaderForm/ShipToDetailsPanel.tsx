import React, { useEffect, useState, useRef } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getShipToCustomersApi, getCustomerAddressesApi } from '@/api/allocationApi'
import type { CustomerDto, AddressDto } from '@/api/allocationApi'

interface ShipToDetailsPanelProps {
  form: UseFormReturn<any>
  region?: string
  subRegion?: string
}

export const ShipToDetailsPanel: React.FC<ShipToDetailsPanelProps> = ({ form, region, subRegion }) => {
  const { register, setValue, watch } = form
  const containerRef = useRef<HTMLDivElement>(null)

  // Watch customerType to toggle input modes dynamically
  const customerType = watch('customerType') || "existing"
  const selectedShipToId = watch('shipToId') || ""
  const selectedOrgId = watch('operatingUnit') || ""
  const selectedLocation = watch('shipToLocation') || ""
  const currentAddressText = watch('shipToAddress') || ""

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
    getShipToCustomersApi(region, subRegion)
      .then((data) => setCustomers(data || []))
      .catch((error) => {
        console.error('Failed to load Ship-To customers:', error)
        setCustomers([])
      })
  }, [region, subRegion, customerType])

  useEffect(() => {
    if (selectedShipToId && customers.length > 0 && customerType === 'existing') {
      const match = customers.find((c) => String(c.customerId) === String(selectedShipToId))
      if (match) setSearch(match.customerName || '')
    }
  }, [selectedShipToId, customers, customerType])

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
    if (!selectedShipToId || !selectedOrgId || customerType === 'new') {
      setLocations([])
      return
    }

    setLoadingLocations(true)
    getCustomerAddressesApi(Number(selectedShipToId), 'SHIP_TO', Number(selectedOrgId))
      .then((addressData) => {
        const addressArray = Array.isArray(addressData) ? addressData : [addressData]
        setLocations(addressArray.filter(Boolean))
      })
      .catch((err) => {
        console.error('Failed fetching Ship-To address indexes:', err)
        setLocations([])
      })
      .finally(() => setLoadingLocations(false))
  }, [selectedShipToId, selectedOrgId, customerType])

  const filteredCustomers = customers.filter((c) =>
    String(c.customerName || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleCustomerSelect = (cust: CustomerDto) => {
    setSearch(cust.customerName || '')
    setOpenDropdown(false)
    setValue('shipToId', String(cust.customerId), { shouldValidate: true })
    setValue('shipToCustomer', cust.customerName || '')
    setValue('shipToLocation', '')
    setValue('shipToAddress', '')
  }

  const handleLocationChange = (locName: string) => {
    setValue('shipToLocation', locName, { shouldValidate: true })
    const match = locations.find((l) => String(l.location || '') === locName)
    if (match) {
      const fullAddress = [match.address1, match.address2, match.address3, match.city, match.postalCode]
        .filter(Boolean)
        .map(str => str.trim())
        .join(', ')
      setValue('shipToAddress', fullAddress, { shouldValidate: true })
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
        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Ship To Details</h4>
      </div>

      {/* Customer Name Field Row */}
      <div className="space-y-1 relative">
        <Label className="text-[11px] text-muted-foreground">Ship-To Customer Name</Label>
        {customerType === 'new' ? (
          // Manual entry text field if customer category is NEW
          <Input
            className="h-8 text-xs bg-background"
            placeholder="Type customer account name..."
            {...register('shipToCustomer', { required: true })}
          />
        ) : (
          // Advanced lookup selector dropdown container if customer category is EXISTING
          <div className="relative">
            <Input
              className="h-8 text-xs bg-background"
              placeholder={selectedOrgId ? "Search shipping customer..." : "Select Operating Unit first"}
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
              <div className="absolute top-full left-0 z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-popover shadow-md border-border" onClick={(e) => e.stopPropagation()}>
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
        <Label className="text-[11px] text-muted-foreground">
          Ship-To Location {loadingLocations && <span className="text-[10px] text-primary animate-pulse ml-1">(Loading...)</span>}
        </Label>
        {customerType === 'new' ? (
          // Text Input for typing location details manually
          <Input
            className="h-8 text-xs bg-background"
            placeholder="Type delivery destination code..."
            {...register('shipToLocation', { required: true })}
          />
        ) : (
          // Select Dropdown field for standard account site selection loops
          <Select value={selectedLocation} onValueChange={handleLocationChange} disabled={!selectedShipToId || locations.length === 0}>
            <SelectTrigger className="h-8 text-xs bg-background">
              <SelectValue placeholder={selectedShipToId ? "Choose site location" : "Select customer first"} />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc, idx) => {
                const locVal = String(loc.location || '')
                return <SelectItem key={idx} value={locVal} className="text-xs">{locVal}</SelectItem>
              })}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Address Matrix Block */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-muted-foreground">Shipping Address</Label>
        {customerType === 'new' ? (
          // Standard text element input allowing full custom manual keyboard type entries
          <Input
            className="h-8 text-xs bg-background"
            placeholder="Enter full physical address structure..."
            {...register('shipToAddress', { required: true })}
          />
        ) : (
          // Read-only visualization viewport pane element layout
          <div className="text-xs p-2.5 min-h-[32px] flex items-center rounded-md border border-border/80 bg-muted/40 text-foreground leading-normal break-all shadow-xs">
            {currentAddressText ? currentAddressText : <span className="text-muted-foreground/70 italic">Address details will populate upon selecting a location site...</span>}
          </div>
        )}
        {customerType === 'existing' && <input type="hidden" {...register('shipToAddress')} />}
      </div>
    </div>
  )
}
