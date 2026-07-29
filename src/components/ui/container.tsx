import * as React from "react"

import { cn } from "@/lib/utils"

const containerSizes = {
  small: "max-w-[640px]",
  medium: "max-w-[768px]",
  large: "max-w-[1024px]",
  xl: "max-w-[1280px]",
  "2xl": "max-w-[1536px]",
  full: "max-w-none",
} as const

type ContainerProps = React.ComponentProps<"div"> & {
  size?: keyof typeof containerSizes
}

function Container({ className, size = "xl", ...props }: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        containerSizes[size],
        className
      )}
      {...props}
    />
  )
}

export { Container }
