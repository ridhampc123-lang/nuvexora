"use client";

import { motion } from "framer-motion";
import { staggerVariants } from "@/design-system";

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
      variants={staggerVariants}
    >
      {children}
    </motion.div>
  );
}