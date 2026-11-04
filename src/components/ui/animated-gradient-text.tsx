import React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedGradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "multicolor" | "glow" | "aurora" | "electric" | "stream";
  className?: string;
}

/**
 * AnimatedGradientText
 * High-performance, smoothly transitioning multicolor text gradient
 */
export function AnimatedGradientText({
  children,
  variant = "multicolor",
  className,
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
    <span className={cn(variantClass, className)} {...props}>
      {children}
    </span>
  );
}

