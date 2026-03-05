import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaLibSql({ url: "file:" + dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("demo1234", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@roofos.com" },
    update: {},
    create: {
      email: "demo@roofos.com",
      password: hashedPassword,
      businessName: "Summit Roofing Co.",
      phone: "(555) 123-4567",
    },
  });

  console.log("Created demo user:", user.email);

  const leads = [
    {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 234-5678",
      address: "123 Oak Street, Austin, TX 78701",
      status: "new",
      jobType: "replacement",
      source: "quote_tool",
      estimatedValue: 12500,
      roofArea: 2200,
      materialPref: "asphalt",
      userId: user.id,
    },
    {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "(555) 345-6789",
      address: "456 Maple Ave, Austin, TX 78702",
      status: "contacted",
      jobType: "repair",
      source: "website",
      estimatedValue: 3500,
      roofArea: 800,
      materialPref: "asphalt",
      userId: user.id,
    },
    {
      name: "Mike Davis",
      email: "mike.d@email.com",
      phone: "(555) 456-7890",
      address: "789 Pine Blvd, Round Rock, TX 78664",
      status: "quoted",
      jobType: "replacement",
      source: "manual",
      estimatedValue: 28000,
      roofArea: 3200,
      materialPref: "metal",
      userId: user.id,
    },
    {
      name: "Emily Chen",
      email: "emily.chen@email.com",
      phone: "(555) 567-8901",
      address: "321 Cedar Lane, Georgetown, TX 78626",
      status: "negotiating",
      jobType: "storm",
      source: "quote_tool",
      estimatedValue: 18000,
      roofArea: 2800,
      materialPref: "tile",
      userId: user.id,
    },
    {
      name: "Robert Wilson",
      email: "rwilson@email.com",
      phone: "(555) 678-9012",
      address: "654 Birch Court, Pflugerville, TX 78660",
      status: "won",
      jobType: "inspection",
      source: "website",
      estimatedValue: 500,
      roofArea: 1900,
      materialPref: "asphalt",
      userId: user.id,
    },
  ];

  for (const lead of leads) {
    const created = await prisma.lead.create({ data: lead });
    console.log("Created lead:", created.name);

    await prisma.note.create({
      data: {
        content: `Initial contact — ${lead.source === "quote_tool" ? "submitted via quote tool" : lead.source === "website" ? "came through website form" : "added manually"}`,
        leadId: created.id,
      },
    });
  }

  const allLeads = await prisma.lead.findMany({
    where: { userId: user.id },
  });

  await prisma.quote.create({
    data: {
      address: "123 Oak Street, Austin, TX 78701",
      roofAreaSqFt: 2200,
      materialType: "asphalt",
      priceMin: 7700,
      priceMax: 12100,
      leadName: "John Smith",
      leadEmail: "john.smith@email.com",
      leadPhone: "(555) 234-5678",
      leadId: allLeads[0].id,
      userId: user.id,
    },
  });

  await prisma.quote.create({
    data: {
      address: "789 Pine Blvd, Round Rock, TX 78664",
      roofAreaSqFt: 3200,
      materialType: "metal",
      priceMin: 22400,
      priceMax: 38400,
      leadName: "Mike Davis",
      leadEmail: "mike.d@email.com",
      leadPhone: "(555) 456-7890",
      leadId: allLeads[2].id,
      userId: user.id,
    },
  });

  console.log("Created 2 quotes");

  await prisma.website.create({
    data: {
      template: "modern",
      businessName: "Summit Roofing Co.",
      phone: "(555) 123-4567",
      email: "info@summitroofing.com",
      aboutText:
        "Summit Roofing Co. has been serving the Austin area for over 15 years. We specialize in residential and commercial roofing solutions, providing top-quality craftsmanship and exceptional customer service.",
      services: JSON.stringify([
        "roof_replacement",
        "repair",
        "inspection",
        "storm_damage",
      ]),
      serviceAreas: JSON.stringify(["Austin", "Round Rock", "Georgetown", "Pflugerville", "Cedar Park"]),
      testimonials: JSON.stringify([
        {
          name: "James T.",
          text: "Summit Roofing replaced our entire roof after a hailstorm. Professional, fast, and the price was fair. Highly recommend!",
          rating: 5,
        },
        {
          name: "Maria G.",
          text: "Great experience from start to finish. The team was courteous and left our property spotless.",
          rating: 5,
        },
      ]),
      photos: JSON.stringify([]),
      published: false,
      userId: user.id,
    },
  });

  console.log("Created demo website config");
  console.log("\nSeed complete! Login with: demo@roofos.com / demo1234");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
