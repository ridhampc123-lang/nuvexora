import { CTA, Container, Paragraph, Section, SectionTitle } from "@/components/sections";

export default function TermsPage() {
  return (
    <Section>
      <SectionTitle
        eyebrow="Terms"
        title="Clear terms for a premium engagement."
        description="Scope, responsibilities, and delivery expectations will be documented before work begins."
      />
      <Container className="space-y-4">
        <Paragraph>Terms copy will be finalized before launch.</Paragraph>
      </Container>
      <CTA />
    </Section>
  );
}