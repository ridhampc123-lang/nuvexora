"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <div className="max-w-xl space-y-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Application error
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Something interrupted the experience.
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          The interface could not finish rendering. You can retry immediately.
        </p>
        <p className="text-xs text-muted-foreground">{error.message}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}