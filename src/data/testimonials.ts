import type { Testimonial } from "@/types/testimonial";
import { testimonialQuotes } from "@/constants/testimonials";

export const testimonials: Testimonial[] = testimonialQuotes.map((quote, index) => ({
  id: `testimonial-${index + 1}`,
  quote,
  author: "Product Lead",
  role: "VP of Product",
  company: "Enterprise Client",
}));