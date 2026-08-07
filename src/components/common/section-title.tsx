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
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
            {eyebrow}
          </p>
        )}
        <Heading className={cn("text-white font-extrabold", titleClassName)}>{title}</Heading>
        {description && (
          <Paragraph className={cn("text-slate-300 font-normal", descriptionClassName)}>{description}</Paragraph>
        )}
      </div>
    </Container>
  );
}