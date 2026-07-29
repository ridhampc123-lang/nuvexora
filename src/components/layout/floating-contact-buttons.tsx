"use client"

import Link from "next/link"
import { useMemo } from "react"
import { motion } from "framer-motion"
import { PhoneIcon, MailIcon, MessageCircleIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { navigationConfig } from "@/config/navigation"
import { cn } from "@/lib/utils"

function FloatingContactButtons() {
  const phoneHref = useMemo(() => `tel:${navigationConfig.contact.phone.replace(/[^\d+]/g, "")}`, [])

  return (
    <div className="fixed right-4 bottom-20 z-[64] hidden flex-col gap-2 lg:flex">
      <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.24 }}>
        <Link href="https://wa.me/15550102048" target="_blank" rel="noreferrer" aria-label="Open WhatsApp chat" className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "shadow-floating")}>
          <MessageCircleIcon className="size-4" aria-hidden="true" />
        </Link>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <a href={phoneHref} aria-label="Call Nuvexora Technologies" className={cn(buttonVariants({ variant: "outline", size: "icon" }), "shadow-soft")}>
          <PhoneIcon className="size-4" aria-hidden="true" />
        </a>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.36 }}>
        <a href={`mailto:${navigationConfig.contact.email}`} aria-label="Email Nuvexora Technologies" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "bg-card dark:bg-slate-900 border border-border shadow-soft")}>
          <MailIcon className="size-4" aria-hidden="true" />
        </a>
      </motion.div>
    </div>
  )
}

export { FloatingContactButtons }
