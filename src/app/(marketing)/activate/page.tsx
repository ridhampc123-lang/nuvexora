"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Key, Lock, AlertCircle, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

function ActivateFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { login } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength logic
  const strength = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const isStrong = Object.values(strength).every(Boolean);
  const strengthScore = Object.values(strength).filter(Boolean).length;

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing activation token.");
    }
  }, [token]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Activation token is missing. Please use the link sent to your email.");
      return;
    }

    if (!isStrong) {
      setError("Password does not meet the strength requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the terms of service.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to activate account");
      }

      const data = await response.json();
      login(data.data.user, data.data.accessToken);
      
      toast.success("Account activated securely!");
      
      const role = data.data.user.role.toUpperCase();
      if (role === "SUPER_ADMIN" || role === "ADMIN") {
        router.push("/admin");
      } else if (role === "CLIENT") {
        router.push("/client");
      } else {
        router.push("/employee");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-2 shadow-inner">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Activate Account
        </h1>
        <p className="text-xs text-slate-400 font-normal">
          Set a secure password to complete your enterprise account setup.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
          {token ? <AlertCircle className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
          <span>{error}</span>
        </div>
      )}

      {token ? (
        <form onSubmit={handleActivate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              New Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition-all font-mono"
              />
            </div>
            
            {/* Password Strength Indicator */}
            <div className="pt-2 pb-1 space-y-1.5">
              <div className="flex gap-1 h-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`flex-1 rounded-full ${
                      strengthScore >= level
                        ? strengthScore <= 2
                          ? "bg-rose-500"
                          : strengthScore === 3
                          ? "bg-amber-400"
                          : "bg-emerald-500"
                        : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
              <div className="text-[10px] grid grid-cols-2 gap-1 text-slate-400">
                <span className={strength.length ? "text-emerald-400" : ""}>✓ 8+ characters</span>
                <span className={strength.uppercase ? "text-emerald-400" : ""}>✓ Uppercase letter</span>
                <span className={strength.number ? "text-emerald-400" : ""}>✓ Number</span>
                <span className={strength.special ? "text-emerald-400" : ""}>✓ Special character</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition-all font-mono"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 py-2">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded-md border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="terms" className="text-[11px] text-slate-400 leading-relaxed cursor-pointer">
              I agree to the Nuvexora Technologies Enterprise Terms of Service, Privacy Policy, and Acceptable Use Policy.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !isStrong || !termsAccepted || password !== confirmPassword}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Securely Activate Account</span>
              </>
            )}
          </button>
        </form>
      ) : null}
    </motion.div>
  );
}

export default function ActivatePage() {
  return (
    <main className="min-h-screen py-16 sm:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
      <Container size="medium" className="relative z-10">
        <Suspense fallback={<div className="text-center text-xs text-slate-400">Loading Secure Environment...</div>}>
          <ActivateFormContent />
        </Suspense>
      </Container>
    </main>
  );
}
