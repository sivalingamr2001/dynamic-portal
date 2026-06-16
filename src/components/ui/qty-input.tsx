import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  className?: string
}

export function QtyInput({ value, onChange, step = 1, min = 0, className }: Props) {
  const clamp = (next: number) => Math.max(min, next)

  return (
    <div
      className={cn(
        "inline-flex h-8 items-center overflow-hidden rounded-lg border border-input bg-card",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(clamp(value - step))}
        className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Minus className="size-3.5" />
      </button>
      <input
        type="number"
        value={value}
        min={min}
        onChange={(event) => onChange(clamp(Number(event.target.value) || 0))}
        className="h-full w-16 border-x border-input bg-transparent text-center text-sm tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(clamp(value + step))}
        className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  )
}
