"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Customer {
  id: string
  firstName: string
  lastName: string
}

interface Job {
  id: string
  title: string
  status: string
  priority: string
  customerId: string
  customer: Customer
  scheduledStart: string | null
  estimatedValue: string | null
  moduleKey: string | null
}

const COLUMNS = [
  { id: "LEAD", title: "Leads", color: "border-t-gray-500" },
  { id: "QUOTED", title: "Quoted", color: "border-t-blue-500" },
  { id: "SCHEDULED", title: "Scheduled", color: "border-t-yellow-500" },
  { id: "IN_PROGRESS", title: "In Progress", color: "border-t-orange-500" },
  { id: "COMPLETED", title: "Completed", color: "border-t-green-500" },
]

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-gray-500/20 text-gray-400",
  MEDIUM: "bg-blue-500/20 text-blue-400",
  HIGH: "bg-orange-500/20 text-orange-400",
  URGENT: "bg-red-500/20 text-red-400",
}

export function JobBoard({ initialJobs, customers }: { initialJobs: Job[]; customers: Customer[] }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [view, setView] = useState<"kanban" | "list">("kanban")
  const [showNewJob, setShowNewJob] = useState(false)
  const [newJob, setNewJob] = useState({ title: "", customerId: "", description: "", priority: "MEDIUM" })
  const [saving, setSaving] = useState(false)

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return
    const newStatus = result.destination.droppableId
    const jobId = result.draggableId

    // Optimistic update
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    )

    await fetch("/api/jobs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: jobId, status: newStatus }),
    })
  }

  async function createJob(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      })
      if (res.ok) {
        const job = await res.json()
        setJobs((prev) => [job, ...prev])
        setShowNewJob(false)
        setNewJob({ title: "", customerId: "", description: "", priority: "MEDIUM" })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={view === "kanban" ? "default" : "outline"}
            onClick={() => setView("kanban")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Button size="sm" onClick={() => setShowNewJob(true)}>
          <Plus className="h-4 w-4 mr-1" /> New Job
        </Button>
      </div>

      {view === "kanban" ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((col) => {
              const columnJobs = jobs.filter((j) => j.status === col.id)
              return (
                <Droppable key={col.id} droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-shrink-0 w-72 rounded-lg border border-t-4 ${col.color} ${
                        snapshot.isDraggingOver ? "bg-accent/50" : "bg-card"
                      }`}
                    >
                      <div className="p-3 border-b">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold">{col.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {columnJobs.length}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-2 space-y-2 min-h-[200px]">
                        {columnJobs.map((job, index) => (
                          <Draggable key={job.id} draggableId={job.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 rounded-md border bg-background ${
                                  snapshot.isDragging ? "shadow-lg ring-2 ring-primary" : ""
                                }`}
                              >
                                <Link href={`/jobs/${job.id}`} className="block">
                                  <p className="text-sm font-medium mb-1">{job.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {job.customer.firstName} {job.customer.lastName}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge className={`text-[10px] px-1.5 py-0 ${PRIORITY_COLORS[job.priority]}`}>
                                      {job.priority}
                                    </Badge>
                                    {job.estimatedValue && (
                                      <span className="text-xs text-muted-foreground">
                                        ${Number(job.estimatedValue).toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              )
            })}
          </div>
        </DragDropContext>
      ) : (
        <div className="space-y-2">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {job.customer.firstName} {job.customer.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`text-xs ${PRIORITY_COLORS[job.priority]}`}>{job.priority}</Badge>
                <Badge variant="secondary">{job.status.replace("_", " ")}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* New Job Dialog */}
      <Dialog open={showNewJob} onOpenChange={setShowNewJob}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>
          </DialogHeader>
          <form onSubmit={createJob} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={newJob.title}
                onChange={(e) => setNewJob((p) => ({ ...p, title: e.target.value }))}
                placeholder="Roof replacement — 123 Main St"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Customer</Label>
              <Select
                value={newJob.customerId}
                onChange={(e) => setNewJob((p) => ({ ...p, customerId: e.target.value }))}
                required
              >
                <option value="">Select customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={newJob.priority}
                onChange={(e) => setNewJob((p) => ({ ...p, priority: e.target.value }))}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newJob.description}
                onChange={(e) => setNewJob((p) => ({ ...p, description: e.target.value }))}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowNewJob(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Job"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
