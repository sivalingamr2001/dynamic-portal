import { useState, useEffect, useCallback } from "react"
import {
  getAllRegionsApi,
  getBillToCustomersApi,
  getShipToCustomersApi,
  getPreparedByEmployeesApi,
  getCustomerAddressesApi,
  getWeeksDropdownApi,
  getOperatingUnitsApi,
  getItemOperatingUnits,
  getItemRrsCategory,
  getPaginatedItems,
  getItemByCode,
  getDemandMetricsApi,
  type RegionDetailsDto,
  type CustomerDto,
  type EmployeeDto,
  type AddressDto,
  type OperatingUnitDto,
  type ItemOperatingUnitDto,
  type AllocationItemDto,
  type DemandMetricsDto,
  type PagedResult,
} from "@/api/allocationApi" // Adjust path as needed

export const useAllocationForm = () => {
  // =========================================================================
  // METADATA DROPDOWN OPTIONS STATE
  // =========================================================================
  const [regions, setRegions] = useState<RegionDetailsDto[]>([])
  const [billToCustomers, setBillToCustomers] = useState<CustomerDto[]>([])
  const [shipToCustomers, setShipToCustomers] = useState<CustomerDto[]>([])
  const [employees, setEmployees] = useState<EmployeeDto[]>([])
  const [weeks, setWeeks] = useState<string[]>()
  const [operatingUnits, setOperatingUnits] = useState<OperatingUnitDto[]>([])
  const [itemOperatingUnits, setItemOperatingUnits] = useState<
    ItemOperatingUnitDto[]
  >([])

  // =========================================================================
  // SELECTED FORM VALUES (HEADER LAYER)
  // =========================================================================
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>("")
  const [selectedBillToCustomer, setSelectedBillToCustomer] = useState<
    number | null
  >(null)
  const [selectedShipToCustomer, setSelectedShipToCustomer] = useState<
    number | null
  >(null)
  const [billToAddresses, setBillToAddresses] = useState<AddressDto[]>([])
  const [shipToAddresses, setShipToAddresses] = useState<AddressDto[]>([])
  const [selectedBillToAddress, setSelectedBillToAddress] = useState<string>("")
  const [selectedShipToAddress, setSelectedShipToAddress] = useState<string>("")
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [selectedWeek, setSelectedWeek] = useState<string>("")
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null)

  // =========================================================================
  // GRID / LINE LAYER STATE (ITEMS & METRICS)
  // =========================================================================
  const [selectedItemOrgId, setSelectedItemOrgId] = useState<number | null>(
    null
  )
  const [rrsCategory, setRrsCategory] = useState<string>("")
  const [itemsData, setItemsData] =
    useState<PagedResult<AllocationItemDto> | null>(null)
  const [selectedItem, setSelectedItem] = useState<AllocationItemDto | null>(
    null
  )
  const [demandMetrics, setDemandMetrics] = useState<DemandMetricsDto | null>(
    null
  )

  // GLOBAL UI STATES
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // =========================================================================
  // INITIAL DATA LOAD (HEADER DICTIONARIES)
  // =========================================================================
  useEffect(() => {
    const loadInitialMetadata = async () => {
      try {
        setLoading(true)
        const [regionsData, weeksData, orgUnits, itemOrgs] = await Promise.all([
          getAllRegionsApi(),
          getWeeksDropdownApi(),
          getOperatingUnitsApi(),
          getItemOperatingUnits(),
        ])
        setRegions(regionsData)
        setWeeks(weeksData)
        setOperatingUnits(orgUnits)
        setItemOperatingUnits(itemOrgs)
      } catch (err) {
        setError("Failed to initialize form dropdown data.")
      } finally {
        setLoading(false)
      }
    }
    loadInitialMetadata()
  }, [])

  // =========================================================================
  // DEPENDENT TRIGGERS LAYER
  // =========================================================================

  // 1. Fetch Customers and Employees when Region / Sub-Region changes
  useEffect(() => {
    if (!selectedRegion) return

    const loadRegionalData = async () => {
      try {
        const [billTo, shipTo, emps] = await Promise.all([
          getBillToCustomersApi(selectedRegion, selectedSubRegion),
          getShipToCustomersApi(selectedRegion, selectedSubRegion),
          getPreparedByEmployeesApi(selectedRegion),
        ])
        setBillToCustomers(billTo)
        setShipToCustomers(shipTo)
        setEmployees(emps)
      } catch (err) {
        setError("Failed to fetch location-specific customer parameters.")
      }
    }
    loadRegionalData()
  }, [selectedRegion, selectedSubRegion])

  // 2. Fetch Bill-To Addresses when Customer or Operating Unit shifts
  useEffect(() => {
    if (!selectedBillToCustomer || !selectedOrgId) {
      setBillToAddresses([])
      return
    }
    getCustomerAddressesApi(selectedBillToCustomer, "BILL_TO", selectedOrgId)
      .then(setBillToAddresses)
      .catch(() => setError("Error resolving Bill-To address assets."))
  }, [selectedBillToCustomer, selectedOrgId])

  // 3. Fetch Ship-To Addresses when Customer or Operating Unit shifts
  useEffect(() => {
    if (!selectedShipToCustomer || !selectedOrgId) {
      setShipToAddresses([])
      return
    }
    getCustomerAddressesApi(selectedShipToCustomer, "SHIP_TO", selectedOrgId)
      .then(setShipToAddresses)
      .catch(() => setError("Error resolving Ship-To address assets."))
  }, [selectedShipToCustomer, selectedOrgId])

  // 4. Fetch RRS Category when grid organization or selected item updates
  useEffect(() => {
    if (!selectedItemOrgId || !selectedItem?.inventoryItemId) {
      setRrsCategory("")
      return
    }
    getItemRrsCategory(selectedItemOrgId, selectedItem.inventoryItemId)
      .then((res) => setRrsCategory(res.rrsCategory))
      .catch(() => setRrsCategory(""))
  }, [selectedItemOrgId, selectedItem])

  // 5. Automatically refresh demand metrics when all required keys assemble
  useEffect(() => {
    if (
      !selectedBillToCustomer ||
      !selectedItemOrgId ||
      !selectedItem?.inventoryItemId
    ) {
      setDemandMetrics(null)
      return
    }
    getDemandMetricsApi(
      selectedBillToCustomer,
      selectedItemOrgId,
      selectedItem.inventoryItemId
    )
      .then(setDemandMetrics)
      .catch(() =>
        setError("Could not calculate active Oracle balance metrics.")
      )
  }, [selectedBillToCustomer, selectedItemOrgId, selectedItem])

  // =========================================================================
  // EXPLICIT ACTION PIPELINES (MANUAL CALLS FROM UI)
  // =========================================================================

  // Paginated inventory search query handler
  const searchInventoryItems = useCallback(
    async (page: number, pageSize: number, search?: string) => {
      try {
        setLoading(true)
        const results = await getPaginatedItems(page, pageSize, search)
        setItemsData(results)
      } catch (err) {
        setError("Item query tracking failure.")
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Single item resolution from scanner/manual input fields
  const fetchSingleItemByCode = useCallback(async (itemCode: string) => {
    if (!itemCode.trim()) return null
    try {
      setLoading(true)
      const item = await getItemByCode(itemCode)
      setSelectedItem(item)
      return item
    } catch (err) {
      setError("Item code not recognized in system registry.")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    // Dropdown Asset Repositories
    regions,
    billToCustomers,
    shipToCustomers,
    employees,
    weeks,
    operatingUnits,
    itemOperatingUnits,
    billToAddresses,
    shipToAddresses,

    // Header State Values & Setters
    selectedRegion,
    setSelectedRegion,
    selectedSubRegion,
    setSelectedSubRegion,
    selectedBillToCustomer,
    setSelectedBillToCustomer,
    selectedShipToCustomer,
    setSelectedShipToCustomer,
    selectedBillToAddress,
    setSelectedBillToAddress,
    selectedShipToAddress,
    setSelectedShipToAddress,
    selectedEmployee,
    setSelectedEmployee,
    selectedWeek,
    setSelectedWeek,
    selectedOrgId,
    setSelectedOrgId,

    // Grid Line State Values & Setters
    selectedItemOrgId,
    setSelectedItemOrgId,
    rrsCategory,
    itemsData,
    selectedItem,
    setSelectedItem,
    demandMetrics,

    // Shared UI Indicators
    loading,
    error,
    setError,

    // Grid Interactivity Functions
    searchInventoryItems,
    fetchSingleItemByCode,
  }
}
