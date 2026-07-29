import type { Variants } from "framer-motion"

import { designSystemTokens } from "@/design-system/tokens"

export const motionDurations = designSystemTokens.motion.durations
export const motionEasings = designSystemTokens.motion.easings

export const motionPresets = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  fadeUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -24 },
    animate: { opacity: 1, y: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
  rotate: {
    initial: { opacity: 0, rotate: -4, scale: 0.98 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
  },
  textReveal: {
    initial: { opacity: 0, y: "0.8em" },
    animate: { opacity: 1, y: 0 },
  },
  buttonRipple: {
    initial: { opacity: 0.12, scale: 0.7 },
    animate: { opacity: 0, scale: 2.4 },
  },
  hoverLift: {
    initial: { y: 0, scale: 1 },
    hover: { y: -4, scale: 1.01 },
  },
  hoverGlow: {
    initial: { boxShadow: "0 0 0 rgba(37, 99, 235, 0)" },
    hover: { boxShadow: "0 18px 48px rgba(37, 99, 235, 0.16)" },
  },
} as const

export const staggerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: motionEasings.standard,
    },
  },
}

export const counterVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: motionEasings.standard,
    },
  },
}

export const scrollRevealVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: motionEasings.standard,
    },
  },
}

export const parallaxVariants: Variants = {
  initial: { y: 0 },
  whileInView: { y: -24 },
}
