"use client"

import { motion, useScroll, useSpring } from "framer-motion"

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 bg-transparent">
      <motion.div
        className="h-full origin-left bg-[linear-gradient(90deg,var(--primary),var(--accent))] shadow-[0_0_18px_rgba(37,99,235,0.35)] will-change-transform transform-gpu"
        style={{ scaleX }}
      />
    </div>
  )
}

export { ScrollProgressBar }

