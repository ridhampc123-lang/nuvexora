"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { AnimationProvider } from "@/providers/animation-provider";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { QueryProvider } from "@/providers/query-provider";
import { RouteProgress } from "@/components/layout/route-progress";
import { AuthProvider } from "@/providers/auth-provider";
import React, { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <AnimationProvider>
            <Suspense fallback={null}>
              <RouteProgress />
            </Suspense>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
            <ToastProvider />
          </AnimationProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}