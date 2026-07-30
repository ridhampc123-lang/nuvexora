import { 
  Hero, 
  TrustedCompanies, 
  ServicesSection, 
  IndustriesSection, 
  TechnologiesSection, 
  WhyChooseUsSection, 
  PortfolioSection, 
  ProcessSection, 
  TestimonialsSection, 
  FAQSection, 
  BlogPreviewSection, 
  CTA 
} from "@/components/sections";

export default function MarketingHomePage() {
  return (
    <>
      <Hero />
      <TrustedCompanies />
      <ServicesSection />
      <IndustriesSection />
      <TechnologiesSection />
      <WhyChooseUsSection />
      <PortfolioSection />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <BlogPreviewSection />
      <CTA />
    </>
  );
}