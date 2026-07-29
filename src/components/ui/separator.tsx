import * as React from "react"

import { cn } from "@/lib/utils"

function Separator(
  {
    className,
    orientation = "horizontal",
    ...props
  }: React.ComponentProps<"hr"> & { orientation?: "horizontal" | "vertical" }
) {
  return (
    <hr
      data-slot="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === "vertical" ? "h-full w-px" : "h-px w-full",
        "border-0 bg-divider",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
