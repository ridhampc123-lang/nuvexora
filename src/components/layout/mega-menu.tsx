import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { MegaMenuConfig } from "@/types/navigation"

function MenuIcon({ icon: Icon }: { icon?: MegaMenuConfig["featured"]["icon"] }) {
  if (!Icon) {
    return null
  }

  return <Icon className="size-4 text-primary" aria-hidden="true" />
}

function MegaMenuLink({
  href,
  label,
  description,
  icon: Icon,
}: MegaMenuConfig["groups"][number]["items"][number]) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-2xl border border-transparent p-3 transition-all duration-200 hover:border-border hover:bg-hover"
    >
      <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:-translate-y-0.5">
        {Icon ? <Icon className="size-4" aria-hidden="true" /> : <ArrowRightIcon className="size-4" aria-hidden="true" />}
      </span>
      <span className="space-y-1">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        {description ? <span className="block text-sm leading-6 text-muted-foreground">{description}</span> : null}
      </span>
    </Link>
  )
}

function MegaMenu({ menu }: { menu: MegaMenuConfig }) {
  return (
    <div className="min-w-[min(92vw,58rem)] p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_1.85fr]">
        <Link
          href={menu.featured.href}
          className="group relative overflow-hidden rounded-[1.5rem] border border-border bg-[linear-gradient(145deg,rgba(37,99,235,0.08),rgba(14,165,233,0.03))] dark:bg-slate-900/90 p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-floating"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_30%)]" />
          <div className="relative space-y-4">
            <Badge variant="outline" className="border-primary/20 bg-background/80 dark:bg-slate-800/80 text-primary">
              Featured service
            </Badge>
            <div className="space-y-2">
              <h3 className="font-heading text-xl font-semibold tracking-[-0.03em] text-foreground">
                {menu.featured.label}
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">{menu.featured.description}</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <MenuIcon icon={menu.featured.icon} />
              Explore now
            </div>
          </div>
        </Link>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {menu.groups.map((group) => (
            <div key={group.title} className="space-y-3 rounded-[1.35rem] border border-border bg-card dark:bg-slate-900/80 p-4 shadow-soft">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {group.title}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <MegaMenuLink key={`${group.title}-${item.label}`} {...item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {menu.quickLinks?.length ? (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
          {menu.quickLinks.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card dark:bg-slate-900/80 px-3 py-2 text-sm text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-hover hover:text-primary"
              >
                {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
                {item.label}
              </Link>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export { MegaMenu }
