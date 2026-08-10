import Link from "next/link";
import { cn } from "@/lib/utils";
import { NuvexoraLogoMark } from "@/components/common/nuvexora-logo-mark";

function SiteLogo({
  className,
  tone = "default",
  showText = true,
}: {
  className?: string;
  tone?: "default" | "inverse";
  showText?: boolean;
}) {
  const isInverse = tone === "inverse";

  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3 select-none", className)} aria-label="Nuvexora Technologies home">
      <NuvexoraLogoMark size={38} />
      {showText && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-sans text-[1.05rem] font-extrabold tracking-[-0.03em]", isInverse ? "text-white" : "text-slate-900 dark:text-white")}>
            Nuvexora <span className="text-blue-500 font-black">Technologies</span>
          </span>
          <span className={cn("text-[0.65rem] uppercase tracking-[0.24em] font-bold mt-0.5", isInverse ? "text-slate-400" : "text-slate-500 dark:text-slate-400")}>
            Innovate. Build. Elevate.
          </span>
        </span>
      )}
    </Link>
  );
}

export { SiteLogo };
