import React from "react";
import { Container } from "@/components/common/container";
import { Heading } from "@/components/common/heading";
import { Paragraph } from "@/components/common/paragraph";
import { cn } from "@/lib/utils";

export function SectionTitle({
  eyebrow,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}) {
  return (
    <Container className={cn("mb-12", className)}>
      <div className="max-w-3xl space-y-4">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-cyan-400">
            {eyebrow}
          </p>
        )}
        <Heading className={cn("text-slate-900 dark:text-white", titleClassName)}>{title}</Heading>
        {description && (
          <Paragraph className={cn("text-slate-600 dark:text-slate-400", descriptionClassName)}>{description}</Paragraph>
        )}
      </div>
    </Container>
  );
}