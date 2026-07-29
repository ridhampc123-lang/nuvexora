import { Section, SectionTitle, Container, CTA } from "@/components/sections";

export default function CaseStudiesPage() {
  return (
    <Section>
      <SectionTitle eyebrow="Case Studies" title="A clear record of outcomes and decisions." description="Structured stories that show the problem, the approach, and the measurable result." />
      <Container className="text-muted-foreground">Detailed case study content will be added here.</Container>
      <CTA />
    </Section>
  );
}