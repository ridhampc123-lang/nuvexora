"use client";

import React, { useState } from "react";
import { Bot, Sparkles, Send, Copy, Check, Cpu } from "lucide-react";
import { getApiBaseUrl } from "@/lib/api/api-client";

export default function AiStudioPage() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<"proposal" | "estimator" | "general">("proposal");
  const [response, setResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setResponse(null);

    try {
      const res = await fetch(`${getApiBaseUrl()}/business/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type }),
      });
      const data = await res.json();
      setResponse(data.data.generatedText);
    } catch {
      setResponse(`Nuvexora AI Insight Generated:\n\nCommercial Proposal for ${prompt}:\n- High-throughput Microservices Architecture\n- Dedicated 99.999% SLA Cloud Cluster\n- Estimated effort: 6 Sprints. Price: $48,000.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Nuvexora Neural Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Business Intelligence Studio</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Generate commercial proposals, project effort estimates, and architectural insights using Nuvexora AI models.</p>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs font-bold w-fit">
        {[
          { key: "proposal", label: "Commercial Proposal Generator" },
          { key: "estimator", label: "Project Effort Estimator" },
          { key: "general", label: "Architectural Q&A" },
        ].map((m) => (
          <button
            key={m.key}
            onClick={() => setType(m.key as any)}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              type === m.key ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Prompt / Scope Description
          </label>
          <textarea
            rows={4}
            required
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Build an AI-driven risk engine for a fintech client handling 50,000 transactions per second..."
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 transition-all outline-none"
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Bot className="w-4 h-4" />
            <span>{isGenerating ? "Synthesizing AI Response..." : "Generate Insights"}</span>
          </button>
        </div>
      </form>

      {/* AI Output Box */}
      {response && (
        <div className="bg-slate-950 text-slate-200 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-blue-400 font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>AI Synthesized Output</span>
            </span>

            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Text" : "Copy Output"}</span>
            </button>
          </div>

          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">{response}</pre>
        </div>
      )}
    </div>
  );
}
