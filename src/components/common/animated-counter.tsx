"use client";

import { useCounter } from "@/hooks/use-counter";

export function AnimatedCounter({ value }: { value: number }) {
  const counter = useCounter(value);
  return <span>{counter}</span>;
}