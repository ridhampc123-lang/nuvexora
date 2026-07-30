"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { SearchIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import { navigationConfig } from "@/config/navigation"
import { Container } from "@/components/ui/container"
import { Button, buttonVariants } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { SiteLogo } from "@/components/layout/site-logo"
import { MegaMenu } from "@/components/layout/mega-menu"
import { MobileNavigation } from "@/components/layout/mobile-navigation"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { cn } from "@/lib/utils"

function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    let ticking = false
    const updateScrollState = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const shouldBeScrolled = window.scrollY > 16
          setIsScrolled((prev) => (prev !== shouldBeScrolled ? shouldBeScrolled : prev))
          ticking = false
        })
        ticking = true
      }
    }
    updateScrollState()
    window.addEventListener("scroll", updateScrollState, { passive: true })
    return () => window.removeEventListener("scroll", updateScrollState)
  }, [])

  const navLinks = useMemo(
    () => navigationConfig.primary.filter((item) => !("groups" in item)),
    []
  )

  const menus = navigationConfig.primary.filter((item) => "groups" in item)

  return (
    <motion.header
      initial={false}
      animate={{ y: 0 }}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "border-border/70 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-soft"
          : "border-border/40 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md"
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-4">
        <SiteLogo />

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: pathname === "/" ? "secondary" : "ghost", size: "sm" }),
                  "px-4 text-foreground hover:bg-hover hover:text-foreground",
                  pathname === "/" && "shadow-none"
                )}
              >
                Home
              </Link>
            </NavigationMenuItem>

            {menus.map((menu) => (
              <NavigationMenuItem key={menu.label}>
                <NavigationMenuTrigger
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-hover hover:text-foreground",
                    pathname.startsWith(menu.href) && "bg-hover text-foreground font-semibold"
                  )}
                >
                  {menu.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <MegaMenu menu={menu} />
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}

            {navLinks.filter((item) => item.href !== "/").map((item) => (
              <NavigationMenuItem key={`${item.label}-${item.href}`}>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: pathname.startsWith(item.href) ? "secondary" : "ghost", size: "sm" }),
                    "px-4 text-foreground hover:bg-hover hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link href="/book-consultation" className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}>
            Book consultation
          </Link>
          <MobileNavigation />
        </div>
      </Container>
    </motion.header>
  )
}

export { Navbar }