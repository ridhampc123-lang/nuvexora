import * as React from "react";
import { cn } from "@/lib/utils";

export function GradientText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-blue-600 dark:text-blue-500 font-semibold",
        className
      )}
      {...props}
    />
  );
}