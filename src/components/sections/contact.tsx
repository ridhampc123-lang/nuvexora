import { Container } from "@/components/common/container";
import { SectionTitle } from "@/components/common/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactSection() {
  return (
    <section className="py-10 sm:py-12 lg:py-14">
      <SectionTitle eyebrow="Contact" title="Let’s map the right engagement." description="Share your product goals and we’ll shape the delivery model around scope, team size, and timeline." />
      <Container>
        <form className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
          <Input placeholder="Name" />
          <Input placeholder="Email" type="email" />
          <Textarea placeholder="Tell us about your project" className="md:col-span-2" />
          <div className="md:col-span-2">
            <Button type="submit">Send inquiry</Button>
          </div>
        </form>
      </Container>
    </section>
  );
}