import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"

function SiteLogo({
  className,
  tone = "default",
  showText = true,
}: {
  className?: string
  tone?: "default" | "inverse"
  showText?: boolean
}) {
  const isInverse = tone === "inverse"

  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3", className)} aria-label="Nuvexora Technologies home">
      <span className={cn("relative flex size-10 shrink-0 items-center justify-center rounded-2xl border transition-all duration-200 group-hover:scale-105 shadow-sm overflow-hidden bg-slate-950", isInverse ? "border-slate-800" : "border-slate-200 dark:border-slate-800")}>
        <Image
          src="/logos/logo.png"
          alt="Nuvexora Technologies Logo"
          width={40}
          height={40}
          className="size-full object-cover rounded-xl"
          priority
        />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-sans text-[1.02rem] font-extrabold tracking-[-0.03em]", isInverse ? "text-white" : "text-slate-900 dark:text-white")}>
            Nuvexora Technologies
          </span>
          <span className={cn("text-[0.68rem] uppercase tracking-[0.26em] font-semibold", isInverse ? "text-slate-400" : "text-slate-500 dark:text-slate-400")}>
            Innovate. Build. Elevate.
          </span>
        </span>
      )}
    </Link>
  )
}

export { SiteLogo }
