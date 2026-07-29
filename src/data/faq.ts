import type { FAQItem } from "@/types/faq";
import { faqQuestions } from "@/constants/faqs";

export const faqs: FAQItem[] = faqQuestions.map((question, index) => ({
  id: `faq-${index + 1}`,
  question,
  answer: "Discovery, design, and engineering are aligned before implementation begins.",
}));