export interface ServiceProcessStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
  deliverables?: string[];
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceCaseStudy {
  title: string;
  client: string;
  industry: string;
  metrics: string[];
  before: string;
  after: string;
  technologies: string[];
  href?: string;
}

export interface Service {
  id: string;
  slug: string;
  aliases?: string[];
  name: string;
  tagline: string;
  description: string;
  category: "web" | "mobile" | "ai" | "cloud" | "enterprise" | "design" | "marketing" | "automation";
  iconName: string;
  badge?: string;
  featured?: boolean;
  
  // Hero Stats
  stats?: {
    label: string;
    value: string;
  }[];

  // Overview & Pitch
  overview: string;
  businessChallenges: {
    title: string;
    description: string;
  }[];
  ourSolution: {
    title: string;
    description: string;
  }[];

  // Core Features
  features: {
    title: string;
    description: string;
    iconName?: string;
  }[];

  // Technical Capabilities
  technologies: {
    category: string;
    items: string[];
  }[];

  // Deliverables & Timelines
  deliverables: string[];
  estimatedTimeline: string;
  
  // Benefits
  benefits: {
    title: string;
    description: string;
    metric?: string;
  }[];

  // Process & Governance
  developmentProcess: ServiceProcessStep[];

  // Target Industries
  targetIndustries: string[];

  // Case Studies / Projects
  caseStudies?: ServiceCaseStudy[];

  // FAQs
  faqs: ServiceFAQ[];

  // Related Services
  relatedSlugs: string[];
}