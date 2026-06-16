import { cn } from "@/lib/utils"

export interface TabOption<T extends string> {
  value: T
  label: string
  badge?: number
}

interface Props<T extends string> {
  options: TabOption<T>[]
  value: T
  onChange: (value: T) => void
}

export function FilterTabs<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-muted p-1">
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
            {option.badge !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold leading-none",
                  isActive ? "bg-primary/15 text-primary" : "bg-border text-muted-foreground",
                )}
              >
                {option.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
