import { Section, SectionTitle, Container, CTA } from "@/components/sections";

export default function CareersPage() {
  return (
    <Section>
      <SectionTitle eyebrow="Careers" title="Build the next generation of product experiences." description="We hire sharp thinkers who care about craft, systems, and outcomes." />
      <Container className="text-muted-foreground">Open roles and team values will be added here.</Container>
      <CTA />
    </Section>
  );
}