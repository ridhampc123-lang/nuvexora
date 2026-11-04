import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nuvexora";

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    console.log("🌱 Checking database seed requirements...");

    // 1. Seed Super Admin Account
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@nuvexora.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: "Nuvexora Super Admin",
        email: adminEmail,
        password: process.env.INITIAL_ADMIN_PASSWORD || "Admin@Nuvexora2026!",
        role: "SUPER_ADMIN",
        status: "active",
        jobTitle: "Chief Executive & Systems Admin",
        permissionsOverride: ["*"],
      });
      console.log(`✅ Default Super Admin created: ${adminEmail}`);
    } else {
      console.log(`ℹ️ Super Admin account (${adminEmail}) already exists.`);
    }

    // 2. Seed Enterprise Demo Client
    const clientEmail = "client@nuvexora.com";
    const existingClient = await User.findOne({ email: clientEmail });

    if (!existingClient) {
      const createdUser = await User.create({
        name: "Marcus Vance",
        email: clientEmail,
        password: "Client@2026!",
        role: "CLIENT",
        status: "active",
        companyName: "Veloce Financial",
        jobTitle: "CTO",
      });
      console.log(`✅ Default Client created: ${clientEmail}`);

      const { ClientAccount } = await import("../models/client.model.js");
      await ClientAccount.create({
        userId: createdUser._id,
        companyName: "Veloce Financial",
        ownerName: "Marcus Vance",
        email: clientEmail,
        industry: "FinTech & Banking",
        tier: "Enterprise",
        contractValue: 1500000,
        slaUptimeTarget: "99.99%",
        status: "active",
      });
      console.log(`✅ Default ClientAccount created with contractValue ₹15,00,000: ${clientEmail}`);
    } else {
      const { ClientAccount } = await import("../models/client.model.js");
      let ca = await ClientAccount.findOne({ email: clientEmail });
      if (!ca) {
        await ClientAccount.create({
          userId: existingClient._id,
          companyName: "Veloce Financial",
          ownerName: "Marcus Vance",
          email: clientEmail,
          industry: "FinTech & Banking",
          tier: "Enterprise",
          contractValue: 1500000,
          slaUptimeTarget: "99.99%",
          status: "active",
        });
        console.log(`✅ Linked missing ClientAccount for: ${clientEmail}`);
      } else if (!ca.contractValue || ca.contractValue === 0) {
        ca.contractValue = 1500000;
        await ca.save();
        console.log(`✅ Updated contractValue for ${clientEmail} to ₹15,00,000`);
      }
    }

    // 3. Seed Enterprise Demo Employee & Employee Document
    const employeeEmail = "employee@nuvexora.com";
    let existingEmployeeUser = await User.findOne({ email: employeeEmail });

    if (!existingEmployeeUser) {
      existingEmployeeUser = await User.create({
        name: "Alexander Vance",
        email: employeeEmail,
        password: "Employee@2026!",
        role: "EMPLOYEE",
        status: "active",
        department: "Engineering",
        jobTitle: "Lead Systems Architect",
      });
      console.log(`✅ Default Employee User created: ${employeeEmail}`);
    }

    const { Employee: EmployeeModel } = await import("../models/employee.model.js");
    let employeeDoc = await EmployeeModel.findOne({ email: employeeEmail });
    if (!employeeDoc) {
      employeeDoc = await EmployeeModel.create({
        userId: existingEmployeeUser._id,
        employeeId: "EMP-1001",
        name: "Alexander Vance",
        email: employeeEmail,
        department: "Engineering",
        role: "Lead Systems Architect",
        designation: "Principal Architect",
        employmentType: "FULL_TIME",
        status: "active",
      });
      console.log(`✅ Default Employee Document created (EMP-1001): ${employeeEmail}`);
    } else if (!employeeDoc.userId) {
      employeeDoc.userId = existingEmployeeUser._id;
      await employeeDoc.save();
    }

    // 4. Seed Initial Attendance Records if empty
    const { Attendance: AttendanceModel } = await import("../models/attendance.model.js");
    const countAttendance = await AttendanceModel.countDocuments();
    if (countAttendance === 0 && employeeDoc) {
      const today = new Date();
      const recordsToSeed = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);

        // Skip weekends
        if (d.getDay() === 0 || d.getDay() === 6) continue;

        const checkIn = new Date(d);
        checkIn.setHours(9, 0 + Math.floor(Math.random() * 15), 0);

        const checkOut = new Date(d);
        checkOut.setHours(17, 30 + Math.floor(Math.random() * 30), 0);

        const totalMins = Math.round((checkOut.getTime() - checkIn.getTime()) / 60000);

        recordsToSeed.push({
          employeeId: employeeDoc._id,
          date: d,
          checkIn,
          checkOut: i === 0 ? undefined : checkOut, // If today, keep shift active for check-out demonstration
          totalWorkingMinutes: i === 0 ? 0 : totalMins,
          status: i === 2 ? "late" : "present",
        });
      }

      if (recordsToSeed.length > 0) {
        await AttendanceModel.insertMany(recordsToSeed);
        console.log(`✅ Seeded ${recordsToSeed.length} attendance records for EMP-1001`);
      }
    }

    // 5. Seed Currencies
    const { CurrencySetting } = await import("../models/currency.model.js");
    const currencyCount = await CurrencySetting.countDocuments();
    if (currencyCount === 0) {
      await CurrencySetting.insertMany([
        { code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 1.0, isDefault: true, isActive: true, order: 1 },
        { code: "EUR", name: "Euro", symbol: "€", exchangeRate: 0.92, isDefault: false, isActive: true, order: 2 },
        { code: "GBP", name: "British Pound", symbol: "£", exchangeRate: 0.79, isDefault: false, isActive: true, order: 3 },
        { code: "INR", name: "Indian Rupee", symbol: "₹", exchangeRate: 86.5, isDefault: false, isActive: true, order: 4 },
        { code: "CAD", name: "Canadian Dollar", symbol: "C$", exchangeRate: 1.38, isDefault: false, isActive: true, order: 5 },
        { code: "AUD", name: "Australian Dollar", symbol: "A$", exchangeRate: 1.55, isDefault: false, isActive: true, order: 6 },
        { code: "AED", name: "UAE Dirham", symbol: "AED", exchangeRate: 3.67, isDefault: false, isActive: true, order: 7 },
        { code: "SGD", name: "Singapore Dollar", symbol: "S$", exchangeRate: 1.34, isDefault: false, isActive: true, order: 8 },
        { code: "JPY", name: "Japanese Yen", symbol: "¥", exchangeRate: 152.0, isDefault: false, isActive: true, order: 9 }
      ]);
      console.log("✅ Seeded 9 global currencies with dynamic exchange rates");
    }

    // 6. Seed Dynamic Pricing Plans
    const { PricingPlan } = await import("../models/pricing.model.js");
    const pricingCount = await PricingPlan.countDocuments();
    if (pricingCount === 0) {
      await PricingPlan.insertMany([
        {
          name: "Starter Sprint / MVP",
          slug: "starter",
          badge: "Fastest Time-to-Market",
          isPopular: false,
          isActive: true,
          order: 1,
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
            }
          ],
          ctaText: "Launch Starter Project",
          ctaHref: "/book-consultation?plan=starter"
        },
        {
          name: "Growth Squad",
          slug: "growth",
          badge: "Most Popular • High Velocity",
          isPopular: true,
          isActive: true,
          order: 2,
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
            }
          ],
          ctaText: "Deploy Dedicated Squad",
          ctaHref: "/book-consultation?plan=growth"
        },
        {
          name: "Enterprise Scale",
          slug: "enterprise",
          badge: "Mission-Critical Architecture",
          isPopular: false,
          isActive: true,
          order: 3,
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
            }
          ],
          ctaText: "Consult Enterprise Architect",
          ctaHref: "/contact?intent=enterprise-pricing"
        }
      ]);
      console.log("✅ Seeded 3 dynamic pricing plans");
    }

    // 7. Seed Authentic Engineering Blogs if collection is empty
    const { Blog } = await import("../models/blog.model.js");
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.insertMany([
        {
          title: "Building Micro-Frontend Architectures with Next.js 15 App Router",
          slug: "micro-frontend-architecture-nextjs-15",
          summary: "How to decompose massive enterprise React monoliths into isolated micro-frontends with sub-second page load times and zero dependency conflicts.",
          category: "Architecture",
          readTime: "7 min read",
          author: "Nuvexora Architecture Team",
          isPublished: true,
          publishedAt: new Date("2026-07-28T10:00:00Z"),
          coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
          tags: ["Next.js", "Micro-Frontends", "React", "System Architecture", "Performance"],
          content: `### 1. The Monolith Bottleneck in Modern Enterprise Teams

As software organizations scale past 50+ engineers, single-repo React applications become bottlenecks. Deployment pipelines slow down, continuous integration tests take 45+ minutes, and a minor regression in one domain can bring down the entire customer portal.

### 2. Implementing Module Federation with Next.js 15

Module Federation allows JavaScript applications to dynamically load code from another build at runtime. By decoupling core shell routes from individual domain modules (such as Billing, CRM, and Analytics), squads can build, test, and deploy independently without coordination overhead.

\`\`\`javascript
// next.config.js - Micro-Frontend Remote Module Configuration
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'billing_portal',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './InvoiceList': './src/components/InvoiceList.tsx',
        },
      })
    );
    return config;
  },
};
\`\`\`

### 3. Key Architecture Benefits & Measurable Impact

By adopting isolated micro-frontends with runtime federation:
- **3x Faster Release Velocity:** Squads deploy updates without locking the global build pipeline.
- **Zero Cross-Team Blast Radius:** Faults in non-critical modules degrade gracefully without crashing the shell application.
- **Shared Singleton Dependencies:** Common libraries like React, Tailwind, and React Query remain deduplicated across host and remote containers.`
        },
        {
          title: "Deploying Custom Vector Databases for Enterprise RAG AI Pipelines",
          slug: "vector-databases-rag-ai-pipelines",
          summary: "A practical step-by-step guide to scaling vector indexes with high-dimensional embedding models for enterprise document retrieval.",
          category: "AI & Data",
          readTime: "9 min read",
          author: "Dr. Aris Thorne",
          isPublished: true,
          publishedAt: new Date("2026-07-20T10:00:00Z"),
          coverImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000&auto=format&fit=crop",
          tags: ["AI", "Vector DB", "RAG", "Embeddings", "PyTorch"],
          content: `### 1. Scaling Retrieval-Augmented Generation (RAG) Beyond Toy Demos

While prototyping RAG pipelines on small document sets is straightforward, enterprise production workloads demand sub-50ms hybrid search across millions of dense vectors alongside strict tenant isolation.

### 2. Hybrid Sparse-Dense Indexing

Combining sparse BM25 keyword matching with dense HNSW vector similarity ensures both semantic intent and precise token matches (such as SKU numbers or compliance IDs) are captured with high reciprocal rank fusion scores.

\`\`\`python
# Vector search with hybrid re-ranking
from sentence_transformers import SentenceTransformer
import qdrant_client

model = SentenceTransformer("all-MiniLM-L6-v2")
client = qdrant_client.QdrantClient(host="localhost", port=6333)

def query_vector_store(query_text: str, tenant_id: str):
    vector = model.encode(query_text).tolist()
    results = client.search(
        collection_name="enterprise_knowledge",
        query_vector=vector,
        query_filter={"must": [{"key": "tenant_id", "match": {"value": tenant_id}}]},
        limit=5
    )
    return results
\`\`\`

### 3. Production Guarantees

Properly indexed vector partitions deliver deterministic retrieval latency while strictly honoring enterprise multi-tenant boundary controls.`
        },
        {
          title: "Zero-Downtime Multi-Region Cloud Deployment on AWS EKS & Terraform",
          slug: "zero-downtime-cloud-deployment-eks-terraform",
          summary: "How we configured automated failover across us-east-1 and eu-central-1 clusters maintaining 99.999% SLA uptime under high load.",
          category: "DevOps",
          readTime: "6 min read",
          author: "Marcus Sterling",
          isPublished: true,
          publishedAt: new Date("2026-07-14T10:00:00Z"),
          coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
          tags: ["DevOps", "Kubernetes", "AWS EKS", "Terraform", "SRE"],
          content: `### 1. Multi-Region Active-Active Topology

High-availability mission-critical platforms cannot rely on single-region infrastructure. By deploying synchronized Kubernetes clusters across multiple AWS availability zones and geographic regions, we eliminate single points of failure.

### 2. Route53 DNS Health Probes & Anycast Failover

Route53 latency-based routing steers global traffic to the nearest healthy cluster. If a health probe fails consecutively for 30 seconds, traffic seamlessly diverts with zero dropped TCP connections.

### 3. Continuous Delivery with ArgoCD

GitOps synchronization via ArgoCD guarantees declarative cluster state parity between regions, preventing configuration drift across distributed environments.`
        },
        {
          title: "Implementing Zero-Trust Security for Enterprise SaaS Applications",
          slug: "zero-trust-cybersecurity-saas-compliance",
          summary: "Strict SOC2 and ISO27001 compliance patterns: OAuth2, mTLS, biometric JWT claims, and immutable audit logging.",
          category: "Security",
          readTime: "8 min read",
          author: "Elena Rostova",
          isPublished: true,
          publishedAt: new Date("2026-07-08T10:00:00Z"),
          coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop",
          tags: ["Cybersecurity", "Zero-Trust", "SOC2", "OAuth2", "Compliance"],
          content: `### 1. The Death of Perimeter Security

In cloud-native SaaS, internal networks cannot be inherently trusted. Every service-to-service invocation must be explicitly authenticated, authorized, and encrypted.

### 2. Mutual TLS (mTLS) with Istio Service Mesh

Service meshes transparently inject sidecar proxies to negotiate mutual TLS between microservices, using short-lived X.509 certificates rotated automatically every 24 hours.

### 3. Immutable Cryptographic Audit Trails

Every privileged operation generates an immutable audit log entry signed with asymmetric keys, satisfying strict SOC2 Type II and HIPAA requirements.`
        },
        {
          title: "Scaling TypeScript Codebases Beyond 1 Million Lines of Code",
          slug: "scaling-typescript-codebases-1m-loc",
          summary: "Monorepo strategies, strict type safety bounds, automated lint pipelines, and compiler performance tuning.",
          category: "Software Engineering",
          readTime: "10 min read",
          author: "Alex Vance",
          isPublished: true,
          publishedAt: new Date("2026-07-02T10:00:00Z"),
          coverImage: "https://images.unsplash.com/photo-1516116211223-425856877086?q=80&w=1000&auto=format&fit=crop",
          tags: ["TypeScript", "Monorepo", "Architecture", "Clean Code"],
          content: `### 1. Compiler Bottlenecks at Scale

As TypeScript codebases exceed several hundred thousand lines of code, incremental typecheck times can degrade developer productivity without disciplined project boundaries.

### 2. Project References & Turborepo Boundaries

Decomposing the repository into strict modular packages using TypeScript Project References (\`composite: true\`) ensures the compiler only typechecks changed leaf packages rather than the entire dependency graph.

### 3. Strict Boundary Rules

Enforcing clean dependency isolation between domain contracts and UI representations maintains sub-second IDE feedback even on enterprise codebases.`
        }
      ]);
      console.log("✅ Seeded 5 authentic engineering blog articles");
    }

    console.log("✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding error:", error);
  }
};

// Execute directly if run via CLI
if (process.argv[1]?.endsWith("seed.ts")) {
  seedDatabase().then(() => process.exit(0));
}
