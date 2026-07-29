"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Lock, ShieldAlert, Sparkles, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: Array<"SUPER_ADMIN" | "ADMIN" | "CLIENT" | "EMPLOYEE">;
  portalName?: string;
}

export function AuthGuard({ children, allowedRoles, portalName = "Portal" }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoading) return;

    // Check stored localStorage directly to avoid state flash
    let currentUser = user;
    if (!currentUser && typeof window !== "undefined") {
      const stored = localStorage.getItem("nuvexora_user");
      if (stored) {
        try {
          currentUser = JSON.parse(stored);
        } catch {}
      }
    }

    if (!currentUser) {
      setAuthorized(false);
      const portalQuery = pathname.startsWith("/admin") ? "admin" : pathname.startsWith("/client") ? "client" : "employee";
      router.push(`/login?portal=${portalQuery}&redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    const hasAllowedRole = allowedRoles.includes(currentUser.role);
    if (!hasAllowedRole) {
      setAuthorized(false);
      return;
    }

    setAuthorized(true);
  }, [isLoading, user, isAuthenticated, pathname, router, allowedRoles]);

  if (isLoading || authorized === null) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
          Verifying Security Credentials...
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="h-screen w-full bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Access Denied</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Protected {portalName}</h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              This area is restricted. You must be authenticated as an authorized <strong className="text-white">{allowedRoles.join(" or ")}</strong> to view this portal.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href={`/login?portal=${pathname.startsWith("/admin") ? "admin" : "client"}`}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Log In With Authorized Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
