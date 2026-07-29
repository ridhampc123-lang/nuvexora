export function BackgroundEffects() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl transform-gpu will-change-transform" />
      <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl transform-gpu will-change-transform" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#050816] to-transparent" />
    </div>
  );
}