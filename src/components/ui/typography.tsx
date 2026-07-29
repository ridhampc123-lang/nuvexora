import * as React from "react"

import { cn } from "@/lib/utils"

const typographyClasses = {
  display:
    "font-heading text-[clamp(3.5rem,8vw,6rem)] font-semibold tracking-[-0.06em] text-balance leading-[0.95]",
  h1:
    "font-heading text-[clamp(2.5rem,5vw,4.5rem)] font-semibold tracking-[-0.05em] text-balance leading-[1.02]",
  h2:
    "font-heading text-[clamp(2rem,4vw,3.25rem)] font-semibold tracking-[-0.04em] text-balance leading-[1.08]",
  h3:
    "font-heading text-[clamp(1.5rem,2.8vw,2.25rem)] font-semibold tracking-[-0.03em] text-balance leading-[1.12]",
  h4: "font-heading text-2xl font-semibold tracking-[-0.02em] leading-[1.18]",
  h5: "font-heading text-lg font-semibold tracking-[-0.01em] leading-[1.22]",
  h6: "font-heading text-base font-semibold leading-[1.28]",
  paragraphLarge: "text-lg leading-7 text-pretty text-muted-foreground",
  paragraph: "text-base leading-7 text-pretty text-muted-foreground",
  small: "text-sm leading-6 text-muted-foreground",
  caption: "text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground",
  button: "text-sm font-semibold tracking-[0.01em]",
  label: "text-sm font-semibold tracking-[0.01em] text-foreground",
  code: "font-mono text-[0.875em] text-foreground",
} as const

type TypographyVariant = keyof typeof typographyClasses

type TypographyProps<T extends React.ElementType = "p"> = {
  as?: T
  variant?: TypographyVariant
} & React.ComponentPropsWithoutRef<T>

const defaultElementForVariant: Record<TypographyVariant, React.ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  paragraphLarge: "p",
  paragraph: "p",
  small: "p",
  caption: "span",
  button: "span",
  label: "span",
  code: "code",
}

function Typography<T extends React.ElementType = "p">({
  as,
  variant = "paragraph",
  className,
  ...props
}: TypographyProps<T>) {
  const Component = as ?? defaultElementForVariant[variant]

  return (
    <Component
      data-slot="typography"
      className={cn(typographyClasses[variant], className)}
      {...props}
    />
  )
}

export { Typography, typographyClasses }
