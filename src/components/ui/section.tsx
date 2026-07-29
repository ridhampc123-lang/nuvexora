import * as React from "react"

import { cn } from "@/lib/utils"

type SectionProps = React.ComponentProps<"section"> & {
  spacing?: "sm" | "default" | "lg" | "xl"
}

const sectionSpacing = {
  sm: "py-12 md:py-16",
  default: "py-16 md:py-24",
  lg: "py-20 md:py-28",
  xl: "py-24 md:py-32",
} as const

function Section({ className, spacing = "default", ...props }: SectionProps) {
  return (
    <section
      data-slot="section"
      className={cn(sectionSpacing[spacing], className)}
      {...props}
    />
  )
}

export { Section }
