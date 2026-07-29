"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Cpu, Zap, ShieldCheck, Layers, Terminal } from "lucide-react";

interface LoadingScreenProps {
  label?: string;
}

const statusMessages = [
  "Initializing Quantum Engine...",
  "Loading Server-Side Next.js Edge Mesh...",
  "Decrypting Enterprise Security Protocols...",
  "Optimizing 60fps Micro-Animations...",
  "System Ready. Welcome to Nuvexora."
];

export function LoadingScreen({ label = "Nuvexora Digital Platform" }: LoadingScreenProps) {
  const [progress, setProgress] = useState<number>(0);
  const [messageIndex, setMessageIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 100 ? 100 : next;
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 25) setMessageIndex(0);
    else if (progress < 50) setMessageIndex(1);
    else if (progress < 75) setMessageIndex(2);
    else if (progress < 95) setMessageIndex(3);
    else setMessageIndex(4);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden font-sans select-none">
      {/* Background Radial Glow & Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.18)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Floating Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-6 space-y-8 text-center">
        {/* Holographic Logo Orb with Dual Rotating Rings */}
        <div className="relative flex items-center justify-center w-28 h-28">
          {/* Outer Pulsing Glow Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/40"
          />

          {/* Inner Counter-Rotating Neon Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            className="absolute inset-2 rounded-full border-2 border-cyan-400/60 border-t-transparent border-b-transparent shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          />

          {/* Central Pulsing Tech Core */}
          <motion.div
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.8)] border border-white/20"
          >
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </motion.div>
        </div>

        {/* Brand Headline */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
            Nuvexora Technologies
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-blue-400 font-semibold">
            Innovate. Build. Elevate.
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-2xl">
          {/* Top Status & Percentage */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={statusMessages[messageIndex]}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="truncate max-w-[220px] sm:max-w-[280px]"
                >
                  {statusMessages[messageIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="font-extrabold text-cyan-400 text-sm">{progress}%</span>
          </div>

          {/* Holographic Glowing Progress Track */}
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-950 border border-blue-900/40 p-0.5">
            {/* Main Progress Bar Fill */}
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 relative shadow-[0_0_15px_rgba(6,182,212,0.8)]"
            >
              {/* Laser Shimmer Sweep */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent transform -skew-x-12"
              />
            </motion.div>
          </div>

          {/* Micro Telemetry Indicators */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
            <div className="flex items-center justify-center gap-1">
              <Cpu className="w-3 h-3 text-blue-400" />
              <span>Edge Mesh</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>SOC2 Secure</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>60 FPS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
