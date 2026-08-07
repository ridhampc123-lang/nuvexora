"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api/api-client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Lock,
  Mail,
  Key,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Building2,
  FolderKanban,
  UserCheck,
  CheckCircle2
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

function LoginFormContent() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter email address and password.");
      return;
    }

    setLoading(true);

    try {
      // 1. Try real API authentication
      const response = await apiClient.post("/auth/login", { email, password, rememberMe });

      if (response.status === 200) {
        const data = response.data;
        login(data.data.user, data.data.accessToken);
        toast.success(`Welcome back! Authenticated as ${data.data.user.name || email}`);
        redirectByRole(data.data.user.role);
      } else {
        setError(response.data?.message || "Invalid email or password.");
      }
    } catch (err: any) {
      console.error("Login authentication error:", err);
      const serverMessage = err.response?.data?.message;
      if (serverMessage) {
        setError(serverMessage);
      } else if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        setError(
          "Unable to connect to authentication server. Please check your network connection or ensure the API server URL is configured."
        );
      } else {
        setError("Authentication failed. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (role: string) => {
    const r = role.toUpperCase();
    if (r === "SUPER_ADMIN" || r === "ADMIN") {
      router.push("/admin");
    } else if (r === "CLIENT") {
      router.push("/client");
    } else {
      router.push("/employee");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-2 shadow-inner">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Enterprise Single Sign-On
        </h1>
        <p className="text-xs text-slate-400 font-normal">
          Enter your verified credentials to access your portal.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              placeholder="name@nuvexora.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Password
            </label>
            <Link href="/forgot-password" className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2 py-1">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded-md border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
          />
          <label htmlFor="rememberMe" className="text-xs text-slate-400 font-medium cursor-pointer">
            Keep me securely signed in
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In To Platform</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Security Footer */}
      <div className="pt-3 border-t border-slate-800 text-center space-y-1.5 text-[10px] text-slate-400">
        <div className="flex items-center justify-center gap-1 text-slate-300 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Intelligent Role Routing Active</span>
        </div>
        <p>
          The system will automatically direct you to your authorized portal based on your enterprise role.
        </p>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen py-16 sm:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center relative overflow-hidden">
      {/* Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <Container size="medium" className="relative z-10">
        <Suspense fallback={<div className="text-center text-xs text-slate-400">Loading Login Security Gate...</div>}>
          <LoginFormContent />
        </Suspense>
      </Container>
    </main>
  );
}
