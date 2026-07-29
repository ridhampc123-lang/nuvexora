import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const iconSizes = {
  small: "size-3.5",
  medium: "size-4.5",
  large: "size-6",
  xl: "size-8",
} as const

type IconProps = React.ComponentProps<"span"> & {
  icon: LucideIcon
  size?: keyof typeof iconSizes
}

function Icon({ className, icon: IconComponent, size = "medium", ...props }: IconProps) {
  return (
    <span
      data-slot="icon"
      className={cn("inline-flex shrink-0 items-center justify-center", iconSizes[size], className)}
      {...props}
    >
      <IconComponent className="size-full" aria-hidden="true" />
    </span>
  )
}

export { Icon, iconSizes }
