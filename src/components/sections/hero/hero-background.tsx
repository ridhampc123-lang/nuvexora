"use client";

import React from "react";
import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-10 bg-background">
      {/* Subtle Radial Blue Gradient Spots */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/60 via-sky-50/40 to-transparent dark:from-blue-900/30 dark:via-sky-950/20 blur-3xl transform-gpu will-change-transform" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-blue-400/10 dark:bg-blue-600/15 blur-[130px] transform-gpu will-change-transform" />
      <div className="absolute top-1/3 -left-32 w-[600px] h-[600px] rounded-full bg-cyan-400/10 dark:bg-cyan-600/15 blur-[140px] transform-gpu will-change-transform" />
      
      {/* Animated Subtle Tech Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 dark:opacity-30" 
      />

      {/* Animated Glowing Light Beams across the Grid */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "100%", opacity: [0, 0.4, 0] }}
        transition={{
          repeat: Infinity,
          duration: 7,
          ease: "easeInOut",
          repeatDelay: 3
        }}
        className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"
      />
      <motion.div
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: "100%", opacity: [0, 0.3, 0] }}
        transition={{
          repeat: Infinity,
          duration: 9,
          ease: "easeInOut",
          repeatDelay: 4
        }}
        className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-sky-400 to-transparent"
      />

      {/* Subtle Ambient Grain Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      />
    </div>
  );
}
