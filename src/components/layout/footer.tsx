"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpIcon, MailIcon, PhoneIcon } from "lucide-react"

import { navigationConfig } from "@/config/navigation"
import { siteConfig } from "@/config/site"
import { Container } from "@/components/ui/container"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { SiteLogo } from "@/components/layout/site-logo"
import { cn } from "@/lib/utils"
import { useLenis } from "@/providers/smooth-scroll-provider"

function Footer() {
  const { scrollTo } = useLenis()

  return (
    <footer className="bg-slate-950 text-white relative overflow-hidden border-t border-slate-900">
      {/* Background Radial Blue Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.15),transparent_40%)] pointer-events-none" />

      <Container className="relative z-10 grid gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        <div className="space-y-8">
          <div className="space-y-4">
            <SiteLogo tone="inverse" />
            <p className="max-w-xl text-sm leading-7 text-slate-300">
              Premium software engineering and design delivery for modern enterprises.
              Strategy, systems, and execution aligned under one global studio.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <a href={`mailto:${siteConfig.contactEmail}`} className="rounded-2xl border border-slate-800 bg-white/5 p-4 text-sm text-slate-200 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:border-blue-500/50">
              <MailIcon className="mb-2 size-4 text-blue-400" aria-hidden="true" />
              <span className="block font-medium text-white">Email</span>
              <span className="block text-slate-400 text-xs mt-0.5">{siteConfig.contactEmail}</span>
            </a>
            <a href={`tel:${siteConfig.contactPhone.replace(/[^\d+]/g, "")}`} className="rounded-2xl border border-slate-800 bg-white/5 p-4 text-sm text-slate-200 transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:border-blue-500/50">
              <PhoneIcon className="mb-2 size-4 text-blue-400" aria-hidden="true" />
              <span className="block font-medium text-white">Call</span>
              <span className="block text-slate-400 text-xs mt-0.5">{siteConfig.contactPhone}</span>
            </a>
            <div className="rounded-2xl border border-slate-800 bg-white/5 p-4 text-sm text-slate-200">
              <span className="mb-2 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-blue-400">
                Studio
              </span>
              <span className="block font-medium text-white">{siteConfig.address}</span>
              <span className="block text-slate-400 text-xs mt-0.5">Available worldwide</span>
            </div>
          </div>

          <form
            className="max-w-xl space-y-3 rounded-[1.5rem] border border-slate-800 bg-white/5 p-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Newsletter</p>
              <p className="text-sm text-slate-400">Monthly product insights and technical notes.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                placeholder="Work email address"
                aria-label="Email address for newsletter"
                className="border-slate-800 bg-slate-900 text-white placeholder:text-slate-500 focus:border-blue-500"
              />
              <Button type="submit" className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white">
                Subscribe
              </Button>
            </div>
          </form>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {navigationConfig.footerColumns.map((column) => (
            <div key={column.title} className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{column.title}</p>
              <ul className="space-y-2.5">
                {column.items.map((item) => (
                  <li key={`${column.title}-${item.label}`}>
                    <Link href={item.href} className="text-sm text-slate-300 transition-all hover:pl-1 hover:text-blue-400">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-4 sm:col-span-2 xl:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Social</p>
            <div className="flex flex-wrap gap-2">
              {navigationConfig.socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "border border-slate-800 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white") }>
                    {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
                    {item.label}
                  </a>
                )
              })}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => scrollTo(0, { duration: 1.2 })}
              className="mt-4 border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              <ArrowUpIcon className="size-4 mr-2 text-blue-400" aria-hidden="true" />
              Back to top
            </Button>
          </div>
        </div>
      </Container>

      <div className="relative border-t border-slate-900 bg-slate-950/80">
        <Container className="flex flex-col gap-4 py-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms of Service</Link>
            <Link href="/contact" className="transition-colors hover:text-white">Contact Us</Link>
          </div>
        </Container>
      </div>
    </footer>
  )
}

export { Footer }