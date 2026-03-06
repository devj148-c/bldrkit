import { MemberRole } from '@prisma/client'

export type Permission =
  | 'org:manage'
  | 'org:billing'
  | 'members:manage'
  | 'members:view'
  | 'modules:manage'
  | 'customers:create'
  | 'customers:edit'
  | 'customers:delete'
  | 'customers:view'
  | 'jobs:create'
  | 'jobs:edit'
  | 'jobs:delete'
  | 'jobs:view'
  | 'jobs:assign'
  | 'estimates:create'
  | 'estimates:edit'
  | 'estimates:delete'
  | 'estimates:view'
  | 'estimates:send'
  | 'invoices:create'
  | 'invoices:edit'
  | 'invoices:delete'
  | 'invoices:view'
  | 'invoices:send'
  | 'schedule:view'
  | 'schedule:manage'
  | 'settings:view'
  | 'settings:manage'

const ROLE_PERMISSIONS: Record<MemberRole, Permission[]> = {
  ADMIN: [
    'org:manage', 'org:billing', 'members:manage', 'members:view', 'modules:manage',
    'customers:create', 'customers:edit', 'customers:delete', 'customers:view',
    'jobs:create', 'jobs:edit', 'jobs:delete', 'jobs:view', 'jobs:assign',
    'estimates:create', 'estimates:edit', 'estimates:delete', 'estimates:view', 'estimates:send',
    'invoices:create', 'invoices:edit', 'invoices:delete', 'invoices:view', 'invoices:send',
    'schedule:view', 'schedule:manage', 'settings:view', 'settings:manage',
  ],
  MODULE_MANAGER: [
    'members:view',
    'customers:create', 'customers:edit', 'customers:view',
    'jobs:create', 'jobs:edit', 'jobs:view', 'jobs:assign',
    'estimates:create', 'estimates:edit', 'estimates:view', 'estimates:send',
    'invoices:create', 'invoices:edit', 'invoices:view', 'invoices:send',
    'schedule:view', 'schedule:manage', 'settings:view',
  ],
  MEMBER: [
    'customers:view',
    'jobs:view',
    'estimates:view',
    'invoices:view',
    'schedule:view',
    'settings:view',
  ],
}

export function hasPermission(role: MemberRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function getPermissions(role: MemberRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}
