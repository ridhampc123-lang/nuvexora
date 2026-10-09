export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  description: string;
  monthlyPriceUSD: number;
  monthlyPriceINR: number;
  fixedPriceUSD: number;
  fixedPriceINR: number;
  annualDiscountPercent: number;
  deliveryTime: string;
  squadComposition: string;
  idealFor: string;
  highlightedFeatures: string[];
  features: {
    category: string;
    items: string[];
  }[];
  ctaText: string;
  ctaHref: string;
}

export interface EngagementModel {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  bestFor: string;
  billingCadence: string;
  flexibility: string;
  ipTransfer: string;
  benefits: string[];
  icon: string;
}

export interface ComparisonFeatureRow {
  name: string;
  starter: string | boolean;
  growth: string | boolean;
  enterprise: string | boolean;
  tooltip?: string;
}

export interface ComparisonCategory {
  category: string;
  features: ComparisonFeatureRow[];
}

export interface PricingFAQItem {
  id: string;
  category: "billing" | "contracts" | "squads" | "delivery";
  question: string;
  answer: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter Sprint / MVP",
    badge: "Fastest Time-to-Market",
    isPopular: false,
    description: "Tailored for early-stage startups and innovation teams needing a high-performance MVP or focused feature delivered with enterprise quality.",
    monthlyPriceUSD: 4900,
    monthlyPriceINR: 399000,
    fixedPriceUSD: 8500,
    fixedPriceINR: 690000,
    annualDiscountPercent: 15,
    deliveryTime: "3 to 5 Weeks",
    squadComposition: "1 Lead Fullstack Engineer + 1 UI/UX Designer + Part-time QA",
    idealFor: "Early-stage founders, seed-stage validation, standalone micro-apps, Proof-of-Concepts (POC).",
    highlightedFeatures: [
      "Full Next.js 15 / React Frontend Architecture",
      "Robust REST / GraphQL APIs & PostgreSQL DB",
      "Up to 12 Bespoke UI/UX Figma Screens",
      "Auth, RBAC & Cloud Deployment (Vercel / AWS)",
      "30-Day Post-Launch SLA Warranty",
      "Direct Slack / Discord Communication"
    ],
    features: [
      {
        category: "Engineering & Architecture",
        items: [
          "Next.js App Router & Tailwind CSS UI",
          "Node.js / Express or Nest.js Backend",
          "PostgreSQL or MongoDB Database Architecture",
          "Authentication (NextAuth, Supabase, or Clerk)",
          "Clean Codebase with 100% Strict TypeScript"
        ]
      },
      {
        category: "Design & User Experience",
        items: [
          "Responsive Mobile & Desktop Wireframes",
          "Component Design System in Figma",
          "Modern Glassmorphism & Smooth Micro-animations"
        ]
      },
      {
        category: "DevOps & Governance",
        items: [
          "Automated CI/CD Deployment Pipeline",
          "Production Hosting Configuration on Vercel/AWS",
          "Weekly Sprint Milestones & Loom Progress Video"
        ]
      }
    ],
    ctaText: "Launch Starter Project",
    ctaHref: "/book-consultation?plan=starter"
  },
  {
    id: "growth",
    name: "Growth Squad",
    badge: "Most Popular • High Velocity",
    isPopular: true,
    description: "Our core cross-functional engineering pod dedicated to accelerating product roadmaps, scaling SaaS architectures, and shipping bespoke AI workflows.",
    monthlyPriceUSD: 9800,
    monthlyPriceINR: 799000,
    fixedPriceUSD: 18500,
    fixedPriceINR: 1490000,
    annualDiscountPercent: 15,
    deliveryTime: "Continuous Monthly Sprints / 8-12 Wk Cycles",
    squadComposition: "1 Senior Technical Lead + 2 Senior Fullstack Engineers + 1 UI/UX Specialist + Dedicated QA Lead",
    idealFor: "Funded startups, scaling SaaS platforms, high-growth businesses requiring sustained high velocity.",
    highlightedFeatures: [
      "Dedicated 4-Specialist Cross-Functional Squad",
      "Full-Stack Web + Mobile App (React Native / Flutter)",
      "Custom AI / LLM Integration & RAG Vector Pipeline",
      "Scalable Cloud DevOps (AWS / GCP, Docker, Kubernetes)",
      "Bi-Weekly Interactive Sprint Demos & Daily Standups",
      "60-Day Post-Launch SLA Warranty & 99.9% Uptime",
      "Priority 4-Hour Response SLA"
    ],
    features: [
      {
        category: "Engineering & Architecture",
        items: [
          "Multi-Tenant SaaS or High-Concurrency Microservices",
          "Cross-Platform Mobile App (iOS & Android)",
          "Real-time WebSockets & Background Job Queues (BullMQ / Redis)",
          "Advanced Caching (Redis) & Database Indexing Optimization",
          "Stripe / LemonSqueezy / Razorpay Subscription Engine"
        ]
      },
      {
        category: "AI & Intelligence",
        items: [
          "Custom RAG Pipeline with OpenAI / Anthropic / Local LLMs",
          "Vector Embeddings (Pinecone / pgvector / Qdrant)",
          "Autonomous Agentic Workflows & Tool Calling"
        ]
      },
      {
        category: "DevOps & Governance",
        items: [
          "Multi-Environment Infrastructure (Dev / Staging / Prod)",
          "Terraform IaC & Zero-Downtime Deployment",
          "Daily Async Standups + Shared Slack Connect Channel",
          "Dedicated Product Manager & Jira/Linear Sprint Board"
        ]
      }
    ],
    ctaText: "Deploy Dedicated Squad",
    ctaHref: "/book-consultation?plan=growth"
  },
  {
    id: "enterprise",
    name: "Enterprise Scale",
    badge: "Mission-Critical Architecture",
    isPopular: false,
    description: "Comprehensive software engineering, legacy modernization, and compliance-hardened infrastructure for global brands and regulated organizations.",
    monthlyPriceUSD: 19500,
    monthlyPriceINR: 1590000,
    fixedPriceUSD: 38000,
    fixedPriceINR: 3100000,
    annualDiscountPercent: 15,
    deliveryTime: "Tailored Custom Engagements",
    squadComposition: "Multi-Squad Pod: Principal Solutions Architect + 4-6 Senior Engineers + DevOps Lead + Security Specialist",
    idealFor: "Enterprises, FinTech, HealthTech, multi-region platforms needing strict compliance and round-the-clock guarantees.",
    highlightedFeatures: [
      "Bespoke Multi-Squad Dedicated Engineering Pod",
      "SOC2, HIPAA, GDPR & PCI-DSS Compliance Hardening",
      "Private On-Premises or VPC Enterprise AI Models",
      "24/7/365 Dedicated Mission-Critical SLA (<15m Response)",
      "High-Throughput Global Multi-Region Infrastructure",
      "Dedicated Executive Delivery Sponsor & Principal Architect",
      "Custom Master Services Agreement (MSA) & Invoicing"
    ],
    features: [
      {
        category: "Engineering & Architecture",
        items: [
          "Event-Driven Microservices (Kafka / RabbitMQ / AWS SQS)",
          "Legacy Monolith to Cloud-Native Modernization",
          "Multi-Region Active-Active Database Replication",
          "Zero-Trust Architecture & Single Sign-On (SAML / Okta)"
        ]
      },
      {
        category: "AI & Intelligence",
        items: [
          "Air-Gapped Private LLM Deployments & Fine-Tuning",
          "Enterprise RAG with Strict Role-Based Data Access",
          "Audit Logging & AI Hallucination Guardrails"
        ]
      },
      {
        category: "DevOps & Security",
        items: [
          "Kubernetes (EKS / GKE) with Auto-Scaling Clusters",
          "Penetration Testing Assistance & Automated Vulnerability Scanning",
          "24/7 Managed NOC Monitoring & Incident Management",
          "Dedicated Solutions Architect & Formal SLA Penalty Clauses"
        ]
      }
    ],
    ctaText: "Consult Enterprise Architect",
    ctaHref: "/contact?intent=enterprise-pricing"
  }
];

export const ENGAGEMENT_MODELS: EngagementModel[] = [
  {
    id: "fixed-scope",
    title: "Fixed-Scope Milestone Delivery",
    eyebrow: "Guaranteed Budget & Deliverables",
    description: "Best for clearly defined specifications, MVPs, and focused upgrades. We commit to a guaranteed milestone schedule, fixed budget, and zero overrun surprise.",
    bestFor: "MVPs, specific product modules, website redesigns, fixed roadmaps.",
    billingCadence: "30% Kickoff / 40% Mid-Sprint Alpha / 30% Final Launch Sign-off.",
    flexibility: "Defined deliverables with formal change orders for scope expansions.",
    ipTransfer: "100% Intellectual Property ownership transferred upon final milestone payment.",
    benefits: [
      "Guaranteed price cap with 0% risk of hidden billing",
      "Explicit milestone deliverables and timeline agreements",
      "Includes 30-day post-launch warranty and bug fixes",
      "Ideal for budgeting committee and board approvals"
    ],
    icon: "Target"
  },
  {
    id: "dedicated-squad",
    title: "Dedicated Engineering Squad",
    eyebrow: "Maximum Velocity & Roadmap Agility",
    description: "An embedded, high-velocity engineering squad that operates as an organic extension of your internal product team. Total freedom to pivot backlog priorities in real time.",
    bestFor: "High-growth startups, continuous SaaS feature development, evolving platforms.",
    billingCadence: "Predictable monthly sprint invoice, cancelable or scalable with 30-day notice.",
    flexibility: "Infinite backlog flexibility — reprioritize sprint tickets anytime.",
    ipTransfer: "Continuous Day-One IP ownership as code is committed to your repository.",
    benefits: [
      "Pre-vetted, high-synergy senior engineering team ready within 7 days",
      "Full transparency: attend daily standups and review sprint velocity",
      "Direct code commits directly into your private GitHub/GitLab org",
      "Zero recruitment, onboarding, benefits, or retention overhead"
    ],
    icon: "Users"
  },
  {
    id: "fractional-consulting",
    title: "Enterprise Advisory & Fractional CTO",
    eyebrow: "Strategic Leadership & Architecture",
    description: "On-demand access to Principal Architects and Security Specialists for code audits, system design, cloud optimization, and AI feasibility strategies.",
    bestFor: "Due diligence, security audit prep, cloud cost reduction, AI readiness.",
    billingCadence: "Retainer-based or block of engineering advisory hours.",
    flexibility: "On-demand scheduling matching your executive requirements.",
    ipTransfer: "Immediate ownership of all architectural blueprints and audit reports.",
    benefits: [
      "World-class architectural guidance without full-time executive salary",
      "Independent verification of codebase scalability and security flaws",
      "Cloud FinOps strategies that typically reduce AWS/GCP bills by 30-50%",
      "Vendor-neutral technology stack selection"
    ],
    icon: "Compass"
  }
];

export const COMPARISON_CATEGORIES: ComparisonCategory[] = [
  {
    category: "Core Engineering & Architecture",
    features: [
      { name: "Frontend Frameworks (Next.js 15, React, Vue)", starter: true, growth: true, enterprise: true, tooltip: "Modern, performant client architecture" },
      { name: "Full-Stack Backend APIs (Node, NestJS, Python)", starter: true, growth: true, enterprise: true, tooltip: "REST, GraphQL, and tRPC endpoints" },
      { name: "Mobile App Development (React Native / Flutter)", starter: "Optional Add-on", growth: true, enterprise: true, tooltip: "Unified codebase iOS & Android applications" },
      { name: "Database Engineering (PostgreSQL, Supabase, Mongo)", starter: "Single Instance", growth: "Clustered & Cached", enterprise: "Multi-Region Active-Active", tooltip: "Data models designed for high integrity and speed" },
      { name: "Microservices & Distributed Queues", starter: false, growth: true, enterprise: true, tooltip: "Decoupled services using Redis & BullMQ" },
      { name: "Event-Driven Streams (Kafka / RabbitMQ)", starter: false, growth: false, enterprise: true, tooltip: "High-throughput streaming data infrastructure" }
    ]
  },
  {
    category: "AI, Machine Learning & Automation",
    features: [
      { name: "LLM API Integrations (OpenAI, Claude, Gemini)", starter: "Basic", growth: true, enterprise: true, tooltip: "Commercial model connectivity" },
      { name: "Custom RAG Pipeline & Vector Database", starter: false, growth: true, enterprise: true, tooltip: "Retrieval-Augmented Generation with semantic indexing" },
      { name: "Autonomous AI Agent Workflows", starter: false, growth: true, enterprise: true, tooltip: "Multi-step tool calling and background autonomous tasks" },
      { name: "Private Air-Gapped LLM Deployments", starter: false, growth: false, enterprise: true, tooltip: "Zero data leakage on self-hosted enterprise infrastructure" },
      { name: "Model Fine-Tuning & Custom Datasets", starter: false, growth: "Optional Add-on", enterprise: true, tooltip: "Domain-specific model customization" }
    ]
  },
  {
    category: "Cloud Infrastructure, DevOps & Security",
    features: [
      { name: "Automated CI/CD Delivery Pipelines", starter: true, growth: true, enterprise: true, tooltip: "Automated builds, linting, and testing" },
      { name: "Cloud Environments", starter: "Staging + Production", growth: "Dev + Staging + Prod", enterprise: "Multi-Region Enterprise", tooltip: "Isolated environments for safe delivery" },
      { name: "Container Orchestration (Docker / Kubernetes)", starter: "Docker Only", growth: "Kubernetes / ECS", enterprise: "Multi-Cluster EKS/GKE", tooltip: "Cloud-native workload management" },
      { name: "Terraform Infrastructure as Code (IaC)", starter: false, growth: true, enterprise: true, tooltip: "Reproducible cloud blueprints" },
      { name: "SOC2 / HIPAA / GDPR Compliance Hardening", starter: false, growth: "Guidance", enterprise: "Full Implementation", tooltip: "Rigorous enterprise security policies" },
      { name: "Automated Security Scanning & SAST", starter: "Standard", growth: "Advanced", enterprise: "Continuous Enterprise", tooltip: "Static code vulnerability prevention" }
    ]
  },
  {
    category: "Team Allocation & Governance",
    features: [
      { name: "Dedicated Tech Lead & Architect", starter: "Part-time Lead", growth: "Dedicated Senior Lead", enterprise: "Principal Enterprise Architect", tooltip: "Direct technical oversight and architecture" },
      { name: "Cross-Functional Engineers", starter: "1-2 Engineers", growth: "3-4 Engineers", enterprise: "5-8+ Engineers Pod", tooltip: "Fullstack, mobile, DevOps and QA specialists" },
      { name: "Bespoke UI/UX Designer", starter: "Up to 12 Screens", growth: "Continuous System", enterprise: "Dedicated Design Pod", tooltip: "Figma design system and user journey maps" },
      { name: "Direct Slack / Discord Connect Channel", starter: true, growth: true, enterprise: true, tooltip: "Instant daily team communication" },
      { name: "Agile Sprint Demos & Velocity Tracking", starter: "Bi-weekly", growth: "Weekly", enterprise: "Custom Cadence", tooltip: "Demonstrations of working software" },
      { name: "Executive Delivery Sponsor", starter: false, growth: true, enterprise: true, tooltip: "Direct access to Nuvexora leadership" }
    ]
  },
  {
    category: "Guarantees, Warranties & SLAs",
    features: [
      { name: "100% Day-One Intellectual Property Ownership", starter: true, growth: true, enterprise: true, tooltip: "You own all code, designs, and credentials" },
      { name: "14-Day Risk-Free Trial Period", starter: true, growth: true, enterprise: true, tooltip: "Zero-questions-asked refund if unsatisfied in first 2 weeks" },
      { name: "Post-Launch Warranty Period", starter: "30 Days", growth: "60 Days", enterprise: "Continuous SLA", tooltip: "Free bug fixing for covered scope" },
      { name: "SLA Guaranteed Uptime", starter: "99.5%", growth: "99.9%", enterprise: "99.99%", tooltip: "Production availability SLA" },
      { name: "Emergency Response SLA", starter: "Next Business Day", growth: "< 4 Hours", enterprise: "< 15 Minutes (24/7)", tooltip: "Speed of response for critical incidents" },
      { name: "Custom Master Services Agreement (MSA)", starter: false, growth: "Available", enterprise: "Fully Custom", tooltip: "Custom corporate procurement paperwork" }
    ]
  }
];

export const ESTIMATOR_CATEGORIES = [
  { id: "web", name: "Web Application / Enterprise Portal", basePriceUSD: 5200, baseWeeks: 4, icon: "Globe" },
  { id: "mobile", name: "Mobile App (iOS & Android)", basePriceUSD: 6800, baseWeeks: 6, icon: "Smartphone" },
  { id: "saas", name: "Full-Stack SaaS Platform", basePriceUSD: 8900, baseWeeks: 8, icon: "Layers" },
  { id: "ai", name: "AI Agent & Custom RAG System", basePriceUSD: 7400, baseWeeks: 5, icon: "Brain" },
  { id: "modernization", name: "Enterprise Legacy Modernization", basePriceUSD: 11500, baseWeeks: 10, icon: "RefreshCw" }
];

export const ESTIMATOR_SCALES = [
  { id: "prototype", label: "MVP / Prototype", multiplier: 1.0, weeksAdd: 0, desc: "Fast launch with core functional features" },
  { id: "growth", label: "Growth Platform", multiplier: 1.75, weeksAdd: 3, desc: "Production-ready with polish, integrations, and high traffic capacity" },
  { id: "enterprise", label: "Enterprise Scale", multiplier: 2.8, weeksAdd: 6, desc: "Mission-critical, multi-tenant, SOC2 compliance, multi-region" }
];

export const ESTIMATOR_ADDONS = [
  { id: "ai-copilot", label: "Custom AI / LLM Copilot Integration", priceUSD: 2400, weeksAdd: 1 },
  { id: "devops-k8s", label: "Kubernetes & Multi-Cloud Terraform IaC", priceUSD: 1900, weeksAdd: 1 },
  { id: "compliance", label: "SOC2 / HIPAA Compliance Hardening", priceUSD: 2800, weeksAdd: 2 },
  { id: "design-system", label: "Comprehensive Figma Design System", priceUSD: 1600, weeksAdd: 1 },
  { id: "sla-247", label: "24/7 Mission-Critical SLA & Monitoring", priceUSD: 1500, weeksAdd: 0 }
];

export const PRICING_FAQS: PricingFAQItem[] = [
  {
    id: "faq-1",
    category: "billing",
    question: "How do milestone payments work for fixed-scope projects?",
    answer: "For fixed-price projects, billing is divided into transparent milestones (typically 30% upon kickoff and architectural approval, 40% upon alpha preview release, and 30% upon final production launch). You only approve payments once you verify the deliverables match the agreed specification."
  },
  {
    id: "faq-2",
    category: "billing",
    question: "Can we switch between fixed-scope and dedicated monthly squads?",
    answer: "Yes, absolutely! Many clients start with a fixed-scope Starter Sprint to validate an initial version or MVP, then seamlessly transition to a dedicated Growth Squad for continuous feature iterations and roadmap velocity once product-market fit is achieved."
  },
  {
    id: "faq-3",
    category: "contracts",
    question: "Who owns the code and intellectual property (IP)?",
    answer: "You do—100%. From day one, all source code, database architectures, Figma designs, cloud deployment credentials, and documentation belong strictly to your company. We sign strict Non-Disclosure Agreements (NDAs) and intellectual property assignment contracts before writing a single line of code."
  },
  {
    id: "faq-4",
    category: "squads",
    question: "How quickly can a dedicated engineering squad start?",
    answer: "Because we maintain a full-time bench of senior full-stack, mobile, DevOps, and AI engineers, a dedicated squad can kick off within 5 to 7 business days following agreement execution and initial technical discovery."
  },
  {
    id: "faq-5",
    category: "contracts",
    question: "What is your 14-Day Risk-Free Trial guarantee?",
    answer: "We stand behind the quality of our engineering. If during the first 14 days of an engagement you feel the squad's technical velocity, communication, or code quality is not meeting your expectations, you may terminate the engagement and receive a 100% refund of sprint fees—no questions asked."
  },
  {
    id: "faq-6",
    category: "delivery",
    question: "What happens if our project scope changes mid-development?",
    answer: "For dedicated squads, changes are effortlessly absorbed: you simply rearrange your Linear or Jira backlog priorities each sprint without contractual friction. For fixed-scope projects, we evaluate scope changes via rapid transparent change orders so you know the exact time and cost impact before any work proceeds."
  },
  {
    id: "faq-7",
    category: "billing",
    question: "What currencies and payment methods do you accept?",
    answer: "We accept global wire transfers (USD, EUR, GBP, CAD, AUD) via SWIFT / ACH, as well as INR via RTGS/NEFT/UPI. We also support corporate credit cards and major payment gateways for international convenience."
  },
  {
    id: "faq-8",
    category: "delivery",
    question: "Do you offer post-launch maintenance and SLA support?",
    answer: "Yes. Every engagement includes a complimentary 30 to 60-day warranty covering bug fixes and platform stabilization. Following this period, we provide flexible monthly SLA support packages for 24/7 uptime monitoring, security updates, and on-demand engineering."
  }
];

export const ROI_METRICS = [
  { metric: "45%", label: "Average Cost Reduction", desc: "Compared to recruiting and maintaining equivalent in-house US/EU senior engineers." },
  { metric: "3.2x", label: "Faster Launch Velocity", desc: "From kickoff to market-ready production deployment within weeks instead of quarters." },
  { metric: "99.99%", label: "Guaranteed SLA Uptime", desc: "Enterprise infrastructure engineered for high-concurrency resilience." },
  { metric: "100%", label: "IP Ownership on Day 1", desc: "All source code, repositories, and assets belong entirely to your enterprise." }
];
