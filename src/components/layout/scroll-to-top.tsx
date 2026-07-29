"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLenis } from "@/providers/smooth-scroll-provider"

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollTo } = useLenis()

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const shouldShow = window.scrollY > 400
          setIsVisible((prev) => (prev !== shouldShow ? shouldShow : prev))
          ticking = false
        })
        ticking = true
      }
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleScrollToTop = () => {
    scrollTo(0, { duration: 1.2 })
  }

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.94 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-4 bottom-4 z-[65] sm:right-6 sm:bottom-6 transform-gpu"
        >
          <Button
            type="button"
            variant="gradient"
            size="icon"
            onClick={handleScrollToTop}
            aria-label="Scroll to top"
            className="shadow-floating"
          >
            <ArrowUpIcon className="size-4" aria-hidden="true" />
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export { ScrollToTop }

