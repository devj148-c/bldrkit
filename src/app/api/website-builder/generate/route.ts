import { NextResponse } from "next/server"

// Mock content generation — no AI calls, just realistic placeholder content
function generateMockPages(data: {
  companyName: string
  city: string
  state: string
  services: string[]
  primaryCity: string
  additionalCities: string
  templateId: string
  phone: string
  email: string
}) {
  const pages = []
  const city = data.primaryCity || data.city
  const state = data.state

  // Homepage
  pages.push({
    id: crypto.randomUUID(),
    slug: "/",
    pageType: "HOME",
    title: `${data.companyName} - Roofing Contractor in ${city}, ${state}`,
    metaTitle: `${data.companyName} | Professional Roofing in ${city}, ${state}`,
    metaDescription: `${data.companyName} provides expert roofing services in ${city}, ${state}. Licensed & insured. Free estimates. Call today!`,
    h1: `${city}'s Trusted Roofing Experts`,
    content: [
      {
        id: crypto.randomUUID(),
        type: "hero",
        data: {
          heading: `Professional Roofing Services in ${city}, ${state}`,
          subheading: `Trusted by homeowners across ${city} for quality roofing. Licensed, insured, and committed to excellence.`,
          buttonText: "Get Free Estimate",
        },
      },
      {
        id: crypto.randomUUID(),
        type: "services-grid",
        data: {
          heading: "Our Services",
          services: data.services.slice(0, 8),
        },
      },
      {
        id: crypto.randomUUID(),
        type: "text",
        data: {
          heading: `Why Choose ${data.companyName}?`,
          body: `With years of experience serving ${city} and surrounding areas, we deliver top-quality roofing solutions. Our licensed team uses premium materials and stands behind every project with comprehensive warranties.`,
        },
      },
      {
        id: crypto.randomUUID(),
        type: "testimonials",
        data: {
          heading: "What Our Customers Say",
          testimonials: [
            `Best roofing company in ${city}! They replaced our entire roof in just two days. Professional, clean, and the price was fair.`,
            "From the initial inspection to the final cleanup, everything was handled perfectly. Highly recommend!",
            "They helped us navigate the insurance claim process and made it stress-free. Our new roof looks amazing.",
          ],
        },
      },
      {
        id: crypto.randomUUID(),
        type: "cta",
        data: {
          heading: "Ready to Get Started?",
          body: `Contact ${data.companyName} today for a free, no-obligation roofing estimate. We serve ${city} and surrounding areas.`,
          buttonText: "Schedule Free Inspection",
        },
      },
    ],
    published: true,
    updatedAt: new Date().toISOString(),
  })

  // Service pages
  for (const service of data.services) {
    const slug = `/services/${service.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${city.toLowerCase()}-${state.toLowerCase()}`
    pages.push({
      id: crypto.randomUUID(),
      slug,
      pageType: "SERVICE",
      title: `${service} in ${city}, ${state}`,
      metaTitle: `${service} in ${city}, ${state} | ${data.companyName}`,
      metaDescription: `Professional ${service.toLowerCase()} services in ${city}, ${state}. ${data.companyName} - licensed, insured, free estimates. Call today!`,
      h1: `${service} in ${city}, ${state}`,
      content: [
        {
          id: crypto.randomUUID(),
          type: "hero",
          data: {
            heading: `Expert ${service} in ${city}`,
            subheading: `${data.companyName} provides professional ${service.toLowerCase()} services to homeowners and businesses across ${city}, ${state}.`,
            buttonText: "Get Free Estimate",
          },
        },
        {
          id: crypto.randomUUID(),
          type: "text",
          data: {
            heading: `About Our ${service} Services`,
            body: `At ${data.companyName}, we specialize in delivering high-quality ${service.toLowerCase()} solutions tailored to the unique needs of ${city} properties. Our experienced team uses industry-leading techniques and premium materials to ensure lasting results.\n\nWhether you need a complete service or a targeted repair, we provide transparent pricing, detailed assessments, and workmanship warranties on every project.`,
          },
        },
        {
          id: crypto.randomUUID(),
          type: "faq",
          data: {
            heading: `${service} FAQ`,
            questions: [
              `How much does ${service.toLowerCase()} cost in ${city}?`,
              `How long does ${service.toLowerCase()} take?`,
              `Do you offer warranties on ${service.toLowerCase()}?`,
            ],
          },
        },
        {
          id: crypto.randomUUID(),
          type: "cta",
          data: {
            heading: `Need ${service}?`,
            body: `Contact us today for a free estimate on ${service.toLowerCase()} in ${city}, ${state}.`,
            buttonText: "Request Free Estimate",
          },
        },
      ],
      published: true,
      updatedAt: new Date().toISOString(),
    })
  }

  // Service area pages
  const additionalCities = data.additionalCities
    ? data.additionalCities.split(",").map((c: string) => c.trim()).filter(Boolean)
    : []

  for (const areaCity of additionalCities) {
    const slug = `/roofing-contractor-${areaCity.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${state.toLowerCase()}`
    pages.push({
      id: crypto.randomUUID(),
      slug,
      pageType: "SERVICE_AREA",
      title: `Roofing Contractor in ${areaCity}, ${state}`,
      metaTitle: `Roofing Contractor in ${areaCity}, ${state} | ${data.companyName}`,
      metaDescription: `${data.companyName} is your trusted roofing contractor in ${areaCity}, ${state}. Full-service residential & commercial roofing. Free estimates!`,
      h1: `Trusted Roofing Contractor in ${areaCity}, ${state}`,
      content: [
        {
          id: crypto.randomUUID(),
          type: "hero",
          data: {
            heading: `Your Local Roofer in ${areaCity}`,
            subheading: `${data.companyName} proudly serves ${areaCity} and surrounding communities with expert roofing services.`,
            buttonText: "Get Free Estimate",
          },
        },
        {
          id: crypto.randomUUID(),
          type: "text",
          data: {
            heading: `Roofing Services in ${areaCity}`,
            body: `As a locally-owned roofing company, we understand the unique weather challenges and building codes in ${areaCity}. From storm damage repairs to complete roof replacements, our team delivers reliable results backed by comprehensive warranties.`,
          },
        },
        {
          id: crypto.randomUUID(),
          type: "services-grid",
          data: {
            heading: `Services Available in ${areaCity}`,
            services: data.services,
          },
        },
      ],
      published: true,
      updatedAt: new Date().toISOString(),
    })
  }

  // About page
  pages.push({
    id: crypto.randomUUID(),
    slug: "/about",
    pageType: "ABOUT",
    title: `About ${data.companyName}`,
    metaTitle: `About ${data.companyName} | Roofing Company in ${city}, ${state}`,
    metaDescription: `Learn about ${data.companyName}, a trusted roofing company serving ${city}, ${state} and surrounding areas.`,
    h1: `About ${data.companyName}`,
    content: [
      {
        id: crypto.randomUUID(),
        type: "text",
        data: {
          heading: "Our Story",
          body: `${data.companyName} was founded with a simple mission: to provide ${city} homeowners with honest, high-quality roofing services at fair prices. We believe every home deserves a roof that protects, performs, and looks great.\n\nOur team of licensed professionals brings decades of combined experience to every project, from routine inspections to complex replacements.`,
        },
      },
    ],
    published: true,
    updatedAt: new Date().toISOString(),
  })

  // FAQ page
  pages.push({
    id: crypto.randomUUID(),
    slug: "/faq",
    pageType: "FAQ",
    title: "Frequently Asked Questions",
    metaTitle: `Roofing FAQ | ${data.companyName} - ${city}, ${state}`,
    metaDescription: `Common roofing questions answered by ${data.companyName}. Learn about costs, timelines, materials, and more.`,
    h1: "Frequently Asked Questions",
    content: [
      {
        id: crypto.randomUUID(),
        type: "faq",
        data: {
          heading: "Common Roofing Questions",
          questions: [
            `How much does a new roof cost in ${city}?`,
            "How long does a roof replacement take?",
            "Do I need a permit for roofing work?",
            "What roofing material is best for my home?",
            "Does my homeowner's insurance cover roof damage?",
            "How often should I have my roof inspected?",
            "What are signs I need a new roof?",
            "Do you offer financing options?",
            "Are you licensed and insured?",
            `What areas do you serve near ${city}?`,
          ],
        },
      },
    ],
    published: true,
    updatedAt: new Date().toISOString(),
  })

  // Contact page
  pages.push({
    id: crypto.randomUUID(),
    slug: "/contact",
    pageType: "CONTACT",
    title: `Contact ${data.companyName}`,
    metaTitle: `Contact Us | ${data.companyName} - ${city}, ${state}`,
    metaDescription: `Contact ${data.companyName} for a free roofing estimate in ${city}, ${state}. Call ${data.phone} or schedule online.`,
    h1: `Contact ${data.companyName}`,
    content: [
      {
        id: crypto.randomUUID(),
        type: "text",
        data: {
          heading: "Get In Touch",
          body: `Ready to discuss your roofing project? We're here to help. Give us a call, send us a message, or book an appointment online.\n\nPhone: ${data.phone}\nEmail: ${data.email}`,
        },
      },
      {
        id: crypto.randomUUID(),
        type: "cta",
        data: {
          heading: "Schedule a Free Estimate",
          body: "Fill out our booking form or give us a call. We typically respond within 1 business hour.",
          buttonText: "Book Now",
        },
      },
    ],
    published: true,
    updatedAt: new Date().toISOString(),
  })

  // Gallery page
  pages.push({
    id: crypto.randomUUID(),
    slug: "/gallery",
    pageType: "GALLERY",
    title: "Our Work",
    metaTitle: `Roofing Portfolio | ${data.companyName} - ${city}, ${state}`,
    metaDescription: `See our completed roofing projects in ${city}, ${state}. Before & after photos of roof replacements, repairs, and more.`,
    h1: "Our Work",
    content: [
      {
        id: crypto.randomUUID(),
        type: "gallery",
        data: {
          heading: "Recent Projects",
        },
      },
    ],
    published: true,
    updatedAt: new Date().toISOString(),
  })

  return pages
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      companyName,
      phone,
      email,
      address,
      city,
      state,
      zip,
      yearsInBusiness,
      licenseNumber,
      insuranceInfo,
      services,
      primaryCity,
      additionalCities,
      serviceRadius,
      templateId,
    } = body

    if (!companyName || !services?.length) {
      return NextResponse.json({ error: "Company name and services required" }, { status: 400 })
    }

    const pages = generateMockPages({
      companyName,
      city,
      state,
      services,
      primaryCity,
      additionalCities: additionalCities || "",
      templateId,
      phone,
      email,
    })

    const website = {
      id: crypto.randomUUID(),
      templateId: templateId || "modern-pro",
      published: false,
      subdomain: companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      customDomain: null,
      companyTagline: `Professional Roofing in ${primaryCity || city}, ${state}`,
      lastPublished: null,
      lastEdited: new Date().toISOString(),
      companyPhone: phone,
      companyEmail: email,
      companyAddress: address,
      companyCity: city,
      companyState: state,
      companyZip: zip,
      yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness) : null,
      licenseNumber,
      insuranceInfo,
      services,
      primaryCity: primaryCity || city,
      additionalCities: additionalCities || "",
      serviceRadius: serviceRadius ? parseInt(serviceRadius) : 25,
      pages,
    }

    return NextResponse.json(website, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to generate website" }, { status: 500 })
  }
}
