import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-foreground shadow-none outline-none transition-all placeholder:text-muted-foreground focus:border-focus focus:ring-4 focus:ring-focus/12 disabled:cursor-not-allowed disabled:bg-disabled disabled:text-muted-foreground/70",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }