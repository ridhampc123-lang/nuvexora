"use client";

import { useEffect } from "react";
import { AnimationContext } from "@/contexts/animation-context";

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // TODO: Register shared GSAP defaults and motion preferences.
  }, []);

  return (
    <AnimationContext.Provider value={{ enabled: true }}>
      {children}
    </AnimationContext.Provider>
  );
}