import type { MemberRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
    orgId?: string
    orgName?: string
    orgSlug?: string
    role?: MemberRole
    moduleRoles?: { moduleKey: string; role: string }[]
  }
}

export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface JobStatusColumn {
  id: string
  title: string
  color: string
}

export const JOB_STATUS_COLUMNS: JobStatusColumn[] = [
  { id: 'LEAD', title: 'Leads', color: 'bg-gray-500' },
  { id: 'QUOTED', title: 'Quoted', color: 'bg-blue-500' },
  { id: 'SCHEDULED', title: 'Scheduled', color: 'bg-yellow-500' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-orange-500' },
  { id: 'COMPLETED', title: 'Completed', color: 'bg-green-500' },
  { id: 'ON_HOLD', title: 'On Hold', color: 'bg-red-500' },
]
