import type { LucideIcon } from "lucide-react"

export interface NavigationItem {
  label: string
  href: string
  description?: string
  external?: boolean
  icon?: LucideIcon
}

export interface NavigationGroup {
  title: string
  items: NavigationItem[]
}

export interface MegaMenuConfig {
  label: string
  href: string
  description: string
  featured: NavigationItem
  groups: NavigationGroup[]
  quickLinks?: NavigationItem[]
}

export interface FooterColumn {
  title: string
  items: NavigationItem[]
}

export interface SocialLink extends NavigationItem {
  icon?: LucideIcon
}