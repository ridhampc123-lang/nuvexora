"use client";

import { useMouse } from "@/hooks/use-mouse";

export function Cursor() {
  const { x, y } = useMouse();
  return <div aria-hidden className="pointer-events-none fixed inset-0 hidden lg:block" style={{ background: `radial-gradient(180px at ${x}px ${y}px, rgba(103, 232, 249, 0.08), transparent 60%)` }} />;
}