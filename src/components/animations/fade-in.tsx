"use client";

import { motion } from "framer-motion";
import { animationPresets } from "@/utils/animation";

export function FadeIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={animationPresets.fadeUp.initial}
      animate={animationPresets.fadeUp.animate}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}