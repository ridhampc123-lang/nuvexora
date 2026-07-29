import { Container } from "@/components/common/container";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Container className="py-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Dashboard</p>
        {children}
      </Container>
    </div>
  );
}