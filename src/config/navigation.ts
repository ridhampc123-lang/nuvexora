import {
  ArrowRightIcon,
  BookOpenIcon,
  Building2Icon,
  BriefcaseBusinessIcon,
  BotIcon,
  BrainIcon,
  CalendarCheck2Icon,
  Code2Icon,
  ContactIcon,
  CpuIcon,
  GraduationCapIcon,
  GlobeIcon,
  HeartHandshakeIcon,
  LayoutGridIcon,
  MailIcon,
  NewspaperIcon,
  RocketIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
  WandSparklesIcon,
  LockIcon,
} from "lucide-react";

import type {
  FooterColumn,
  MegaMenuConfig,
  SocialLink,
} from "@/types/navigation";

const servicesMegaMenu: MegaMenuConfig = {
  label: "Services",
  href: "/services",
  description:
    "Full-spectrum product, engineering, and growth delivery for enterprise teams.",
  featured: {
    label: "Book a strategy session",
    href: "/book-consultation",
    description: "Align roadmap, scope, and delivery model in one call.",
    icon: CalendarCheck2Icon,
  },
  groups: [
    {
      title: "Build",
      items: [
        { label: "Web Development", href: "/services/web-development", icon: Code2Icon },
        { label: "Mobile Apps", href: "/services/mobile-development", icon: RocketIcon },
        { label: "Enterprise Software", href: "/services/enterprise-software", icon: Building2Icon },
      ],
    },
    {
      title: "Transform",
      items: [
        { label: "AI Solutions", href: "/services/ai-solutions", icon: BrainIcon },
        { label: "Cloud & DevOps", href: "/services/cloud-devops", icon: CpuIcon },
        { label: "Automation", href: "/services/automation", icon: BotIcon },
      ],
    },
    {
      title: "Launch",
      items: [
        { label: "UI/UX Design", href: "/services/ui-ux", icon: SparklesIcon },
        { label: "Digital Growth", href: "/services/digital-marketing", icon: ArrowRightIcon },
        { label: "Brand Identity", href: "/services/branding", icon: WandSparklesIcon },
      ],
    },
  ],
  quickLinks: [
    { label: "Services overview", href: "/services", icon: LayoutGridIcon },
    { label: "Pricing", href: "/pricing", icon: HeartHandshakeIcon },
    { label: "Contact", href: "/contact", icon: ContactIcon },
  ],
};

const resourcesMegaMenu: MegaMenuConfig = {
  label: "Resources",
  href: "/blog",
  description:
    "Insights, case studies, and practical guidance for modern product teams.",
  featured: {
    label: "Latest company insights",
    href: "/blog",
    description: "Read research, strategy, and delivery notes from the studio.",
    icon: NewspaperIcon,
  },
  groups: [
    {
      title: "Learn",
      items: [
        { label: "Blog", href: "/blog", icon: NewspaperIcon },
        { label: "Case Studies", href: "/case-studies", icon: BriefcaseBusinessIcon },
        { label: "Technologies", href: "/technologies", icon: CpuIcon },
      ],
    },
    {
      title: "Plan",
      items: [
        { label: "Book Consultation", href: "/book-consultation", icon: CalendarCheck2Icon },
        { label: "FAQ", href: "/contact#faq", icon: BookOpenIcon },
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Contact", href: "/contact", icon: MailIcon },
        { label: "Privacy Policy", href: "/privacy-policy", icon: ShieldCheckIcon },
        { label: "Terms of Service", href: "/terms", icon: GlobeIcon },
      ],
    },
  ],
  quickLinks: [
    { label: "Portfolio", href: "/portfolio", icon: BriefcaseBusinessIcon },
    { label: "Industries", href: "/industries", icon: Building2Icon },
    { label: "About", href: "/about", icon: UsersIcon },
  ],
};

const companyMegaMenu: MegaMenuConfig = {
  label: "Company",
  href: "/about",
  description:
    "Learn about the team, process, and principles that guide delivery.",
  featured: {
    label: "Meet the studio",
    href: "/about",
    description: "People, process, and platform thinking built for scale.",
    icon: UsersIcon,
  },
  groups: [
    {
      title: "Company",
      items: [
        { label: "About Us", href: "/about", icon: UsersIcon },
        { label: "Careers", href: "/careers", icon: GraduationCapIcon },
        { label: "Contact", href: "/contact", icon: MailIcon },
      ],
    },
    {
      title: "Explore",
      items: [
        { label: "Portfolio", href: "/portfolio", icon: BriefcaseBusinessIcon },
        { label: "Industries", href: "/industries", icon: Building2Icon },
        { label: "Services", href: "/services", icon: LayoutGridIcon },
      ],
    },
    {
      title: "Governance",
      items: [
        { label: "Book Strategy Session", href: "/book-consultation", icon: CalendarCheck2Icon },
        { label: "Privacy Policy", href: "/privacy-policy", icon: ShieldCheckIcon },
        { label: "Platform Login", href: "/login", icon: LockIcon },
      ],
    },
  ],
  quickLinks: [
    { label: "Book consultation", href: "/book-consultation", icon: CalendarCheck2Icon },
    { label: "Hiring", href: "/careers", icon: GraduationCapIcon },
    { label: "Contact", href: "/contact", icon: MailIcon },
  ],
};

export const navigationConfig = {
  primary: [
    { label: "Home", href: "/" },
    servicesMegaMenu,
    { label: "Portfolio", href: "/portfolio" },
    resourcesMegaMenu,
    companyMegaMenu,
  ],
  utility: [
    { label: "Book Consultation", href: "/book-consultation" },
    { label: "Sign In", href: "/login" },
  ],
  announcement: {
    label: "Now hiring",
    href: "/careers",
    description: "Join Nuvexora to build premium digital products for global teams.",
  },
  footerColumns: [
    {
      title: "Services",
      items: [
        { label: "Web Development", href: "/services/web-development" },
        { label: "Mobile Apps", href: "/services/mobile-development" },
        { label: "AI Solutions", href: "/services/ai-solutions" },
        { label: "Cloud & DevOps", href: "/services/cloud-devops" },
        { label: "Enterprise Software", href: "/services/enterprise-software" },
        { label: "UI/UX Design", href: "/services/ui-ux" },
      ],
    },
    {
      title: "Industries",
      items: [
        { label: "Healthcare", href: "/industries#healthcare" },
        { label: "FinTech", href: "/industries#fintech" },
        { label: "SaaS", href: "/industries#saas" },
        { label: "Retail", href: "/industries#retail" },
        { label: "Logistics", href: "/industries#logistics" },
      ],
    },
    {
      title: "Resources",
      items: [
        { label: "Blog", href: "/blog" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Technologies", href: "/technologies" },
        { label: "FAQ", href: "/contact#faq" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ] satisfies FooterColumn[],
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com", icon: Building2Icon },
    { label: "X", href: "https://x.com", icon: ArrowRightIcon },
    { label: "GitHub", href: "https://github.com", icon: Code2Icon },
  ] satisfies SocialLink[],
  contact: {
    email: "nuvexora@gmail.com",
    phone: "+91 9213612847",
    address: "Global delivery studio",
  },
  featuredService: {
    label: "Enterprise product delivery",
    href: "/services",
    description: "Strategy, design, engineering, and launch support in one system.",
  },
} as const;