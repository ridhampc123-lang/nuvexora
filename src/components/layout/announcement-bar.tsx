"use client"

import Link from "next/link"
import { XIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "nuvexora:announcement-dismissed"

type AnnouncementBarProps = {
  title: string
  description: string
  href: string
  ctaLabel?: string
  badgeLabel?: string
  className?: string
}

function AnnouncementBar({
  title,
  description,
  href,
  ctaLabel = "Learn more",
  badgeLabel = "Hiring",
  className,
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const message = useMemo(() => ({ title, description, href, ctaLabel, badgeLabel }), [title, description, href, ctaLabel, badgeLabel])

  useEffect(() => {
    const dismissed = window.localStorage.getItem(STORAGE_KEY)
    setIsVisible(dismissed !== "1")
  }, [])

  const dismiss = () => {
    setIsVisible(false)
    window.localStorage.setItem(STORAGE_KEY, "1")
  }

  return (
    <AnimatePresence initial={false} mode="wait">
      {isVisible ? (
        <motion.div
          key="announcement"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "border-b border-border/70 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl",
            className
          )}
        >
          <div className="mx-auto flex w-full max-w-[1536px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-primary/20 bg-primary/6 text-primary">
                {message.badgeLabel}
              </Badge>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{message.title}</span>{" "}
                {message.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={message.href} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-0 text-primary hover:bg-transparent")}>{message.ctaLabel}</Link>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={dismiss}
                aria-label="Dismiss announcement"
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export { AnnouncementBar }
