# BLDRKit Platform Foundation — Build Spec

## Overview
Rebuild the current RoofOS MVP into a production-ready, multi-tenant modular platform. This is the foundation that ALL trade modules will plug into.

**IMPORTANT:** This is a GROUND-UP rebuild. The current codebase is an MVP prototype. Keep the existing UI design language (dark theme, shadcn/ui, Tailwind) but rebuild the architecture properly.

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15 (App Router) | Already using, keep it |
| **Language** | TypeScript (strict mode) | Type safety |
| **Database** | PostgreSQL (via Supabase or Neon) | Production-ready, not SQLite |
| **ORM** | Prisma | Already using, keep it |
| **Auth** | NextAuth.js v5 (Auth.js) | Multi-provider, role-based |
| **UI** | shadcn/ui + Tailwind CSS | Already using, keep it |
| **Payments** | Stripe (subscriptions + one-time) | Industry standard |
| **File Storage** | Cloudflare R2 or Supabase Storage | For photos, documents |
| **Email** | Resend or SendGrid | Transactional emails |
| **State** | React Query (TanStack Query) | Server state management |

## Database Schema

### Core Tables (Shared Platform)

```prisma
// Organization = a company (roofing company, HVAC shop, etc.)
model Organization {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  email         String?
  phone         String?
  address       String?
  city          String?
  state         String?
  zip           String?
  logo          String?  // URL to uploaded logo
  
  // Subscription
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?   @unique
  plan                 Plan      @default(FREE)
  planStartedAt        DateTime?
  
  // Modules this org has enabled
  modules       OrganizationModule[]
  
  // Relations
  members       OrganizationMember[]
  customers     Customer[]
  jobs          Job[]
  invoices      Invoice[]
  estimates     Estimate[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Plan {
  FREE
  PRO
  BUSINESS
  SCALE
}

// Which trade modules are enabled for this org
model OrganizationModule {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  moduleKey      String       // "roofing", "hvac", "plumbing", "electrical", etc.
  enabledAt      DateTime     @default(now())
  config         Json?        // Module-specific configuration
  
  @@unique([organizationId, moduleKey])
}

// User accounts
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  phone         String?
  image         String?
  passwordHash  String?
  emailVerified DateTime?
  
  // Relations
  memberships   OrganizationMember[]
  sessions      Session[]
  accounts      Account[]  // OAuth accounts
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// Junction: User <-> Organization with role
model OrganizationMember {
  id             String       @id @default(cuid())
  userId         String
  user           User         @relation(fields: [userId], references: [id])
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  
  role           MemberRole   @default(MEMBER)
  moduleRoles    ModuleRole[] // Per-module role assignments
  
  invitedAt      DateTime     @default(now())
  acceptedAt     DateTime?
  
  @@unique([userId, organizationId])
}

enum MemberRole {
  ADMIN          // Sees everything, manages billing, users, all modules
  MODULE_MANAGER // Manages specific modules they're assigned to
  MEMBER         // Basic access, scoped by moduleRoles
}

// Per-module role assignments for a member
model ModuleRole {
  id                   String             @id @default(cuid())
  organizationMemberId String
  member               OrganizationMember @relation(fields: [organizationMemberId], references: [id])
  moduleKey            String             // "roofing", "hvac", etc.
  role                 String             // Module-specific role: "estimator", "technician", "office", "sales"
  
  @@unique([organizationMemberId, moduleKey])
}

// CRM: Customers (homeowners, property managers, etc.)
model Customer {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  
  firstName      String
  lastName       String
  email          String?
  phone          String?
  address        String?
  city           String?
  state          String?
  zip            String?
  
  source         String?      // "referral", "website", "angi", "thumbtack", etc.
  notes          String?
  tags           String[]     // Flexible tagging
  
  jobs           Job[]
  estimates      Estimate[]
  invoices       Invoice[]
  
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

// Jobs (work orders, projects)
model Job {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  customerId     String
  customer       Customer     @relation(fields: [customerId], references: [id])
  
  title          String
  description    String?
  moduleKey      String?      // Which trade module this job belongs to
  status         JobStatus    @default(LEAD)
  priority       Priority     @default(MEDIUM)
  
  // Scheduling
  scheduledStart DateTime?
  scheduledEnd   DateTime?
  completedAt    DateTime?
  
  // Financials
  estimatedValue Decimal?     @db.Decimal(10, 2)
  actualCost     Decimal?     @db.Decimal(10, 2)
  
  // Location (can differ from customer address)
  jobAddress     String?
  jobCity        String?
  jobState       String?
  jobZip         String?
  latitude       Float?
  longitude      Float?
  
  // Relations
  assignedTo     String[]     // User IDs of assigned team members
  estimates      Estimate[]
  invoices       Invoice[]
  photos         Photo[]
  notes          JobNote[]
  
  // Module-specific data (flexible JSON)
  moduleData     Json?
  
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

enum JobStatus {
  LEAD
  QUOTED
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  ON_HOLD
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

// Estimates / Quotes
model Estimate {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  customerId     String
  customer       Customer     @relation(fields: [customerId], references: [id])
  jobId          String?
  job            Job?         @relation(fields: [jobId], references: [id])
  
  estimateNumber String
  status         EstimateStatus @default(DRAFT)
  
  // Line items stored as JSON for flexibility
  lineItems      Json         // [{description, quantity, unitPrice, total}]
  subtotal       Decimal      @db.Decimal(10, 2)
  tax            Decimal?     @db.Decimal(10, 2)
  total          Decimal      @db.Decimal(10, 2)
  
  notes          String?
  validUntil     DateTime?
  sentAt         DateTime?
  acceptedAt     DateTime?
  
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

enum EstimateStatus {
  DRAFT
  SENT
  VIEWED
  ACCEPTED
  DECLINED
  EXPIRED
}

// Invoices
model Invoice {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  customerId     String
  customer       Customer     @relation(fields: [customerId], references: [id])
  jobId          String?
  job            Job?         @relation(fields: [jobId], references: [id])
  
  invoiceNumber  String
  status         InvoiceStatus @default(DRAFT)
  
  lineItems      Json
  subtotal       Decimal      @db.Decimal(10, 2)
  tax            Decimal?     @db.Decimal(10, 2)
  total          Decimal      @db.Decimal(10, 2)
  amountPaid     Decimal      @default(0) @db.Decimal(10, 2)
  
  dueDate        DateTime?
  sentAt         DateTime?
  paidAt         DateTime?
  
  // Stripe
  stripeInvoiceId  String?
  stripePaymentUrl String?
  
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

enum InvoiceStatus {
  DRAFT
  SENT
  VIEWED
  PARTIAL
  PAID
  OVERDUE
  VOID
}

// Photo documentation
model Photo {
  id             String   @id @default(cuid())
  jobId          String
  job            Job      @relation(fields: [jobId], references: [id])
  url            String
  caption        String?
  category       String?  // "before", "after", "damage", "progress", etc.
  uploadedBy     String   // User ID
  
  createdAt      DateTime @default(now())
}

// Job notes / activity log
model JobNote {
  id        String   @id @default(cuid())
  jobId     String
  job       Job      @relation(fields: [jobId], references: [id])
  userId    String
  content   String
  type      String   @default("note") // "note", "status_change", "assignment", "call", "email"
  
  createdAt DateTime @default(now())
}

// NextAuth required tables
model Account {
  id                String  @id @default(cuid())
  userId            String
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expires      DateTime
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}
```

## Directory Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx              # Authenticated layout with sidebar
│   │   ├── dashboard/page.tsx      # Main dashboard
│   │   ├── customers/
│   │   │   ├── page.tsx            # Customer list
│   │   │   └── [id]/page.tsx       # Customer detail
│   │   ├── jobs/
│   │   │   ├── page.tsx            # Job board (Kanban + list view)
│   │   │   └── [id]/page.tsx       # Job detail
│   │   ├── estimates/
│   │   │   ├── page.tsx            # Estimates list
│   │   │   └── [id]/page.tsx       # Estimate builder
│   │   ├── invoices/
│   │   │   ├── page.tsx            # Invoice list
│   │   │   └── [id]/page.tsx       # Invoice detail
│   │   ├── schedule/page.tsx       # Calendar view
│   │   ├── team/page.tsx           # Team management
│   │   ├── settings/
│   │   │   ├── page.tsx            # Org settings
│   │   │   ├── billing/page.tsx    # Subscription management
│   │   │   ├── modules/page.tsx    # Enable/disable trade modules
│   │   │   └── integrations/page.tsx
│   │   └── modules/
│   │       └── [moduleKey]/        # Dynamic route for trade-specific pages
│   │           └── [...slug]/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── customers/route.ts
│   │   ├── jobs/route.ts
│   │   ├── estimates/route.ts
│   │   ├── invoices/route.ts
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts
│   │   │   └── webhook/route.ts
│   │   └── modules/
│   │       └── [moduleKey]/route.ts
│   └── (marketing)/
│       ├── page.tsx                # Landing page
│       ├── pricing/page.tsx
│       └── features/page.tsx
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── ModuleNav.tsx
│   ├── customers/
│   ├── jobs/
│   ├── estimates/
│   ├── invoices/
│   └── modules/                    # Trade-specific components
│       ├── roofing/
│       ├── hvac/
│       └── ...
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── stripe.ts
│   ├── openai.ts
│   ├── permissions.ts              # Role-based access control helpers
│   └── modules/
│       ├── registry.ts             # Module registration system
│       ├── roofing.ts
│       └── ...
└── types/
    └── index.ts
```

## Core Features to Build

### 1. Authentication & Authorization
- Email/password signup + login
- Google OAuth
- Organization creation during onboarding
- Invite team members via email link
- **Role-based access control:**
  - Admin: full access to everything
  - Module Manager: full access within assigned modules
  - Member: access scoped by their ModuleRole assignments
- Session management via NextAuth v5

### 2. Organization Onboarding Flow
- Step 1: Create account (email/password or Google)
- Step 2: Name your company, upload logo
- Step 3: Select your trade(s) — this enables the right modules
- Step 4: Choose plan (show pricing page inline, start with Free)
- Step 5: Dashboard with guided setup checklist

### 3. CRM (Customer Management)
- Customer list with search, filter, sort
- Customer detail page (contact info, job history, notes, documents)
- Add/edit customer form
- Import customers from CSV
- Customer tags for segmentation
- Activity timeline per customer

### 4. Job Management
- **Kanban board** (drag-and-drop between status columns: Lead → Quoted → Scheduled → In Progress → Completed)
- **List view** with filters (status, date range, assigned to, trade module)
- Job detail page with:
  - Customer info
  - Scheduling (date/time picker)
  - Team assignment
  - Photo uploads (before/during/after)
  - Notes / activity log
  - Linked estimates and invoices
  - Map view of job location
  - Module-specific fields (loaded dynamically based on moduleKey)

### 5. Estimates / Quoting
- Estimate builder with line items (description, qty, unit price, total)
- Auto-calculate subtotal, tax, total
- PDF generation for sending to customer
- Email estimate to customer
- Customer acceptance tracking (sent → viewed → accepted/declined)
- Convert accepted estimate → job + invoice

### 6. Invoicing
- Invoice builder (similar to estimates)
- Stripe payment links (customer pays online)
- Invoice status tracking
- Partial payments
- Overdue reminders (automated email)
- PDF generation and email sending

### 7. Scheduling / Calendar
- Calendar view (day/week/month)
- Drag-and-drop job scheduling
- Team member calendar views
- Color-coded by trade module or status

### 8. Dashboard
- Revenue summary (this month, last month, YTD)
- Job pipeline (count by status)
- Upcoming schedule (next 7 days)
- Recent activity feed
- Outstanding invoices / overdue alerts
- Quick actions (new customer, new job, new estimate)

### 9. Team Management
- Invite team members
- Assign roles (Admin, Module Manager, Member)
- Per-module role assignment (estimator, technician, office, sales)
- Active/inactive status

### 10. Settings
- Organization profile (name, logo, address, phone)
- Billing / plan management (Stripe customer portal)
- Module management (enable/disable trade modules)
- Integration settings (placeholder for QBO, etc.)

## Design Requirements

- **Dark mode default** (like current RoofOS, dark SaaS aesthetic)
- **Light mode option** (toggle in settings)
- **Mobile responsive** — must work well on phone screens (contractors are in the field)
- **Fast** — no unnecessary loading states, optimistic updates
- **Clean** — professional, not cluttered. Think Linear/Vercel aesthetic.
- **BLDRKit branding** — use "BLDR" in accent color, "Kit" in default text color

## Environment Variables Needed

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://bldrkit.com

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...

# OpenAI (for AI features)
OPENAI_API_KEY=...

# File storage
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_ENDPOINT=...

# Email
RESEND_API_KEY=...
```

## What NOT to build yet
- QuickBooks integration (Phase 1 follow-up)
- Trade-specific module features (separate specs)
- AI estimation features (separate spec)
- Mobile native app (PWA first)
- Marketplace features
- Fintech/payment processing beyond basic Stripe

## Definition of Done
1. All core features above are functional
2. `npm run build` passes with zero errors
3. Prisma schema migrates cleanly to PostgreSQL
4. Auth flow works end-to-end (register → login → create org → invite member)
5. Role-based access actually restricts pages/actions correctly
6. Kanban job board works with drag-and-drop
7. Estimates and invoices can be created, sent (PDF), and tracked
8. Dashboard shows real data from the database
9. Seed script creates demo data for testing
10. Deployed and accessible at bldrkit.com
