import Link from "next/link"
import { SparklesIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function SiteLogo({
  className,
  tone = "default",
}: {
  className?: string
  tone?: "default" | "inverse"
}) {
  const isInverse = tone === "inverse"

  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3", className)} aria-label="Nuvexora Technologies home">
      <span className={cn("inline-flex size-10 items-center justify-center rounded-2xl border transition-transform duration-200 group-hover:-translate-y-0.5 shadow-sm", isInverse ? "border-slate-800 bg-white/10" : "border-slate-200 bg-white")}>
        <span className="inline-flex size-7 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <SparklesIcon className="size-4 text-white" aria-hidden="true" />
        </span>
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-sans text-[1.02rem] font-extrabold tracking-[-0.03em]", isInverse ? "text-white" : "text-slate-900")}>
          Nuvexora Technologies
        </span>
        <span className={cn("text-[0.68rem] uppercase tracking-[0.26em] font-semibold", isInverse ? "text-slate-400" : "text-slate-500")}>
          Innovate. Build. Elevate.
        </span>
      </span>
    </Link>
  )
}

export { SiteLogo }
