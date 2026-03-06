"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Search, Phone, Mail } from "lucide-react"

interface CustomerWithCounts {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  city: string | null
  state: string | null
  tags: string[]
  source: string | null
  createdAt: Date
  _count: { jobs: number; invoices: number }
}

export function CustomerList({ customers }: { customers: CustomerWithCounts[] }) {
  const [search, setSearch] = useState("")

  const filtered = customers.filter((c) => {
    const term = search.toLowerCase()
    return (
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.includes(term)
    )
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {customers.length === 0 ? "No customers yet. Add your first customer!" : "No customers match your search."}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Jobs</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <Link href={`/customers/${customer.id}`} className="flex items-center gap-3 hover:text-primary">
                    <Avatar name={`${customer.firstName} ${customer.lastName}`} size="sm" />
                    <div>
                      <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                      {customer.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {customer.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {customer.email && (
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" /> {customer.email}
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" /> {customer.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {customer.city && customer.state ? `${customer.city}, ${customer.state}` : "—"}
                </TableCell>
                <TableCell className="text-sm">{customer._count.jobs}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {customer.source || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
