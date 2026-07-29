import * as React from "react"

import { cn } from "@/lib/utils"

type GlassProps = React.ComponentProps<"div"> & {
  intensity?: "soft" | "default" | "strong"
}

const glassIntensityClasses = {
  soft: "bg-white/60 backdrop-blur-md border-white/60 shadow-soft",
  default: "bg-white/72 backdrop-blur-xl border-white/50 shadow-card",
  strong: "bg-white/84 backdrop-blur-2xl border-white/70 shadow-floating",
} as const

function Glass({ className, intensity = "default", ...props }: GlassProps) {
  return (
    <div
      data-slot="glass"
      className={cn(
        "rounded-2xl border text-foreground",
        glassIntensityClasses[intensity],
        className
      )}
      {...props}
    />
  )
}

export { Glass }
