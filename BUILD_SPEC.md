# RoofOS — Build Specification

## Overview
Build a fully functioning web app: AI-powered SaaS platform for independent roofing contractors.
Four integrated modules: SEO Website Builder, Instant Price Quote Tool, AI Roof Visualization, Lead Management CRM.

## Tech Stack
- **Frontend:** Next.js 14 (App Router) + TailwindCSS + shadcn/ui components
- **Backend:** Next.js API routes (keep it monolithic for MVP — no separate FastAPI server)
- **Database:** SQLite via Prisma (simple, no Docker dependency for MVP)
- **AI:** OpenAI API (GPT-4o for roof estimation, DALL-E 3 for visualization)
- **Maps:** Google Maps Static API (STUB THIS — use placeholder satellite images for now, env var GOOGLE_MAPS_API_KEY)
- **Auth:** NextAuth.js with email/password for roofer login
- **Deployment:** Vercel-ready (env vars for all secrets)

## Design Requirements
- Modern, clean, professional UI — think Linear/Vercel aesthetic
- Dark sidebar navigation
- Responsive — works on mobile and desktop
- Color scheme: deep navy (#1a1a2e) + emerald green (#10b981) + white
- Professional but approachable — these are tradespeople, not developers

## Module 1: Dashboard
- Overview cards: total leads, leads this month, conversion rate, revenue pipeline
- Recent activity feed
- Quick action buttons for each module

## Module 2: SEO Website Builder
- Template selection (3 templates: Modern, Classic, Bold)
- WYSIWYG-style editor for:
  - Business name, logo upload, phone, email
  - Services offered (checkboxes: roof replacement, repair, inspection, storm damage, commercial)
  - Service areas (multi-select or text input)
  - About section (text editor)
  - Testimonials (add/edit/delete)
  - Photo gallery (upload images)
- Live preview panel showing the generated website
- "Publish" button (generates a static site — for now just show preview)
- Pre-configured SEO: meta tags, schema markup, Open Graph

## Module 3: Instant Price Quote Tool
- Address input with autocomplete (stub — use text input for now, Google Maps integration later)
- Display area for satellite image (use placeholder image for now, will integrate Google Maps Static API)
- AI-generated roof area estimate (call OpenAI GPT-4o with address/building info to estimate sq ft)
- Price calculator showing ranges for each material type:
  - Asphalt Shingles: $3.50-$5.50/sqft
  - Metal Roofing: $7-$12/sqft
  - Tile: $10-$18/sqft
  - Slate: $15-$25/sqft
  - Flat/TPO: $5-$8/sqft
- Lead capture form (name, email, phone, address, preferred material, notes)
- Submissions create a lead in the CRM automatically

## Module 4: AI Roof Visualization
- Photo upload area (drag & drop)
- Material selector (asphalt, metal, tile, slate, cedar shake)
- Color/style options per material
- "Generate Visualization" button → calls OpenAI DALL-E 3
- Side-by-side comparison: original photo vs AI-rendered visualization
- Download/share generated images
- Material recommendation section based on:
  - Budget preference (slider: budget → premium)
  - Climate (dropdown: hot/dry, cold/snow, humid/tropical, temperate, coastal)
  - Aesthetic preference (modern, traditional, rustic)
  - Priority (durability, energy efficiency, curb appeal, low maintenance)

## Module 5: Lead Management CRM
- Kanban board with columns: New → Contacted → Quoted → Negotiating → Won → Lost
- Drag-and-drop cards between columns
- Lead card shows: name, phone, email, address, source (quote tool/manual/website), job type, estimated value
- Click card to expand full detail view:
  - Contact info
  - Job details (type, roof area, material preference)
  - Quote history
  - Notes (add timestamped notes)
  - Activity log
- Lead creation form (manual entry)
- Filters: by status, job type, date range, value
- Job types: Full Replacement, Major Repair, Inspection, Storm/Emergency
- Bulk actions: mark as contacted, assign, export

## Database Schema (Prisma)

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String
  businessName  String?
  phone         String?
  createdAt     DateTime @default(now())
  leads         Lead[]
  website       Website?
  quotes        Quote[]
  visualizations Visualization[]
}

model Lead {
  id            String   @id @default(cuid())
  name          String
  email         String?
  phone         String?
  address       String?
  status        String   @default("new") // new, contacted, quoted, negotiating, won, lost
  jobType       String?  // replacement, repair, inspection, storm
  source        String?  // quote_tool, manual, website
  estimatedValue Float?
  roofArea      Float?
  materialPref  String?
  notes         Note[]
  quote         Quote?
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Note {
  id        String   @id @default(cuid())
  content   String
  leadId    String
  lead      Lead     @relation(fields: [leadId], references: [id])
  createdAt DateTime @default(now())
}

model Quote {
  id            String   @id @default(cuid())
  address       String
  roofAreaSqFt  Float?
  materialType  String?
  priceMin      Float?
  priceMax      Float?
  leadName      String?
  leadEmail     String?
  leadPhone     String?
  leadId        String?  @unique
  lead          Lead?    @relation(fields: [leadId], references: [id])
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  createdAt     DateTime @default(now())
}

model Website {
  id            String   @id @default(cuid())
  template      String   @default("modern")
  businessName  String?
  phone         String?
  email         String?
  logo          String?
  aboutText     String?
  services      String?  // JSON array
  serviceAreas  String?  // JSON array
  testimonials  String?  // JSON array of objects
  photos        String?  // JSON array of URLs
  colorScheme   String?  // JSON object
  published     Boolean  @default(false)
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Visualization {
  id            String   @id @default(cuid())
  originalImage String
  generatedImage String?
  material      String
  style         String?
  status        String   @default("pending") // pending, processing, complete, failed
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  createdAt     DateTime @default(now())
}
```

## API Routes

### Auth
- POST /api/auth/register — create account
- POST /api/auth/login — login
- GET /api/auth/me — current user

### Leads
- GET /api/leads — list leads (with filters)
- POST /api/leads — create lead
- PATCH /api/leads/[id] — update lead (status, details)
- DELETE /api/leads/[id] — delete lead

### Notes
- POST /api/leads/[id]/notes — add note to lead
- GET /api/leads/[id]/notes — get notes for lead

### Quotes
- POST /api/quotes — generate quote (calls OpenAI for roof estimation)
- GET /api/quotes — list quotes
- GET /api/quotes/[id] — get quote detail

### Website Builder
- GET /api/website — get current website config
- PUT /api/website — update website config
- GET /api/website/preview — render preview HTML

### Visualization
- POST /api/visualizations — upload photo + generate visualization (calls DALL-E)
- GET /api/visualizations — list visualizations
- GET /api/visualizations/[id] — get visualization detail

### Dashboard
- GET /api/dashboard/stats — aggregate stats (lead count, conversion rate, pipeline value)

## Environment Variables
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="generate-a-random-secret"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="(from env)"
GOOGLE_MAPS_API_KEY="(stub — not required for initial build)"
```

## File Structure
```
roofos/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (landing/login)
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── leads/
│   │   │   └── page.tsx (CRM Kanban)
│   │   ├── quotes/
│   │   │   └── page.tsx
│   │   ├── website-builder/
│   │   │   └── page.tsx
│   │   ├── visualizer/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       ├── leads/
│   │       ├── quotes/
│   │       ├── website/
│   │       ├── visualizations/
│   │       └── dashboard/
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── dashboard/
│   │   │   └── StatsCards.tsx
│   │   ├── leads/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── LeadCard.tsx
│   │   │   └── LeadDetail.tsx
│   │   ├── quotes/
│   │   │   ├── AddressInput.tsx
│   │   │   ├── RoofEstimate.tsx
│   │   │   └── PriceCalculator.tsx
│   │   ├── website-builder/
│   │   │   ├── TemplateSelector.tsx
│   │   │   ├── SiteEditor.tsx
│   │   │   └── SitePreview.tsx
│   │   └── visualizer/
│   │       ├── PhotoUpload.tsx
│   │       ├── MaterialSelector.tsx
│   │       └── VisualizationResult.tsx
│   └── lib/
│       ├── prisma.ts
│       ├── openai.ts
│       └── auth.ts
├── public/
│   └── placeholder-satellite.jpg
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Key Implementation Notes
1. Use `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` to scaffold
2. Use `npx shadcn@latest init` then add components: button, card, input, select, dialog, dropdown-menu, badge, tabs, avatar, separator
3. For the Kanban board, use @hello-pangea/dnd (maintained fork of react-beautiful-dnd)
4. For image upload, use local file storage initially (public/uploads/)
5. DALL-E 3 calls should be async — show a loading state while generating
6. The quote tool should work WITHOUT the Google Maps API — use a placeholder image and text-based address input
7. Seed the database with demo data (5 sample leads, 2 quotes) so the app looks alive on first load
8. Make sure `npm run build` passes before declaring done

## DO NOT:
- Use any API key directly in code — always use environment variables
- Skip error handling — every API route needs try/catch with proper error responses
- Leave TODO comments without implementing — build the full feature
- Use deprecated packages or patterns
- Forget mobile responsiveness
