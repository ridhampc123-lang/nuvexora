import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { cn } from "@/lib/utils"

function SectionWrapper({
  children,
  className,
  containerSize = "xl",
  spacing = "default",
  fullBleed = false,
}: {
  children: React.ReactNode
  className?: string
  containerSize?: "small" | "medium" | "large" | "xl" | "2xl" | "full"
  spacing?: "sm" | "default" | "lg" | "xl"
  fullBleed?: boolean
}) {
  return (
    <Section spacing={spacing} className={cn(className)}>
      {fullBleed ? children : <Container size={containerSize}>{children}</Container>}
    </Section>
  )
}

export { SectionWrapper }
