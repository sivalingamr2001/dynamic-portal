import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, Search } from "lucide-react"
import { getPaginatedItems } from "@/api/allocationApi"
import { Loader } from "@/components/Loader"

interface InfiniteItemSelectProps {
    currentValue: string
    onSelectCode: (code: string) => void
}

interface InventoryItem {
    inventoryItemId: number
    itemCode: string
}

export function InfiniteItemSelect({ currentValue, onSelectCode }: InfiniteItemSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [items, setItems] = useState<InventoryItem[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const dropdownRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const searchTimeoutRef = useRef<number | null>(null)
    const [overlayStyle, setOverlayStyle] = useState<null | { left: number; top: number; width: number }>(null)

    // Core data fetching layer using api wrapper
    const fetchItemsData = async (targetPage: number, search = "") => {
        if (loading || (!hasNextPage && targetPage > 1)) return
        setLoading(true)

        try {
            // Use API wrapper which returns PagedResult<AllocationItemDto>
            const response = await getPaginatedItems(targetPage, 15, search)
            const newItems = response.data || []
            setItems((prev) => (targetPage === 1 ? newItems : [...prev, ...newItems]))
            setHasNextPage(Boolean(response.hasNextPage))
            setPage(response.page || targetPage)
        } catch (err) {
            console.error("Failed fetching paginated list elements context:", err)
        } finally {
            setLoading(false)
        }
    }

    // Hydrate first page whenever dropdown transitions to open
    useEffect(() => {
        if (isOpen && items.length === 0) {
            fetchItemsData(1, searchQuery)
        }
    }, [isOpen])

    const updateOverlayPosition = useCallback(() => {
        const trigger = triggerRef.current
        if (!trigger) return
        const rect = trigger.getBoundingClientRect()
        setOverlayStyle({ left: rect.left, top: rect.bottom + window.scrollY, width: Math.max(280, rect.width) })
    }, [])

    useEffect(() => {
        if (!isOpen) {
            setOverlayStyle(null)
            return
        }
        updateOverlayPosition()
        window.addEventListener("resize", updateOverlayPosition)
        window.addEventListener("scroll", updateOverlayPosition, true)
        return () => {
            window.removeEventListener("resize", updateOverlayPosition)
            window.removeEventListener("scroll", updateOverlayPosition, true)
        }
    }, [isOpen, updateOverlayPosition])

    // Handle live query text shifts with a built-in 300ms input debounce filter
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchQuery(value)
        setHasNextPage(true)
    }

    // Debounce actual API calls when `searchQuery` changes (300ms)
    useEffect(() => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
        // reset pagination and schedule fetch after debounce period
        setHasNextPage(true)
        setPage(1)
        searchTimeoutRef.current = window.setTimeout(() => {
            // only fetch when query changes or when explicitly resetting
            fetchItemsData(1, searchQuery)
        }, 300)

        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery])

    // Monitor internal scrolling bounds to trigger progressive chunks fetches
    const handleDropdownScroll = () => {
        if (!listRef.current || loading || !hasNextPage) return

        const { scrollTop, scrollHeight, clientHeight } = listRef.current
        // Fire next query chunk request when scrolled close to the bottom container threshold
        if (scrollHeight - scrollTop <= clientHeight + 15) {
            fetchItemsData(page + 1, searchQuery)
        }
    }

    // Dismiss overlay panel securely when a user clicks outside component boundaries
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node
            const trigger = triggerRef.current
            const overlay = overlayRef.current
            if (trigger && trigger.contains(target)) return
            if (overlay && overlay.contains(target)) return
            setIsOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Clear timeout loops automatically when component unmounts to prevent memory leaks
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
        }
    }, [])

    return (
        <div ref={dropdownRef} className="w-full relative">
            {/* Clickable button trigger styled like a form text box row */}
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground font-mono outline-none shadow-sm focus:ring-2 focus:ring-ring/30 hover:bg-muted/20"
            >
                <span className="uppercase truncate">{currentValue || "Select Code..."}</span>
                <ChevronDown className="size-3.5 opacity-50 shrink-0 ml-1" />
            </button>
            {/* Floating Options Overlays Wrapper Box Container (portal) */}
            {isOpen && overlayStyle && createPortal(
                <div
                    ref={overlayRef}
                    style={{ position: "absolute", left: overlayStyle.left, top: overlayStyle.top, width: overlayStyle.width }}
                    className="z-50 rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none p-1 flex flex-col gap-1 bg-background"
                >
                    {/* Integrated Internal Filter Input Box Row */}
                    <div className="flex items-center gap-1.5 px-2 py-1 border-b border-border/60 bg-muted/20 rounded-t-sm">
                        <Search className="size-3.5 text-muted-foreground shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search by item code..."
                            className="w-full bg-transparent border-0 outline-none text-xs p-0.5 focus:ring-0 placeholder:text-muted-foreground/70"
                            autoFocus
                        />
                    </div>

                    {/* Infinite Scroll Elements Layout View Container */}
                    <div
                        ref={listRef}
                        onScroll={handleDropdownScroll}
                        className="max-h-50 overflow-y-auto flex flex-col scrollbar-thin"
                    >
                        {items.length === 0 && !loading && (
                            <div className="py-4 text-center text-xs text-muted-foreground">
                                No matching item codes found.
                            </div>
                        )}

                        {items.map((item) => (
                            <button
                                key={item.inventoryItemId}
                                type="button"
                                onClick={() => {
                                    onSelectCode(item.itemCode)
                                    setIsOpen(false)
                                }}
                                className="flex items-center justify-between rounded-sm px-2 py-1.5 text-xs font-mono text-left hover:bg-accent hover:text-accent-foreground outline-none transition-colors w-full"
                            >
                                <span className="font-semibold uppercase truncate">{item.itemCode}</span>
                                <span className="text-[10px] text-muted-foreground font-sans shrink-0 ml-2">
                                    ID: {item.inventoryItemId}
                                </span>
                            </button>
                        ))}

                        {loading && (
                            <div className="py-2 flex items-center justify-center">
                                <Loader isText={false} />
                            </div>
                        )}

                        {!hasNextPage && items.length > 0 && (
                            <div className="py-1.5 text-center text-[10px] text-muted-foreground/40 border-t border-border/30 mt-1">
                                All records loaded.
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
