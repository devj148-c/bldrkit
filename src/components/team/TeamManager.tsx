"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table"
import { Plus, UserPlus, Shield, ShieldCheck, User } from "lucide-react"
import { MODULE_REGISTRY } from "@/lib/modules/registry"

interface Member {
  id: string
  role: string
  acceptedAt: string | null
  user: { id: string; name: string | null; email: string; image: string | null }
  moduleRoles: { moduleKey: string; role: string }[]
}

const ROLE_ICONS: Record<string, typeof Shield> = {
  ADMIN: ShieldCheck,
  MODULE_MANAGER: Shield,
  MEMBER: User,
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-primary/20 text-primary",
  MODULE_MANAGER: "bg-blue-500/20 text-blue-400",
  MEMBER: "bg-gray-500/20 text-gray-400",
}

export function TeamManager({
  members,
  enabledModules,
  currentRole,
}: {
  members: Member[]
  enabledModules: string[]
  currentRole: string
}) {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("MEMBER")
  const [sending, setSending] = useState(false)

  const isAdmin = currentRole === "ADMIN"

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    try {
      await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })
      setShowInvite(false)
      setInviteEmail("")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="flex justify-end">
          <Button onClick={() => setShowInvite(true)}>
            <UserPlus className="h-4 w-4 mr-1" /> Invite Member
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Module Roles</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const RoleIcon = ROLE_ICONS[member.role] || User
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={member.user.name} src={member.user.image} size="sm" />
                        <div>
                          <p className="font-medium">{member.user.name || "Unnamed"}</p>
                          <p className="text-xs text-muted-foreground">{member.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={ROLE_COLORS[member.role]}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {member.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {member.moduleRoles.length === 0 ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          member.moduleRoles.map((mr) => {
                            const mod = MODULE_REGISTRY.find((m) => m.key === mr.moduleKey)
                            return (
                              <Badge key={mr.moduleKey} variant="outline" className="text-[10px]">
                                {mod?.name || mr.moduleKey}: {mr.role}
                              </Badge>
                            )
                          })
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.acceptedAt ? (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">Pending</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Module assignments legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Enabled Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {enabledModules.map((key) => {
              const mod = MODULE_REGISTRY.find((m) => m.key === key)
              return (
                <Badge key={key} variant="outline">
                  {mod?.name || key}
                </Badge>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                <option value="MEMBER">Member</option>
                <option value="MODULE_MANAGER">Module Manager</option>
                <option value="ADMIN">Admin</option>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
              <Button type="submit" disabled={sending}>
                {sending ? "Sending..." : "Send Invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
