import { cn } from "@/lib/utils"

type DivProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("rounded-xl border border-border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn("flex flex-col gap-1 p-4 sm:p-5", className)} {...props} />
}

export function CardTitle({ className, ...props }: DivProps) {
  return <h3 className={cn("text-sm font-semibold tracking-tight", className)} {...props} />
}

export function CardDescription({ className, ...props }: DivProps) {
  return <p className={cn("text-xs text-muted-foreground", className)} {...props} />
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn("p-4 pt-0 sm:p-5 sm:pt-0", className)} {...props} />
}
