import { navigationConfig } from "@/config/navigation"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { CookieConsent } from "@/components/layout/cookie-consent"
import { FloatingContactButtons } from "@/components/layout/floating-contact-buttons"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { PageTransition } from "@/components/layout/page-transition"
import { ScrollProgressBar } from "@/components/layout/scroll-progress"
import { ScrollToTop } from "@/components/layout/scroll-to-top"

function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans antialiased transition-colors duration-300">
      <AnnouncementBar
        title={navigationConfig.announcement.label}
        description={navigationConfig.announcement.description}
        href={navigationConfig.announcement.href}
        badgeLabel="Hiring"
        ctaLabel="View careers"
      />
      <ScrollProgressBar />
      <Navbar />
      <PageTransition>
        <main id="content" className="flex-1 w-full flex flex-col">
          {children}
        </main>
      </PageTransition>
      <Footer />
      <FloatingContactButtons />
      <ScrollToTop />
      <CookieConsent />
    </div>
  )
}

export { SiteShell }