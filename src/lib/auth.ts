import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { MemberRole } from '@prisma/client'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user || !user.passwordHash) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string

        // Get org membership
        const membership = await prisma.organizationMember.findFirst({
          where: { userId: token.id as string, acceptedAt: { not: null } },
          include: { organization: true, moduleRoles: true },
          orderBy: { invitedAt: 'desc' },
        })

        if (membership) {
          (session as SessionWithOrg).orgId = membership.organizationId;
          (session as SessionWithOrg).orgName = membership.organization.name;
          (session as SessionWithOrg).orgSlug = membership.organization.slug;
          (session as SessionWithOrg).role = membership.role;
          (session as SessionWithOrg).moduleRoles = membership.moduleRoles.map(
            (mr) => ({ moduleKey: mr.moduleKey, role: mr.role })
          )
        }
      }
      return session
    },
  },
})

export interface SessionWithOrg {
  user: { id: string; email: string; name?: string | null; image?: string | null }
  orgId: string
  orgName: string
  orgSlug: string
  role: MemberRole
  moduleRoles: { moduleKey: string; role: string }[]
  expires: string
}

export async function getSessionWithOrg(): Promise<SessionWithOrg | null> {
  const session = await auth()
  if (!session?.user?.id) return null
  return session as unknown as SessionWithOrg
}
