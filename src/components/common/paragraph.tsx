import * as React from "react";
import { cn } from "@/lib/utils";

export function Paragraph({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-pretty text-base leading-7 text-slate-600 dark:text-slate-300 font-normal", className)} {...props} />
  );
}