import { CTA, Container, Paragraph, Section, SectionTitle } from "@/components/sections";

export default function PrivacyPolicyPage() {
  return (
    <Section>
      <SectionTitle
        eyebrow="Privacy Policy"
        title="Your data, handled responsibly."
        description="We keep privacy controls, security practices, and data usage transparent."
      />
      <Container className="space-y-4">
        <Paragraph>Policy copy will be finalized before launch.</Paragraph>
      </Container>
      <CTA />
    </Section>
  );
}