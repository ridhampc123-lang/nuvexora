"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"

function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 w-full flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export { PageTransition }
