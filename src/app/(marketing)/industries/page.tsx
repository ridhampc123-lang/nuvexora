import { Section, SectionTitle, Container, CTA } from "@/components/sections";

export default function IndustriesPage() {
  return (
    <Section>
      <SectionTitle eyebrow="Industries" title="Solutions tuned to the realities of each sector." description="We tailor design, security, compliance, and delivery for industry-specific needs." />
      <Container className="text-muted-foreground">Healthcare, fintech, SaaS, manufacturing, logistics, retail, and more.</Container>
      <CTA />
    </Section>
  );
}