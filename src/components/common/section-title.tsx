import { Container } from "@/components/common/container";
import { Heading } from "@/components/common/heading";
import { Paragraph } from "@/components/common/paragraph";

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Container className="mb-12">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-cyan-300/80">
          {eyebrow}
        </p>
        <Heading>{title}</Heading>
        <Paragraph>{description}</Paragraph>
      </div>
    </Container>
  );
}