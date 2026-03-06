import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.jobNote.deleteMany()
  await prisma.photo.deleteMany()
  await prisma.estimate.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.job.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.moduleRole.deleteMany()
  await prisma.organizationMember.deleteMany()
  await prisma.organizationModule.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  // Create demo users
  const passwordHash = await bcrypt.hash('password123', 12)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      name: 'Mike Johnson',
      passwordHash,
      emailVerified: new Date(),
    },
  })

  const manager = await prisma.user.create({
    data: {
      email: 'manager@demo.com',
      name: 'Sarah Williams',
      passwordHash,
      emailVerified: new Date(),
    },
  })

  const member = await prisma.user.create({
    data: {
      email: 'tech@demo.com',
      name: 'Carlos Rivera',
      passwordHash,
      emailVerified: new Date(),
    },
  })

  console.log('✅ Users created')

  // Create organization
  const org = await prisma.organization.create({
    data: {
      name: 'Summit Roofing & Siding',
      slug: 'summit-roofing',
      email: 'info@summitroofing.com',
      phone: '(555) 123-4567',
      address: '456 Trade Center Blvd',
      city: 'Denver',
      state: 'CO',
      zip: '80202',
    },
  })

  console.log('✅ Organization created')

  // Add modules
  await prisma.organizationModule.createMany({
    data: [
      { organizationId: org.id, moduleKey: 'roofing' },
      { organizationId: org.id, moduleKey: 'general' },
    ],
  })

  // Add memberships
  const adminMember = await prisma.organizationMember.create({
    data: {
      userId: admin.id,
      organizationId: org.id,
      role: 'ADMIN',
      acceptedAt: new Date(),
    },
  })

  const managerMember = await prisma.organizationMember.create({
    data: {
      userId: manager.id,
      organizationId: org.id,
      role: 'MODULE_MANAGER',
      acceptedAt: new Date(),
    },
  })

  await prisma.moduleRole.create({
    data: {
      organizationMemberId: managerMember.id,
      moduleKey: 'roofing',
      role: 'estimator',
    },
  })

  const memberMember = await prisma.organizationMember.create({
    data: {
      userId: member.id,
      organizationId: org.id,
      role: 'MEMBER',
      acceptedAt: new Date(),
    },
  })

  await prisma.moduleRole.create({
    data: {
      organizationMemberId: memberMember.id,
      moduleKey: 'roofing',
      role: 'installer',
    },
  })

  console.log('✅ Team members added')

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        organizationId: org.id,
        firstName: 'Robert',
        lastName: 'Thompson',
        email: 'robert.t@email.com',
        phone: '(555) 234-5678',
        address: '123 Oak Street',
        city: 'Denver',
        state: 'CO',
        zip: '80201',
        source: 'referral',
        tags: ['residential', 'vip'],
      },
    }),
    prisma.customer.create({
      data: {
        organizationId: org.id,
        firstName: 'Lisa',
        lastName: 'Chen',
        email: 'lisa.chen@email.com',
        phone: '(555) 345-6789',
        address: '456 Maple Ave',
        city: 'Aurora',
        state: 'CO',
        zip: '80010',
        source: 'website',
        tags: ['residential'],
      },
    }),
    prisma.customer.create({
      data: {
        organizationId: org.id,
        firstName: 'David',
        lastName: 'Martinez',
        email: 'david.m@email.com',
        phone: '(555) 456-7890',
        address: '789 Pine Road',
        city: 'Lakewood',
        state: 'CO',
        zip: '80226',
        source: 'angi',
        tags: ['commercial'],
      },
    }),
    prisma.customer.create({
      data: {
        organizationId: org.id,
        firstName: 'Jennifer',
        lastName: 'Park',
        email: 'jen.park@email.com',
        phone: '(555) 567-8901',
        address: '321 Elm Court',
        city: 'Arvada',
        state: 'CO',
        zip: '80002',
        source: 'thumbtack',
        tags: ['residential', 'storm-damage'],
      },
    }),
    prisma.customer.create({
      data: {
        organizationId: org.id,
        firstName: 'James',
        lastName: 'Wilson',
        email: 'j.wilson@email.com',
        phone: '(555) 678-9012',
        address: '654 Birch Lane',
        city: 'Littleton',
        state: 'CO',
        zip: '80120',
        source: 'referral',
        tags: ['residential'],
      },
    }),
  ])

  console.log('✅ Customers created')

  // Create jobs
  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 86400000)
  const twoDays = new Date(now.getTime() + 2 * 86400000)
  const yesterday = new Date(now.getTime() - 86400000)

  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        organizationId: org.id,
        customerId: customers[0].id,
        title: 'Full Roof Replacement — Asphalt Shingles',
        description: 'Complete tear-off and replacement of 30-year architectural shingles. Customer wants Owens Corning Duration in Driftwood.',
        moduleKey: 'roofing',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        estimatedValue: 18500,
        jobAddress: '123 Oak Street',
        jobCity: 'Denver',
        jobState: 'CO',
        jobZip: '80201',
        scheduledStart: yesterday,
        scheduledEnd: twoDays,
        assignedTo: [member.id],
      },
    }),
    prisma.job.create({
      data: {
        organizationId: org.id,
        customerId: customers[1].id,
        title: 'Storm Damage Inspection',
        description: 'Hail damage inspection after recent storm. Assess damage for insurance claim.',
        moduleKey: 'roofing',
        status: 'SCHEDULED',
        priority: 'MEDIUM',
        jobAddress: '456 Maple Ave',
        jobCity: 'Aurora',
        jobState: 'CO',
        jobZip: '80010',
        scheduledStart: twoDays,
      },
    }),
    prisma.job.create({
      data: {
        organizationId: org.id,
        customerId: customers[2].id,
        title: 'Commercial Flat Roof Repair',
        description: 'TPO membrane repair on 5,000 sq ft commercial building. Multiple leak points.',
        moduleKey: 'roofing',
        status: 'QUOTED',
        priority: 'HIGH',
        estimatedValue: 12000,
        jobAddress: '789 Pine Road',
        jobCity: 'Lakewood',
        jobState: 'CO',
        jobZip: '80226',
      },
    }),
    prisma.job.create({
      data: {
        organizationId: org.id,
        customerId: customers[3].id,
        title: 'Insurance Claim — Wind Damage',
        description: 'Wind damage to ridge caps and edge flashing. Insurance adjuster meeting scheduled.',
        moduleKey: 'roofing',
        status: 'LEAD',
        priority: 'MEDIUM',
        estimatedValue: 8500,
        jobAddress: '321 Elm Court',
        jobCity: 'Arvada',
        jobState: 'CO',
        jobZip: '80002',
      },
    }),
    prisma.job.create({
      data: {
        organizationId: org.id,
        customerId: customers[4].id,
        title: 'Gutter Installation & Siding Repair',
        description: 'Install new seamless gutters and repair damaged vinyl siding on south wall.',
        moduleKey: 'general',
        status: 'SCHEDULED',
        priority: 'LOW',
        estimatedValue: 4200,
        jobAddress: '654 Birch Lane',
        jobCity: 'Littleton',
        jobState: 'CO',
        jobZip: '80120',
        scheduledStart: nextWeek,
      },
    }),
    prisma.job.create({
      data: {
        organizationId: org.id,
        customerId: customers[0].id,
        title: 'Skylight Installation',
        description: 'Install two Velux skylights during roof replacement.',
        moduleKey: 'roofing',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        estimatedValue: 3200,
        completedAt: new Date(now.getTime() - 14 * 86400000),
      },
    }),
  ])

  console.log('✅ Jobs created')

  // Create estimates
  await prisma.estimate.create({
    data: {
      organizationId: org.id,
      customerId: customers[0].id,
      jobId: jobs[0].id,
      estimateNumber: 'EST-0001',
      status: 'ACCEPTED',
      lineItems: [
        { id: '1', description: 'Tear-off existing shingles (28 sq)', quantity: 28, unitPrice: 75, total: 2100 },
        { id: '2', description: 'OC Duration Shingles — Driftwood', quantity: 28, unitPrice: 350, total: 9800 },
        { id: '3', description: 'Synthetic underlayment', quantity: 28, unitPrice: 45, total: 1260 },
        { id: '4', description: 'Ice & water shield (valleys/eaves)', quantity: 8, unitPrice: 65, total: 520 },
        { id: '5', description: 'Ridge vent installation', quantity: 1, unitPrice: 1200, total: 1200 },
        { id: '6', description: 'Drip edge & flashing', quantity: 1, unitPrice: 800, total: 800 },
        { id: '7', description: 'Dump fees & cleanup', quantity: 1, unitPrice: 600, total: 600 },
      ],
      subtotal: 16280,
      tax: 0,
      total: 16280,
      acceptedAt: new Date(now.getTime() - 7 * 86400000),
    },
  })

  await prisma.estimate.create({
    data: {
      organizationId: org.id,
      customerId: customers[2].id,
      jobId: jobs[2].id,
      estimateNumber: 'EST-0002',
      status: 'SENT',
      lineItems: [
        { id: '1', description: 'TPO membrane repair (500 sq ft)', quantity: 500, unitPrice: 12, total: 6000 },
        { id: '2', description: 'Seam welding & flashing', quantity: 1, unitPrice: 3000, total: 3000 },
        { id: '3', description: 'Drain repair', quantity: 2, unitPrice: 750, total: 1500 },
      ],
      subtotal: 10500,
      tax: 0,
      total: 10500,
      sentAt: new Date(now.getTime() - 2 * 86400000),
    },
  })

  console.log('✅ Estimates created')

  // Create invoices
  await prisma.invoice.create({
    data: {
      organizationId: org.id,
      customerId: customers[0].id,
      jobId: jobs[5].id,
      invoiceNumber: 'INV-0001',
      status: 'PAID',
      lineItems: [
        { id: '1', description: 'Velux skylight (2x)', quantity: 2, unitPrice: 1200, total: 2400 },
        { id: '2', description: 'Installation labor', quantity: 1, unitPrice: 800, total: 800 },
      ],
      subtotal: 3200,
      tax: 0,
      total: 3200,
      amountPaid: 3200,
      paidAt: new Date(now.getTime() - 10 * 86400000),
    },
  })

  await prisma.invoice.create({
    data: {
      organizationId: org.id,
      customerId: customers[0].id,
      jobId: jobs[0].id,
      invoiceNumber: 'INV-0002',
      status: 'SENT',
      lineItems: [
        { id: '1', description: 'Roof replacement — deposit (50%)', quantity: 1, unitPrice: 8140, total: 8140 },
      ],
      subtotal: 8140,
      tax: 0,
      total: 8140,
      amountPaid: 0,
      dueDate: twoDays,
      sentAt: new Date(now.getTime() - 3 * 86400000),
    },
  })

  console.log('✅ Invoices created')

  // Add job notes
  await prisma.jobNote.createMany({
    data: [
      {
        jobId: jobs[0].id,
        userId: admin.id,
        content: 'Customer confirmed Owens Corning Duration in Driftwood color.',
        type: 'note',
      },
      {
        jobId: jobs[0].id,
        userId: member.id,
        content: 'Tear-off completed. Decking looks good, minor repair needed on south side.',
        type: 'note',
      },
      {
        jobId: jobs[0].id,
        userId: admin.id,
        content: 'Status changed to In Progress',
        type: 'status_change',
      },
    ],
  })

  console.log('✅ Job notes added')
  console.log('')
  console.log('🎉 Seed complete!')
  console.log('')
  console.log('Demo accounts:')
  console.log('  Admin:   admin@demo.com / password123')
  console.log('  Manager: manager@demo.com / password123')
  console.log('  Member:  tech@demo.com / password123')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
