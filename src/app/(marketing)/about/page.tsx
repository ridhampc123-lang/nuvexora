import { Section, Container, SectionTitle, CTA } from "@/components/sections";

export default function AboutPage() {
  return (
    <Section>
      <SectionTitle eyebrow="About" title="A technology partner for serious teams." description="Nuvexora combines product thinking, systems engineering, and elevated design." />
      <Container className="space-y-8 text-muted-foreground">
        <p>
          We help organizations build durable platforms with thoughtful architecture and premium execution.
        </p>
      </Container>
      <CTA />
    </Section>
  );
}