# BLDRKit Website Builder — Complete Build Spec for Forge

_The ultimate website builder for roofers. Not a generic builder — a purpose-built, SEO-optimized, lead-generating machine._

## Vision

A roofer with zero tech experience should be able to launch a professional, SEO-optimized website in under 30 minutes that:
- Ranks organically for "[service] + [city]" keywords
- Converts visitors into booked appointments
- Looks like it cost $5,000 to build
- Auto-generates all the pages, content, and SEO metadata they need
- Includes a "Text Us" / "Book Now" widget for instant lead capture

**Inspiration:** [InterstateAutoCare.com](https://www.interstateautocare.com/) by Shopgenie/Tekmetrik — but built for roofers, with AI, and 10x easier.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    WEBSITE BUILDER                        │
│                                                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   Builder    │  │   Template   │  │  AI Content    │  │
│  │   Dashboard  │  │   Engine     │  │  Generator     │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘  │
│         │                │                    │           │
│  ┌──────┴────────────────┴────────────────────┴────────┐ │
│  │              Generated Static Site                   │ │
│  │  (HTML/CSS/JS deployed to Vercel/Cloudflare Pages)  │ │
│  └──────┬──────────────────────────────────────────────┘ │
│         │                                                 │
│  ┌──────┴──────────────────────────────────────────────┐ │
│  │              Lead Capture Backend                    │ │
│  │  (Booking widget, text/SMS, forms, notifications)   │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Part 1: Onboarding Flow (30-Minute Setup)

The roofer answers a few questions, AI generates everything.

### Step 1: Company Info (2 min)
```
Fields:
- Company name
- Phone number
- Email
- Address (street, city, state, zip)
- Logo upload (optional — we generate a placeholder if none)
- Business hours (Mon-Sat with time pickers)
- Years in business
- License number (optional)
- Insurance info (optional)
```

### Step 2: Services Offered (3 min)
Present a checklist of common roofing services. Roofer checks what they offer:

**Core Services:**
- [ ] Roof Replacement
- [ ] Roof Repair
- [ ] Emergency Roof Repair / Leak Repair
- [ ] Roof Inspection
- [ ] Storm Damage Repair
- [ ] Insurance Claim Assistance

**Material Specialties:**
- [ ] Asphalt Shingle Roofing
- [ ] Metal Roofing
- [ ] Tile Roofing
- [ ] Flat Roofing (TPO, EPDM, Modified Bitumen)
- [ ] Cedar Shake Roofing
- [ ] Slate Roofing
- [ ] Synthetic / Composite Roofing

**Additional Services:**
- [ ] Gutter Installation & Repair
- [ ] Siding Installation & Repair
- [ ] Skylight Installation
- [ ] Attic Insulation
- [ ] Roof Ventilation
- [ ] Chimney Repair / Flashing
- [ ] Commercial Roofing
- [ ] New Construction Roofing

Each checked service becomes its own SEO-optimized page.

### Step 3: Service Area (2 min)
- Primary city (auto-detected from address)
- Additional cities served (multi-select from nearby cities, or type in)
- Service radius (miles)

Each city becomes a service area landing page (e.g., "/roofing-contractor-dallas-tx").

### Step 4: Choose Template (2 min)
Show 3-5 pre-built templates. All are:
- Mobile-first responsive
- Dark and light variants
- Professional photography placeholders
- Optimized for roofing companies

Templates:
1. **Storm Shield** — Bold, high-contrast. Great for storm restoration companies.
2. **Craftsman** — Warm, trustworthy. Great for family-owned companies.
3. **Modern Pro** — Clean, minimal. Great for commercial roofers.
4. **Neighborhood** — Friendly, local feel. Great for residential specialists.
5. **Premium** — Luxury aesthetic. Great for high-end custom roofing.

### Step 5: Content Generation (AI does the work, 5-10 min)
Once the roofer completes Steps 1-4, AI generates:
- Homepage content
- All service page content (unique, SEO-optimized, 500-1000 words each)
- All service area page content (unique per city)
- About Us page draft
- FAQ content (10-15 common roofing questions)
- Meta titles and descriptions for every page
- Schema markup (LocalBusiness, Service, FAQ, Review)
- Blog post outlines (5 starter posts)
- Alt text for all images

The roofer can review/edit any generated content before publishing.

### Step 6: Review & Publish (5 min)
- Preview the full site
- Edit any text inline (click to edit, WYSIWYG)
- Swap photos from a curated roofing stock photo library
- Upload their own project photos
- Connect custom domain (or use subdomain: companyname.bldrkit.com)
- Publish

---

## Part 2: Pages & Content Structure

### Required Pages (auto-generated)

#### 1. Homepage
**URL:** `/`
**SEO Target:** "[Company Name] - Roofing Contractor in [City], [State]"

Content sections (in order):
1. **Hero** — Full-width image/video, company name, tagline, primary CTA ("Get Free Estimate" or "Book Inspection"), phone number, star rating
2. **Trust Badges** — Years in business, license #, insurance, certifications, warranties
3. **Services Grid** — Visual grid of services offered, each linking to service page
4. **Why Choose Us** — 4-6 differentiators (licensed, insured, warranty, local, etc.)
5. **Photo Gallery** — Before/after project photos (or stock if none uploaded)
6. **Testimonials** — Customer reviews (imported from Google Business Profile)
7. **Service Area Map** — Interactive map showing service areas
8. **About Section** — Brief company story
9. **Recent Blog Posts** — 3 latest blog entries
10. **CTA Footer** — "Ready to Get Started?" with booking widget trigger
11. **Contact Info** — Address, phone, email, hours, social links

#### 2. Service Pages (one per checked service)
**URL pattern:** `/services/[service-slug]-[city]-[state]`
**Example:** `/services/roof-replacement-dallas-tx`
**SEO Target:** "Roof Replacement in Dallas TX | [Company Name]"

Content sections:
1. **Hero** — Service name, brief description, CTA
2. **What is [Service]?** — Educational content explaining the service
3. **Our Process** — Step-by-step how they handle this service (AI generated based on service type)
4. **Materials/Options** — If applicable (material types, quality tiers)
5. **Signs You Need [Service]** — Common indicators (great for SEO, answers search queries)
6. **Cost Factors** — What affects pricing (not actual prices — that's a lead gen opportunity)
7. **Why Choose Us for [Service]** — Differentiators specific to this service
8. **FAQ Section** — 3-5 FAQs about this service (with FAQ schema markup)
9. **Related Services** — Internal links to other relevant services
10. **CTA** — "Get a Free [Service] Estimate" with booking widget

**Sub-service pages:** For services with sub-specialties (like the Interstate Auto Care model with AC Compressor Repair, AC Recharge, etc.), generate deeper pages:
- `/services/roof-replacement-dallas-tx/asphalt-shingle-replacement`
- `/services/roof-replacement-dallas-tx/metal-roof-installation`
- `/services/storm-damage-repair-dallas-tx/insurance-claim-help`
- `/services/storm-damage-repair-dallas-tx/emergency-tarp-service`

#### 3. Service Area Pages (one per city)
**URL pattern:** `/roofing-contractor-[city]-[state]`
**Example:** `/roofing-contractor-plano-tx`
**SEO Target:** "Roofing Contractor in Plano TX | [Company Name]"

Content sections:
1. **Hero** — "Trusted Roofing Contractor in [City], [State]"
2. **About Serving [City]** — Localized content mentioning neighborhoods, landmarks, weather patterns
3. **Services Available in [City]** — List of all services offered
4. **Why Local Matters** — "As a [City] neighbor..." (builds local trust)
5. **Reviews from [City] Customers** — Filtered if possible
6. **Contact CTA** — Book appointment

#### 4. About Page
**URL:** `/about`
Content: Company story, team bios (optional), certifications, values, mission. AI generates draft from onboarding info.

#### 5. Reviews / Testimonials Page
**URL:** `/reviews`
Content: Auto-imported Google reviews (via Google Business Profile API), with schema markup.

#### 6. Gallery / Portfolio
**URL:** `/gallery`
Content: Photo grid of completed projects. Before/after slider. Categorized by service type.

#### 7. Blog
**URL:** `/blog` and `/blog/[slug]`
AI-generated starter posts:
- "How Much Does a New Roof Cost in [City] in 2026?"
- "5 Signs You Need a Roof Replacement"
- "[Material] vs [Material]: Which Roofing Material is Best for [Climate]?"
- "What to Do After Storm Damage to Your Roof"
- "How to Choose a Roofing Contractor in [City]"

Each post is 800-1200 words, includes internal links to service pages, and has proper schema markup.

#### 8. Financing Page
**URL:** `/financing`
Content: Financing options, payment plans. Integration with Wisetack or similar.

#### 9. FAQ Page
**URL:** `/faq`
Content: 15-20 common roofing questions with FAQ schema markup. AI generates based on service type and location.

#### 10. Contact Page
**URL:** `/contact`
Content: Contact form, map embed, phone, email, hours, directions.

---

## Part 3: The Booking Widget (Critical Feature)

This is the "Text Us" equivalent — a persistent floating widget on every page.

### Widget Design

**Floating Bubble (bottom-right corner):**
```
┌──────────────────┐
│  📅 Book Now     │  ← Persistent floating button
└──────────────────┘
```

**Expanded Widget (slides up when clicked):**
```
┌────────────────────────────────────┐
│  Schedule Your Appointment         │
│                                    │
│  ┌──────┐  ┌──────┐  ┌──────┐    │
│  │ 📅   │  │ 💬   │  │ 📞   │    │
│  │Book  │  │Text  │  │Call  │    │
│  │Appt  │  │Us    │  │Us    │    │
│  └──────┘  └──────┘  └──────┘    │
│                                    │
│  Or call: (XXX) XXX-XXXX          │
└────────────────────────────────────┘
```

### Option 1: Book Appointment (Full Flow)

```
Step 1: Select Service
┌────────────────────────────────────┐
│  What do you need help with?       │
│                                    │
│  ○ Roof Inspection                 │
│  ○ Roof Repair                     │
│  ○ Roof Replacement                │
│  ○ Storm Damage Assessment         │
│  ○ Gutter Services                 │
│  ○ Emergency Repair                │
│  ○ Other                           │
│                                    │
│  [Next →]                          │
└────────────────────────────────────┘

Step 2: Your Info
┌────────────────────────────────────┐
│  Tell us about yourself            │
│                                    │
│  Name: [___________________]       │
│  Phone: [___________________]      │
│  Email: [___________________]      │
│  Address: [___________________]    │
│                                    │
│  Brief description of the issue:   │
│  [                              ]  │
│  [                              ]  │
│                                    │
│  📸 Upload photos (optional)       │
│                                    │
│  [Next →]                          │
└────────────────────────────────────┘

Step 3: Select Date & Time
┌────────────────────────────────────┐
│  Pick a time that works            │
│                                    │
│  ◀ March 2026 ▶                    │
│  Mon Tue Wed Thu Fri Sat           │
│      1   2   3   4   5            │
│   7  8   9  10  11  12            │
│  14 15  16  17  18  19            │
│                                    │
│  Available times for Mar 10:       │
│  [9:00 AM] [10:00 AM] [11:00 AM]  │
│  [1:00 PM] [2:00 PM]  [3:00 PM]   │
│                                    │
│  [Book Appointment →]              │
└────────────────────────────────────┘

Step 4: Confirmation
┌────────────────────────────────────┐
│  ✅ Appointment Booked!            │
│                                    │
│  Service: Roof Inspection          │
│  Date: Monday, March 10, 2026     │
│  Time: 10:00 AM                   │
│  Address: 123 Main St, Dallas, TX │
│                                    │
│  We've sent a confirmation to:     │
│  📧 your@email.com                │
│  📱 (555) 123-4567                │
│                                    │
│  Calendar invite attached!         │
│                                    │
│  Questions? Call us at             │
│  (XXX) XXX-XXXX                   │
└────────────────────────────────────┘
```

### Option 2: Text Us
Opens SMS on mobile devices:
```
sms://+1XXXXXXXXXX?body=Hi, I'd like to schedule a roof inspection.
```

On desktop: Shows a form that sends an SMS to the roofer's phone via Twilio.

### Option 3: Call Us
```
tel://+1XXXXXXXXXX
```
Click-to-call on mobile. Shows phone number on desktop.

### Backend for Booking Widget

When an appointment is booked:

1. **Create a Job** in BLDRKit CRM (status: LEAD)
2. **Create a Customer** (or match existing by phone/email)
3. **Send calendar invite (.ics)** to BOTH:
   - Customer's email (with appointment details, company address, what to expect)
   - Roofer's email (with customer info, service requested, photos if uploaded)
4. **Send SMS confirmation** to customer (via Twilio)
5. **Send SMS notification** to roofer ("New appointment: Roof Inspection, Mon 3/10 at 10 AM, John Smith, 123 Main St")
6. **Add to BLDRKit calendar** (shows up in the scheduling view)
7. **Send automated reminder** 24 hours before appointment (email + SMS to customer)

---

## Part 4: SEO Engine (Automatic)

The website builder handles ALL SEO automatically. The roofer never thinks about it.

### Auto-Generated SEO Elements

**For every page:**
- `<title>` tag optimized for target keyword
- `<meta description>` with CTA and location
- `<h1>` matching target keyword
- Open Graph tags (title, description, image)
- Twitter Card tags
- Canonical URL
- XML sitemap (auto-updated)
- robots.txt

**Schema Markup (JSON-LD):**
```json
{
  "@context": "https://schema.org",
  "@type": "RoofingContractor",
  "name": "Company Name",
  "address": { ... },
  "telephone": "+1...",
  "url": "https://...",
  "openingHours": "Mo-Fr 07:00-18:00",
  "areaServed": [...cities...],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "itemListElement": [...services...]
  },
  "aggregateRating": { ... },
  "review": [...]
}
```

Plus per-page:
- **Service pages:** `Service` schema
- **FAQ pages:** `FAQPage` schema
- **Blog posts:** `Article` schema
- **Review pages:** `Review` schema
- **Booking widget:** `ReserveAction` schema

### URL Structure
```
/                                          ← Homepage
/services                                  ← Services index
/services/roof-replacement-[city]-[state]  ← Service page
/services/roof-replacement-[city]-[state]/asphalt-shingle  ← Sub-service
/roofing-contractor-[city]-[state]         ← Service area page
/about                                     ← About
/reviews                                   ← Reviews
/gallery                                   ← Portfolio
/blog                                      ← Blog index
/blog/[slug]                               ← Blog post
/faq                                       ← FAQ
/financing                                 ← Financing
/contact                                   ← Contact
```

### Internal Linking Strategy (Auto-Generated)
- Every service page links to related services
- Every service area page links to all services
- Blog posts link to relevant service pages
- Homepage links to top 6-8 services
- Breadcrumb navigation on all inner pages
- Footer contains links to all services + service areas

---

## Part 5: Content Editor (Post-Launch)

After the initial AI generation, the roofer can edit their site:

### Inline WYSIWYG Editor
- Click any text to edit it
- Drag and drop sections to reorder
- Add/remove sections from a menu
- Upload photos (auto-compressed, auto-alt-text)
- Preview changes before publishing
- Auto-save drafts

### Blog Manager
- AI-assisted blog writing ("Write a post about [topic]")
- Draft → Review → Publish workflow
- Auto-generates meta title/description
- Schedule posts for future publication
- SEO score checker per post

### Photo Gallery Manager
- Upload project photos
- Tag by service type
- Before/after pairing
- Auto-compress and generate thumbnails

### Review Management
- Auto-import Google reviews
- Display/hide specific reviews
- Generate review request links to send to customers
- QR code for in-person review requests

---

## Part 6: Analytics Dashboard (Built-In)

Show the roofer simple, actionable metrics:

- **Website visits** (today, this week, this month)
- **Top pages** (which services get the most traffic)
- **Lead conversions** (appointments booked, forms submitted, calls made)
- **Google ranking** (where they rank for target keywords — if we integrate Search Console)
- **Traffic sources** (Google, direct, referral, social)
- **Device breakdown** (mobile vs desktop)

Keep it simple — roofers don't need Google Analytics complexity.

---

## Part 7: Technical Implementation

### Static Site Generation
Generate sites as static HTML/CSS/JS for maximum speed:
- Use Next.js Static Export or a custom SSG
- Deploy to Cloudflare Pages (fast, free, global CDN)
- Custom domains via Cloudflare DNS (we already control this)
- SSL auto-provisioned

### Template Engine
```typescript
// Template registry
interface WebsiteTemplate {
  id: string;              // "storm-shield"
  name: string;            // "Storm Shield"
  preview: string;         // Screenshot URL
  category: string;        // "bold" | "warm" | "minimal" | "premium"
  
  // Template components
  hero: HeroVariant;
  serviceCard: ServiceCardVariant;
  testimonialSection: TestimonialVariant;
  colorSchemes: ColorScheme[];
  fontPairings: FontPairing[];
}

// Content generation
interface PageContent {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  sections: ContentSection[];
  schema: JsonLdSchema[];
  internalLinks: InternalLink[];
}
```

### AI Content Generation
Use GPT-4o to generate all page content:
- **Input:** Company info, service list, service areas, template choice
- **Output:** Full page content for every page, optimized for target keywords
- **Uniqueness:** Every generated site has unique content (critical for SEO)
- **Tone:** Professional but approachable. Write at 8th-grade reading level.
- **Length:** Service pages: 500-1000 words. Blog posts: 800-1200 words. Service area pages: 400-600 words.

### Booking Widget Embed
The widget is a standalone React component that gets injected into every page:
```html
<script src="https://widget.bldrkit.com/v1/booking.js" 
        data-org-id="org_123" 
        data-theme="dark"
        data-primary-color="#3b82f6">
</script>
```

This keeps the widget independent from the static site — can be updated without rebuilding the site.

### Notification System
- **Twilio** for SMS (customer confirmations, roofer notifications, reminders)
- **Resend/SendGrid** for email (confirmations, calendar invites)
- **Calendar invites (.ics):** Generate ICS files and attach to confirmation emails

```typescript
// Calendar invite generation
function generateICS(appointment: Appointment): string {
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BLDRKit//Booking//EN
BEGIN:VEVENT
DTSTART:${formatICSDate(appointment.startTime)}
DTEND:${formatICSDate(appointment.endTime)}
SUMMARY:${appointment.serviceName} - ${appointment.customerName}
DESCRIPTION:Service: ${appointment.serviceName}\\nCustomer: ${appointment.customerName}\\nPhone: ${appointment.customerPhone}\\nAddress: ${appointment.address}\\nNotes: ${appointment.notes}
LOCATION:${appointment.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}
```

---

## Part 8: Database Models (Add to Existing Schema)

```prisma
// Website configuration
model Website {
  id             String       @id @default(cuid())
  organizationId String       @unique
  organization   Organization @relation(fields: [organizationId], references: [id])
  
  // Template
  templateId     String
  colorScheme    Json?        // {primary, secondary, accent, bg, text}
  fontPairing    Json?        // {heading, body}
  
  // Domain
  subdomain      String?      @unique  // "acme-roofing" → acme-roofing.bldrkit.com
  customDomain   String?      @unique  // "www.acmeroofing.com"
  
  // SEO
  googleAnalyticsId  String?
  searchConsoleVerif String?
  
  // Content
  companyTagline String?
  companyStory   String?      @db.Text
  
  // Status
  published      Boolean      @default(false)
  lastPublished  DateTime?
  lastEdited     DateTime?
  
  // Relations
  pages          WebsitePage[]
  
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model WebsitePage {
  id          String  @id @default(cuid())
  websiteId   String
  website     Website @relation(fields: [websiteId], references: [id])
  
  slug        String          // "/services/roof-replacement-dallas-tx"
  pageType    WebsitePageType
  title       String
  metaTitle   String
  metaDescription String
  h1          String
  content     Json            // Structured content blocks
  schema      Json?           // JSON-LD schema
  published   Boolean         @default(true)
  sortOrder   Int             @default(0)
  
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  
  @@unique([websiteId, slug])
}

enum WebsitePageType {
  HOME
  SERVICE
  SUB_SERVICE
  SERVICE_AREA
  ABOUT
  REVIEWS
  GALLERY
  BLOG
  BLOG_POST
  FAQ
  FINANCING
  CONTACT
  CUSTOM
}

// Appointments booked via widget
model Appointment {
  id             String       @id @default(cuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  
  // Customer info
  customerName   String
  customerPhone  String
  customerEmail  String?
  customerAddress String?
  
  // Appointment details
  serviceRequested String
  scheduledDate    DateTime
  scheduledTime    String      // "10:00 AM"
  duration         Int         @default(60)  // minutes
  notes            String?
  photos           String[]    // URLs to uploaded photos
  
  // Status
  status           AppointmentStatus @default(PENDING)
  confirmedAt      DateTime?
  cancelledAt      DateTime?
  completedAt      DateTime?
  
  // Notifications
  customerConfirmationSent Boolean @default(false)
  rooferNotificationSent   Boolean @default(false)
  reminderSent             Boolean @default(false)
  calendarInviteSent       Boolean @default(false)
  
  // Link to CRM
  jobId            String?     // Auto-created Job in CRM
  customerId       String?     // Auto-created or matched Customer
  
  // Source tracking
  source           String?     // "widget", "phone", "text", "form"
  pageUrl          String?     // Which page the booking was made from
  
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  CANCELLED
  RESCHEDULED
  COMPLETED
  NO_SHOW
}
```

---

## Definition of Done

1. ✅ Onboarding flow works end-to-end (company info → services → areas → template → AI generates → publish)
2. ✅ AI generates unique, SEO-optimized content for ALL pages
3. ✅ All page types render properly (homepage, service pages, service area pages, about, reviews, gallery, blog, FAQ, financing, contact)
4. ✅ Booking widget works on all pages with full appointment flow
5. ✅ Calendar invites (.ics) sent to both customer and roofer
6. ✅ SMS confirmations sent (or mocked if no Twilio key)
7. ✅ Schema markup (JSON-LD) on every page
8. ✅ XML sitemap auto-generated
9. ✅ Mobile responsive (test on mobile viewport)
10. ✅ Inline content editor works (click to edit, save)
11. ✅ All service/sub-service/service area pages follow URL patterns
12. ✅ Internal linking is comprehensive and automatic
13. ✅ `npm run build` passes with zero errors
14. ✅ Booking creates a Job + Customer in the CRM

---

## Key Roofing Services to Pre-Build Content For

These are the services that need pre-built SEO-optimized content templates:

### Core Services (generate 500-1000 word pages)
1. Roof Replacement
2. Roof Repair
3. Emergency Roof Repair / Leak Repair
4. Roof Inspection
5. Storm Damage Repair
6. Insurance Claim Assistance / Supplementing

### Material-Specific Services (generate sub-pages)
7. Asphalt Shingle Roofing
8. Metal Roofing (standing seam, corrugated, metal shingles)
9. Tile Roofing (clay, concrete)
10. Flat Roofing (TPO, EPDM, PVC, modified bitumen)
11. Cedar Shake Roofing
12. Slate Roofing
13. Synthetic / Composite Roofing

### Additional Services
14. Gutter Installation & Repair
15. Siding Installation & Repair
16. Skylight Installation & Repair
17. Attic Insulation & Ventilation
18. Chimney Repair & Flashing
19. Commercial Roofing
20. New Construction Roofing

### Target Keywords Per Service (for AI content generation)
- "[Service] in [City] [State]"
- "[Service] near me"
- "[Service] cost"
- "Best [service] company in [City]"
- "How much does [service] cost"
- "[Material] roofing contractor [City]"
- "Affordable [service] in [City]"
- "Licensed [service] company [City]"

---

## Future Enhancements (Not for Initial Build)

- Google Business Profile sync (auto-import reviews, auto-update hours)
- Google Search Console integration (track rankings)
- A/B testing on CTAs
- AI chatbot on site (answer roofing questions, qualify leads)
- Multi-language support (Spanish — huge for roofing labor market)
- Subcontractor referral pages
- Supplier partnership pages
- Video testimonials
- Virtual roof inspection booking (video call)
