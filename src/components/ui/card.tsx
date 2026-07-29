import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "group/card flex flex-col text-sm text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "rounded-3xl border border-border bg-card shadow-card",
        service:
          "rounded-3xl border border-border bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/60 shadow-card hover:-translate-y-1 hover:shadow-floating",
        feature:
          "rounded-3xl border border-border bg-white dark:bg-card shadow-card hover:-translate-y-1",
        portfolio:
          "overflow-hidden rounded-[1.75rem] border border-border bg-white dark:bg-card p-0 shadow-card",
        technology:
          "rounded-3xl border border-border bg-slate-50 dark:bg-card shadow-soft hover:border-primary/30",
        blog: "rounded-3xl border border-border bg-white dark:bg-card shadow-card",
        team: "rounded-3xl border border-border bg-white dark:bg-card shadow-card",
        pricing:
          "rounded-[2rem] border border-primary/10 bg-gradient-to-b from-white to-primary/4 dark:from-slate-900 dark:to-primary/10 shadow-floating",
        glass:
          "rounded-[2rem] border border-white/50 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-floating",
        stats:
          "rounded-[2rem] border border-border bg-gradient-to-br from-primary/4 via-white to-white dark:via-slate-900 dark:to-slate-900 shadow-card",
      },
      size: {
        sm: "gap-3 p-4",
        default: "gap-4 p-6",
        lg: "gap-5 p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-variant={variant}
      className={cn(cardVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("group/card-header grid auto-rows-min items-start gap-1", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-heading text-lg font-medium leading-snug", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center border-t border-divider bg-surface/70 p-4", className)}
      {...props}
    />
  )
}

const createCardVariant = (
  variant: NonNullable<VariantProps<typeof cardVariants>["variant"]>
) => {
  return function VariantCard(props: React.ComponentProps<"div">) {
    return <Card variant={variant} {...props} />
  }
}

const ServiceCard = createCardVariant("service")
const FeatureCard = createCardVariant("feature")
const PortfolioCard = createCardVariant("portfolio")
const TechnologyCard = createCardVariant("technology")
const BlogCard = createCardVariant("blog")
const TeamCard = createCardVariant("team")
const PricingCard = createCardVariant("pricing")
const GlassCard = createCardVariant("glass")
const StatsCard = createCardVariant("stats")

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  ServiceCard,
  FeatureCard,
  PortfolioCard,
  TechnologyCard,
  BlogCard,
  TeamCard,
  PricingCard,
  GlassCard,
  StatsCard,
}