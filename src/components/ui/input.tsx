import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground shadow-none outline-none transition-all placeholder:text-muted-foreground focus:border-focus focus:ring-4 focus:ring-focus/12 disabled:cursor-not-allowed disabled:bg-disabled disabled:text-muted-foreground/70",
        className
      )}
      {...props}
    />
  )
}

export { Input }