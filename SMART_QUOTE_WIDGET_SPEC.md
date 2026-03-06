# Smart Quote Widget — Build Spec

_The core product of BLDRKit. A guided quote flow that turns website visitors into pre-qualified leads with roof measurements, material preferences, photos, and a booked appointment._

## Overview

When a homeowner visits a BLDRKit-powered roofing website and clicks "Get an Instant Estimate," they enter a step-by-step guided flow that:

1. Gets their address
2. Automatically measures their roof (via Google Solar API)
3. Asks what work they need
4. Asks material preference
5. Lets them upload damage photos
6. Shows an instant ballpark estimate
7. Lets them book an inspection appointment
8. Sends the roofer a text/email with the full lead package

The roofer gets: name, phone, email, address, roof sq footage, pitch, material preference, damage photos, and an appointment — all before they pick up the phone.

## User Flow (Homeowner)

### Step 1: Address Entry
- Full-screen modal or dedicated page
- Input: Street address with Google Places Autocomplete
- "Get My Instant Estimate" button
- On submit: geocode address → call Google Solar API

### Step 2: Roof Analysis (automatic — show loading animation)
- Call Google Solar API `buildingInsights:findClosest` with lat/lng
- Extract from response:
  - `roofSegmentSummaries` → count segments, get pitch per segment
  - `wholeRoofStats.areaMeters2` → total roof area (convert to sq ft)
  - `maxArrayPanelsCount` × panel dimensions → usable roof area
  - `imageryDate` → how recent the aerial imagery is
- Display to homeowner:
  - "Your roof is approximately **2,400 sq ft**"
  - "Roof pitch: **6/12 (moderate)**"
  - "Roof complexity: **Medium** (4 sections)"
- If Solar API has no data for the address, fall back to manual entry:
  - "We couldn't measure your roof automatically. Enter approximate sq footage:"
  - Provide common ranges as quick-select buttons (1,000-1,500 / 1,500-2,000 / 2,000-2,500 / 2,500-3,000 / 3,000+)

### Step 3: What do you need?
- Radio/card selection:
  - 🏠 Full Roof Replacement
  - 🔧 Roof Repair
  - ⛈️ Storm/Hail Damage
  - 🔍 Inspection Only
  - ❓ Not Sure — I Need an Expert Opinion

### Step 4: Material Preference
- Only shown for "Full Replacement" or "Not Sure"
- Card selection with images and price indicators:
  - **3-Tab Shingles** — Budget-friendly · $
  - **Architectural Shingles** — Most popular · $$
  - **Metal Roofing** — Premium durability · $$$
  - **Tile** — High-end · $$$$
  - **Not sure — recommend something** (default)
- Each card shows a small thumbnail of the material

### Step 5: Photo Upload (optional)
- "Upload photos of your roof or any damage (optional)"
- Drag-and-drop or camera capture (mobile)
- Accept up to 5 photos, max 10MB each
- Thumbnail preview with remove button
- "Skip" button prominently shown
- Explain value: "Photos help your roofer prepare a more accurate quote"

### Step 6: Instant Estimate
- Show the ballpark range based on:
  - Roof area (from Solar API)
  - Material selected (from roofer's price table)
  - Work type
  - Regional multiplier (if configured)
- Format: "Your estimated cost: **$12,000 — $16,000**"
- Subtext: "This is a preliminary estimate based on aerial measurements. Your final quote will be confirmed after an on-site inspection."
- Disclaimer: "Estimate provided by [Roofer Company Name]. Actual pricing may vary."

### Step 7: Contact Info + Book Appointment
- Name (required)
- Phone (required)
- Email (required)
- Preferred appointment date/time (calendar picker)
  - Show roofer's available slots (if configured)
  - Or just preferred date + morning/afternoon/evening
- "Book My Free Inspection" button
- Trust signals below the form:
  - "Licensed & Insured"
  - "Free inspection — no obligation"
  - "We'll confirm your appointment within 1 hour"

### Step 8: Confirmation
- "You're all set! 🎉"
- Summary of what they submitted
- "Your roofer will contact you within [X] to confirm your appointment."
- Roofer's phone number displayed: "Can't wait? Call us: (555) 123-4567"

## Roofer Dashboard (Lead Management)

### Lead Notification
When a quote is submitted:
- **SMS** to roofer (via Twilio or similar): "New lead! [Name] at [Address]. 2,400 sq ft roof, wants architectural shingles. Appointment: Sat 10am. View: [link]"
- **Email** with full details including photos
- **Dashboard notification** (in-app)

### Lead Detail View
- Contact info (name, phone, email)
- Property info (address, roof sq ft, pitch, complexity, # segments)
- What they need (replacement/repair/storm/inspection)
- Material preference
- Photos (thumbnails, click to enlarge)
- Estimate shown ($12K-$16K)
- Appointment date/time
- Lead status (New → Contacted → Inspection Scheduled → Quoted → Won/Lost)
- Notes field
- Google Maps embed of the property

### Roofer Settings (Pricing Configuration)
Under Settings > Pricing:
- Price per square foot by material:
  - 3-Tab Shingles: $__/sq ft (default: $3.50)
  - Architectural Shingles: $__/sq ft (default: $4.50)
  - Metal Roofing: $__/sq ft (default: $7.00)
  - Tile: $__/sq ft (default: $10.00)
- Minimum job price: $____ (default: $5,000)
- Markup percentage for repairs: ___% (default: varies)
- Complexity multiplier: simple 1.0x / medium 1.15x / complex 1.3x

## Technical Architecture

### API Routes (Next.js API routes)

```
POST /api/quote/measure
  Input: { address: string }
  Process: Geocode → Google Solar API → extract roof data
  Output: { sqft, pitch, segments, complexity, lat, lng, imageryDate }

POST /api/quote/estimate  
  Input: { sqft, pitch, complexity, material, workType, companyId }
  Process: Look up company pricing → calculate range
  Output: { lowEstimate, highEstimate, material, sqft }

POST /api/quote/submit
  Input: { name, phone, email, address, roofData, material, workType, photos[], appointmentDate, companyId }
  Process: Save lead → send notifications → upload photos
  Output: { leadId, confirmationMessage }

GET /api/quote/availability?companyId=X&date=YYYY-MM-DD
  Output: { slots: [{ time, available }] }
```

### Database Models (Prisma)

```prisma
model Lead {
  id            String   @id @default(cuid())
  companyId     String
  company       Company  @relation(fields: [companyId], references: [id])
  
  // Contact
  name          String
  phone         String
  email         String
  
  // Property
  address       String
  lat           Float?
  lng           Float?
  roofSqft      Float?
  roofPitch     Float?
  roofSegments  Int?
  roofComplexity String?  // simple, medium, complex
  
  // Quote
  workType      String   // replacement, repair, storm, inspection, unsure
  material      String?  // 3tab, architectural, metal, tile, unsure
  lowEstimate   Float?
  highEstimate  Float?
  
  // Photos
  photos        LeadPhoto[]
  
  // Appointment
  appointmentDate DateTime?
  appointmentSlot String?  // morning, afternoon, evening
  
  // Status
  status        String   @default("new") // new, contacted, scheduled, quoted, won, lost
  notes         String?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model LeadPhoto {
  id       String @id @default(cuid())
  leadId   String
  lead     Lead   @relation(fields: [leadId], references: [id])
  url      String
  filename String
  createdAt DateTime @default(now())
}

model PricingConfig {
  id              String  @id @default(cuid())
  companyId       String  @unique
  company         Company @relation(fields: [companyId], references: [id])
  
  threeTabPerSqft    Float @default(3.50)
  architecturalPerSqft Float @default(4.50)
  metalPerSqft       Float @default(7.00)
  tilePerSqft        Float @default(10.00)
  
  minimumJobPrice    Float @default(5000)
  repairMarkup       Float @default(0.20)
  
  complexitySimple   Float @default(1.0)
  complexityMedium   Float @default(1.15)
  complexityComplex  Float @default(1.30)
  
  updatedAt       DateTime @updatedAt
}
```

### External APIs Required

1. **Google Solar API** (`buildingInsights:findClosest`)
   - Input: lat/lng
   - Returns: roof area, segments with pitch, panel data
   - Cost: ~$10-20 per 1,000 requests (basically free)
   - Needs: Google Cloud project with Solar API enabled + API key

2. **Google Geocoding API** (or Places Autocomplete)
   - Address → lat/lng
   - Cost: $5 per 1,000 requests
   - Needs: Same Google Cloud project

3. **Google Places Autocomplete** (frontend)
   - Address autocomplete in the input field
   - Needs: Maps JavaScript API key (restricted to domain)

4. **Photo Upload**
   - Use Vercel Blob storage or Cloudflare R2
   - Accept: jpg, png, heic (convert heic → jpg server-side)
   - Max: 5 photos, 10MB each

5. **Notifications** (Phase 2 — for now, just email)
   - Email: Resend or SendGrid (free tier)
   - SMS: Twilio ($0.0079/msg) — Phase 2

### Environment Variables Needed
```
GOOGLE_MAPS_API_KEY=        # For Solar API + Geocoding + Places
NEXT_PUBLIC_GOOGLE_MAPS_KEY= # For frontend Places Autocomplete
BLOB_READ_WRITE_TOKEN=      # For Vercel Blob (photo upload)
RESEND_API_KEY=             # For email notifications
```

## UI Design

- **Style:** Clean, modern, mobile-first. Trust-building.
- **Widget container:** White card with subtle shadow, rounded corners
- **Progress indicator:** Step dots or progress bar at top (Step 2 of 7)
- **Transitions:** Smooth slide-left between steps
- **Mobile:** Full-screen takeover on mobile, bottom-sheet style on desktop
- **Colors:** Use the roofer's brand colors (configured in their settings)
- **Loading state (Step 2):** Animated house icon with scanning effect while Solar API loads

## Component Structure

```
src/components/quote-widget/
  QuoteWidget.tsx          — Main container, manages step state
  steps/
    AddressStep.tsx        — Google Places autocomplete input
    RoofAnalysis.tsx       — Solar API loading + results display
    WorkTypeStep.tsx       — What kind of work needed
    MaterialStep.tsx       — Material selection cards
    PhotoUploadStep.tsx    — Drag-drop photo upload
    EstimateStep.tsx       — Show the price range
    ContactBookingStep.tsx — Name/phone/email + appointment picker
    ConfirmationStep.tsx   — Success screen
  hooks/
    useRoofMeasurement.ts  — Google Solar API hook
    useQuoteEstimate.ts    — Pricing calculation hook
  
src/app/api/quote/
  measure/route.ts         — Geocoding + Solar API
  estimate/route.ts        — Price calculation
  submit/route.ts          — Save lead + send notifications
  availability/route.ts    — Appointment slots
```

## Estimate Calculation Logic

```typescript
function calculateEstimate(
  sqft: number,
  material: string,
  workType: string,
  complexity: string,
  pricing: PricingConfig
): { low: number; high: number } {
  // Get base price per sqft
  const basePrices = {
    '3tab': pricing.threeTabPerSqft,
    'architectural': pricing.architecturalPerSqft,
    'metal': pricing.metalPerSqft,
    'tile': pricing.tilePerSqft,
    'unsure': pricing.architecturalPerSqft, // default to most common
  };
  
  const basePrice = basePrices[material] || basePrices['architectural'];
  
  // Complexity multiplier
  const complexityMultipliers = {
    'simple': pricing.complexitySimple,
    'medium': pricing.complexityMedium,
    'complex': pricing.complexityComplex,
  };
  const complexityMult = complexityMultipliers[complexity] || 1.15;
  
  // Work type adjustment
  let workMultiplier = 1.0;
  if (workType === 'repair') workMultiplier = 0.3; // repairs ~30% of full replacement
  if (workType === 'storm') workMultiplier = 0.8;  // storm damage varies
  if (workType === 'inspection') return { low: 0, high: 0 }; // free inspection
  
  // Calculate
  const baseEstimate = sqft * basePrice * complexityMult * workMultiplier;
  
  // Apply range (±15%)
  const low = Math.max(Math.round(baseEstimate * 0.85 / 100) * 100, pricing.minimumJobPrice);
  const high = Math.round(baseEstimate * 1.15 / 100) * 100;
  
  return { low, high };
}
```

## Google Solar API — Roof Data Extraction

```typescript
interface RoofData {
  totalSqft: number;
  avgPitchDegrees: number;
  pitchRatio: string;      // e.g., "6/12"
  segments: number;
  complexity: 'simple' | 'medium' | 'complex';
  imageryDate: string;
}

async function measureRoof(lat: number, lng: number): Promise<RoofData> {
  const res = await fetch(
    `https://solar.googleapis.com/v1/buildingInsights:findClosest?` +
    `location.latitude=${lat}&location.longitude=${lng}` +
    `&requiredQuality=HIGH&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  
  const data = await res.json();
  const solar = data.solarPotential;
  
  // Extract roof area from wholeRoofStats
  const areaMeters2 = solar.wholeRoofStats.areaMeters2;
  const totalSqft = Math.round(areaMeters2 * 10.764); // m² to ft²
  
  // Get pitch from roof segments (weighted average)
  const segments = solar.roofSegmentSummaries || [];
  const avgPitch = segments.length > 0
    ? segments.reduce((sum, s) => sum + s.pitchDegrees, 0) / segments.length
    : 20; // default ~4/12
  
  // Convert degrees to X/12 ratio
  const pitchOver12 = Math.round(Math.tan(avgPitch * Math.PI / 180) * 12);
  
  // Determine complexity by segment count
  const complexity = segments.length <= 2 ? 'simple' 
    : segments.length <= 6 ? 'medium' 
    : 'complex';
  
  return {
    totalSqft,
    avgPitchDegrees: Math.round(avgPitch * 10) / 10,
    pitchRatio: `${pitchOver12}/12`,
    segments: segments.length,
    complexity,
    imageryDate: data.imageryDate?.year 
      ? `${data.imageryDate.year}-${data.imageryDate.month}-${data.imageryDate.day}`
      : 'unknown'
  };
}
```

## Phase 1 Scope (BUILD THIS NOW)

1. ✅ Quote widget UI (all 8 steps)
2. ✅ Google Solar API integration (measure endpoint)
3. ✅ Estimate calculation (estimate endpoint)
4. ✅ Lead submission + save to DB (submit endpoint)
5. ✅ Email notification to roofer (via Resend)
6. ✅ Lead list in dashboard (/dashboard/leads)
7. ✅ Lead detail view
8. ✅ Pricing configuration in settings
9. ✅ Embed the widget on the landing page as a CTA demo

## Phase 2 (Later)
- SMS notifications via Twilio
- Appointment calendar with time slots
- Google Street View integration
- Zillow property data enrichment
- Photo AI analysis (detect damage type)
- Lead status automation
- CRM integrations (webhook)

## Key Constraints
- Mobile-first — most homeowners will use this on their phone
- Fast — Solar API call should be <2 seconds, whole flow <60 seconds
- Trust-building — every screen should reduce anxiety, not increase it
- The widget must work as both a full page AND an embeddable component
- Photos upload to Vercel Blob (or fall back to base64 in DB for MVP)
- For MVP, email notifications only (no SMS yet)
- Google Maps API key needed — Devin has a GCP project, need to enable Solar API
