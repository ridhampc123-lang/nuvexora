import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-xl)] border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap text-foreground transition-all duration-200 outline-none select-none focus-visible:border-focus focus-visible:ring-4 focus-visible:ring-focus/18 active:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-4 aria-invalid:ring-danger/12 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-button hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-floating",
        secondary:
          "bg-secondary text-secondary-foreground shadow-soft hover:-translate-y-0.5 hover:bg-hover hover:text-foreground",
        outline:
          "border-border bg-background text-foreground shadow-none hover:bg-hover hover:text-foreground",
        ghost: "text-foreground hover:bg-hover hover:text-foreground",
        gradient:
          "bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-primary-foreground shadow-floating hover:-translate-y-0.5",
        destructive:
          "bg-danger/10 text-danger hover:bg-danger/18 focus-visible:border-danger focus-visible:ring-danger/18",
        link: "h-auto px-0 text-primary underline-offset-4 hover:underline",
        icon: "size-11 rounded-full bg-background text-foreground shadow-soft hover:bg-hover hover:text-foreground",
      },
      size: {
        default: "h-11 px-4 text-[0.95rem]",
        sm: "h-9 px-3 text-sm",
        lg: "h-12 px-5 text-base",
        xl: "h-14 px-6 text-base",
        icon: "size-11 p-0",
        "icon-sm": "size-9 p-0",
        "icon-lg": "size-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  loading,
  leftIcon,
  rightIcon,
  fullWidth,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    fullWidth?: boolean
    children?: React.ReactNode
  }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading || undefined}
      className={cn(buttonVariants({ variant, size }), fullWidth && "w-full", className)}
      disabled={props.disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2Icon className="size-4 animate-spin" aria-hidden="true" /> : leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }