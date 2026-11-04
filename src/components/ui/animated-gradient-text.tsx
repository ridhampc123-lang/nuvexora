"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedGradientTextProps extends HTMLMotionProps<"span"> {
  children: React.ReactNode;
  variant?: "multicolor" | "glow" | "aurora" | "electric" | "stream";
  className?: string;
  speed?: number; // duration in seconds
}

/**
 * AnimatedGradientText
 * High-performance, smoothly transitioning multicolor text gradient.
 * Dual-driven: Uses hardware-accelerated Framer Motion keyframes + CSS fallbacks
 * to guarantee continuous 60fps color cycling across all browsers and devices.
 */
export function AnimatedGradientText({
  children,
  variant = "glow",
  className,
  speed = 4,
  style,
  ...props
}: AnimatedGradientTextProps) {
  const variantClass = {
    multicolor: "text-gradient-animated",
    glow: "text-gradient-animated-glow",
    aurora: "text-gradient-aurora",
    electric: "text-gradient-electric",
    stream: "text-gradient-stream",
  }[variant];

  return (
    <motion.span
      className={cn(variantClass, className)}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        display: "inline-block",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        willChange: "background-position",
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.span>
  );
}
