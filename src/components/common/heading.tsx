import * as React from "react";
import { cn } from "@/lib/utils";

export function Heading({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl text-slate-900 dark:text-white",
        className
      )}
      {...props}
    />
  );
}