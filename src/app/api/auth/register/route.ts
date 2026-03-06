import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/utils"

export async function POST(req: Request) {
  try {
    const { name, email, password, orgName, orgPhone, trades } = await req.json()

    if (!name || !email || !password || !orgName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Generate unique slug
    let slug = slugify(orgName)
    const slugExists = await prisma.organization.findUnique({ where: { slug } })
    if (slugExists) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    // Create user, org, membership, and modules in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          emailVerified: new Date(),
        },
      })

      const org = await tx.organization.create({
        data: {
          name: orgName,
          slug,
          phone: orgPhone || null,
        },
      })

      await tx.organizationMember.create({
        data: {
          userId: user.id,
          organizationId: org.id,
          role: "ADMIN",
          acceptedAt: new Date(),
        },
      })

      // Enable selected trade modules
      if (trades?.length) {
        await tx.organizationModule.createMany({
          data: trades.map((moduleKey: string) => ({
            organizationId: org.id,
            moduleKey,
          })),
        })
      }

      return { user, org }
    })

    return NextResponse.json({
      message: "Account created",
      userId: result.user.id,
      orgId: result.org.id,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
