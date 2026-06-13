import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type JsonSectionEditorProps<T> = {
  title: string
  description?: string
  value: T
  onChange: (value: T) => void
  className?: string
}

export function JsonSectionEditor<T>({
  title,
  description,
  value,
  onChange,
  className,
}: JsonSectionEditorProps<T>) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2))
  const [parseError, setParseError] = useState<string | null>(null)

  useEffect(() => {
    setText(JSON.stringify(value, null, 2))
    setParseError(null)
  }, [value])

  const applyJson = () => {
    try {
      const parsed = JSON.parse(text) as T
      onChange(parsed)
      setParseError(null)
    } catch {
      setParseError("Invalid JSON. Fix syntax errors before applying.")
    }
  }

  const formatJson = () => {
    try {
      const parsed = JSON.parse(text) as T
      setText(JSON.stringify(parsed, null, 2))
      setParseError(null)
    } catch {
      setParseError("Invalid JSON. Cannot format until syntax is valid.")
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <Label className="text-sm font-medium">{title}</Label>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <Textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value)
          setParseError(null)
        }}
        className="min-h-[280px] font-mono text-xs"
        spellCheck={false}
      />

      {parseError ? (
        <p className="text-xs text-destructive">{parseError}</p>
      ) : null}

      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={applyJson}>
          Apply section
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={formatJson}>
          Format JSON
        </Button>
      </div>
    </div>
  )
}
