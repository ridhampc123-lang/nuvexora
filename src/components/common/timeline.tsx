export function Timeline({ items }: { items: { title: string; description: string }[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">0{index + 1}</p>
          <p className="mt-2 font-medium text-white">{item.title}</p>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  );
}