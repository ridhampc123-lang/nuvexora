import { Container } from "@/components/common/container";
import { SectionTitle } from "@/components/common/section-title";

export function TimelineSection() {
  const items = ["Strategy", "Experience design", "Engineering", "QA + launch", "Optimization"];
  return (
    <section className="py-24">
      <SectionTitle eyebrow="Timeline" title="Milestones built for clarity." description="Every phase has visible outputs, owner alignment, and decision checkpoints." />
      <Container>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="h-8 w-8 rounded-full bg-white/10 text-center text-sm leading-8 text-white">{index + 1}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}