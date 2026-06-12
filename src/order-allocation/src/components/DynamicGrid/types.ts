import type {
  ColDef,
  FilterChangedEvent,
  GridApi,
  PaginationChangedEvent,
  RowClickedEvent,
  SortChangedEvent,
} from "ag-grid-community"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import React from "react"

export interface ActionButtonProps {
  label: string
  onClick: (api: GridApi) => void | Promise<void>
  icon?: React.ReactNode
  variant?: "primary" | "secondary" | "danger"
  disabled?: boolean
}

export interface DetailSectionConfig {
  title: string
  render: (data: any) => React.ReactNode
}

export interface VirtualScrollProps {
  rowBuffer?: number
  maxBlocksInCache?: number
}

export interface DataGridProps<TData extends object = object> {
  rowData: TData[]
  columnDefs: (Omit<ColDef<TData>, "field"> & { field?: string })[]
  title?: string
  gridId?: string
  loading?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  rowSelection?: "single" | "multiple" | "none"
  animateRows?: boolean
  showSearch?: boolean
  showRefreshButton?: boolean
  showClearFiltersButton?: boolean
  customActions?: ActionButtonProps[]
  noRowsMessage?: string
  loadingMessage?: string
  onRefresh?: () => void | Promise<void>
  onGridReady?: (api: GridApi<TData>) => void
  onSearchChange?: (value: string) => void
  onRowClicked?: (event: RowClickedEvent<TData>) => void
  onSelectionChanged?: (selectedRows: TData[]) => void
  onFilterChanged?: (event: FilterChangedEvent<TData>) => void
  onSortChanged?: (event: SortChangedEvent<TData>) => void
  onPaginationChanged?: (event: PaginationChangedEvent<TData>) => void
  onClearFilters?: () => void | Promise<void>
  className?: string
  gridHeight?: string | number
  compact?: boolean
  theme?: "light" | "dark" | "system"
  defaultColDef?: ColDef<TData>
  masterDetail?: boolean
  detailSections?: DetailSectionConfig[]
  virtualScroll?: VirtualScrollProps
}
