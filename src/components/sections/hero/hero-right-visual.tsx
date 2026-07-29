"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Terminal, 
  Cpu, 
  Cloud, 
  Activity, 
  ShieldCheck, 
  Zap, 
  BrainCircuit, 
  Layers, 
  Check, 
  Play,
  TrendingUp,
  Server
} from "lucide-react";

export function HeroRightVisual() {
  const [activeTab, setActiveTab] = useState<"cloud" | "ai" | "metrics">("cloud");
  const [isCopied, setIsCopied] = useState(false);

  // Mouse Parallax values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = (e.clientX - rect.left) / width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / height - 0.5;
    x.set(mouseXPos);
    y.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const codeSnippets = {
    cloud: `// Nuvexora Multi-Region Cloud Engine
import { CloudCluster, ScalePolicy } from "@nuvexora/cloud";

export const infrastructure = new CloudCluster({
  name: "enterprise-core-v4",
  regions: ["us-east-1", "eu-west-1", "ap-south-1"],
  autoScale: ScalePolicy.PREDICTIVE_AI,
  compliance: ["SOC2_TYPE_II", "HIPAA", "GDPR"],
  sla: "99.999%",
});

await infrastructure.deployLive();`,

    ai: `# Nuvexora Neural Intelligence Mesh
import torch
from nuvexora.ai import EnterpriseLLM, VectorRouter

engine = EnterpriseLLM.load("nuvexora-v4-turbo")
router = VectorRouter(latency_threshold_ms=15)

@router.on_request
def process_stream(payload):
    result = engine.synthesize(payload, depth="deep_reasoning")
    return {"status": "SUCCESS", "confidence": 0.998}`,

    metrics: `{
  "system_status": "HEALTHY",
  "global_throughput": "4.82 GB/sec",
  "average_latency": "11.4ms",
  "active_nodes": 1420,
  "neural_tokens_sec": "485,000",
  "threat_mitigation": "100% AUTOMATED"
}`
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[4/3.8] sm:aspect-[4/3] lg:aspect-auto lg:h-[620px] flex items-center justify-center p-2 sm:p-4 perspective-1000 select-none"
    >
      {/* Background Soft Glow & Grid */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-blue-500/20 via-sky-400/15 to-indigo-500/20 blur-3xl animate-pulse transform-gpu will-change-transform" />
      </div>

      {/* SVG Network Connections Beam Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70">
        <defs>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Animated Connecting Nodes Lines */}
        <motion.path 
          d="M 60 120 Q 180 200 240 280 T 420 400" 
          fill="none" 
          stroke="url(#beamGrad)" 
          strokeWidth="2"
          strokeDasharray="6 6"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />
        <motion.path 
          d="M 400 100 Q 300 240 200 350" 
          fill="none" 
          stroke="#60a5fa" 
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: 80 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        />
      </svg>

      {/* Main 3D Parallax Container */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full max-w-lg lg:max-w-xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-[0_20px_50px_-15px_rgba(37,99,235,0.15)] p-4 sm:p-6 transform-gpu will-change-transform"
      >
        {/* IDE / Window Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="ml-2 text-xs font-mono text-slate-400 font-medium hidden sm:inline">
              nuvexora-studio ~/core
            </span>
          </div>

          {/* Studio Tabs */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl gap-1 border border-slate-200/60">
            <button
              onClick={() => setActiveTab("cloud")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === "cloud"
                  ? "bg-white text-blue-700 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              CloudEngine.ts
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === "ai"
                  ? "bg-white text-blue-700 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              AIModel.py
            </button>
            <button
              onClick={() => setActiveTab("metrics")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === "metrics"
                  ? "bg-white text-blue-700 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Metrics.json
            </button>
          </div>
        </div>

        {/* Code View Area */}
        <div className="relative mt-4 bg-slate-950 rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-300 shadow-inner overflow-hidden min-h-[220px]">
          {/* Subtle glowing line number column */}
          <div className="flex gap-4">
            <div className="text-slate-600 select-none text-right font-mono flex flex-col space-y-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
            </div>
            <pre className="overflow-x-auto text-sky-300 flex-1 whitespace-pre-wrap font-mono">
              <code>{codeSnippets[activeTab]}</code>
            </pre>
          </div>

          {/* Active Engine Badge on Bottom of Window */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-sans text-emerald-400 font-medium">Cluster Active</span>
            </div>
            <span className="font-mono text-slate-400">Latency: 11.4ms</span>
          </div>
        </div>

        {/* Floating Glass Card 1: Real-time Analytics Dashboard */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute -top-6 -right-4 sm:-right-8 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.08)] max-w-[210px] sm:max-w-[230px]"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-800">System Speed</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              +42%
            </span>
          </div>
          <div className="text-lg font-extrabold text-slate-900 mb-1">
            4.82 <span className="text-xs font-medium text-slate-500">GB/s</span>
          </div>

          {/* SVG Sparkline Graph */}
          <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 30">
            <path
              d="M 0 25 Q 20 10 40 18 T 80 5 T 100 12"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="100" cy="12" r="3" fill="#2563eb" className="animate-ping" />
          </svg>
        </motion.div>

        {/* Floating Glass Card 2: AI Neural Agent Node */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-8 -left-4 sm:-left-8 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.08)] max-w-[220px]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">AI Neural Mesh</div>
              <div className="text-[11px] text-slate-500 font-medium">99.8% Precision</div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span>Model: Nuvexora-v4</span>
            <span className="text-blue-600 font-semibold">Active</span>
          </div>
        </motion.div>

        {/* Floating Glass Icon 3: Multi-Region Cloud Badge */}
        <motion.div
          animate={{ x: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
          className="absolute -bottom-6 right-6 bg-slate-900/90 backdrop-blur-md text-white border border-slate-800 rounded-xl px-3.5 py-2 shadow-lg flex items-center gap-2.5 text-xs font-medium"
        >
          <Cloud className="w-4 h-4 text-sky-400" />
          <span>Global Cloud Infra</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400 ml-1" />
        </motion.div>
      </motion.div>
    </div>
  );
}
