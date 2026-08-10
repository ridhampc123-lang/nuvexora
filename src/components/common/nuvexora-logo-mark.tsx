import React from "react";
import { cn } from "@/lib/utils";

interface NuvexoraLogoMarkProps {
  className?: string;
  size?: number;
  showGlow?: boolean;
}

export function NuvexoraLogoMark({
  className,
  size = 36,
  showGlow = true,
}: NuvexoraLogoMarkProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:border-blue-500/50",
        showGlow && "after:absolute after:inset-0 after:rounded-2xl after:bg-blue-500/10 after:blur-md after:-z-10 group-hover:after:bg-blue-500/20",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.65}
        height={size * 0.65}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:rotate-3"
      >
        <defs>
          <linearGradient id="nuvexora-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="nuvexora-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Geometric Hex Prism Nodes */}
        <path
          d="M50 8 L85 28 V72 L50 92 L15 72 V28 Z"
          stroke="url(#nuvexora-grad-1)"
          strokeWidth="6"
          strokeLinejoin="round"
          fill="none"
          opacity="0.85"
        />

        {/* Inner Dynamic Interlocking "N" Core */}
        <path
          d="M32 68 V32 L68 68 V32"
          stroke="url(#nuvexora-grad-2)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow-filter)"
        />

        {/* Center Quantum Pulse Point */}
        <circle cx="50" cy="50" r="5" fill="#38BDF8" className="animate-pulse" />
      </svg>
    </div>
  );
}
