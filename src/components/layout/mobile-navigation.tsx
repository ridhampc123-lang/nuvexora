"use client"

import Link from "next/link"
import { MenuIcon, PhoneCallIcon, MailIcon, MessageCircleIcon, SearchIcon, ArrowRightIcon } from "lucide-react"

import { navigationConfig } from "@/config/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon-sm" className="lg:hidden" />}>
        <MenuIcon className="size-4" aria-hidden="true" />
      </SheetTrigger>

      <SheetContent side="right" className="w-[min(92vw,26rem)] border-l-border bg-background dark:bg-slate-950 text-foreground">
        <div className="flex h-full flex-col gap-6 p-5 pt-16">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Navigation</p>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.03em]">Explore Nuvexora</h2>
          </div>

          <Accordion className="space-y-2">
            {navigationConfig.primary.map((item) => {
              if ("groups" in item) {
                return (
                  <AccordionItem key={item.label} value={item.label} className="rounded-2xl border border-border bg-surface px-4">
                    <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline">
                      <span className="flex items-center gap-2">
                        {item.label}
                        <Badge variant="outline" className="border-primary/20 bg-primary/6 text-primary">Mega menu</Badge>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        {item.groups.map((group) => (
                          <div key={group.title} className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{group.title}</p>
                            <div className="grid gap-2">
                              {group.items.map((link) => {
                                const Icon = link.icon

                                return (
                                <Link
                                  key={`${group.title}-${link.label}`}
                                  href={link.href}
                                  className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-all hover:border-border hover:bg-hover"
                                >
                                  {Icon ? <Icon className="size-4 text-primary" aria-hidden="true" /> : <ArrowRightIcon className="size-4 text-primary" aria-hidden="true" />}
                                  <span className="text-sm font-medium">{link.label}</span>
                                </Link>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              }

              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-4 text-base font-semibold transition-all hover:border-primary/20 hover:bg-hover"
                >
                  {item.label}
                  <ArrowRightIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                </Link>
              )
            })}
          </Accordion>

          <div className="rounded-[1.25rem] border border-border bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(14,165,233,0.03))] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Connect</p>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <a href={`mailto:${navigationConfig.contact.email}`} className="flex items-center gap-2 hover:text-foreground">
                <MailIcon className="size-4" aria-hidden="true" />
                {navigationConfig.contact.email}
              </a>
              <a href={`tel:${navigationConfig.contact.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2 hover:text-foreground">
                <PhoneCallIcon className="size-4" aria-hidden="true" />
                {navigationConfig.contact.phone}
              </a>
              <div className="flex items-center gap-2">
                <MessageCircleIcon className="size-4" aria-hidden="true" />
                {navigationConfig.contact.address}
              </div>
            </div>
          </div>

          <div className="mt-auto grid gap-3 sm:grid-cols-2">
            <Link href="/book-consultation" className={cn(buttonVariants({ size: "lg" }), "w-full")}>
              Book consultation
            </Link>
            <Link href="/contact" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}>
              Contact sales
            </Link>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com" className="transition-colors hover:text-foreground">LinkedIn</a>
              <a href="https://github.com" className="transition-colors hover:text-foreground">GitHub</a>
              <a href="https://x.com" className="transition-colors hover:text-foreground">X</a>
            </div>
            <Button variant="ghost" size="icon-sm" className="shrink-0">
              <SearchIcon className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { MobileNavigation }
