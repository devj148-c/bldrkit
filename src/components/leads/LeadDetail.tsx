"use client";

import { useState, useEffect } from "react";
import { Lead } from "./LeadCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Phone, Mail, MapPin, Send, Trash2 } from "lucide-react";

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "negotiating", label: "Negotiating" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const jobTypeOptions = [
  { value: "replacement", label: "Full Replacement" },
  { value: "repair", label: "Major Repair" },
  { value: "inspection", label: "Inspection" },
  { value: "storm", label: "Storm/Emergency" },
];

export function LeadDetail({
  lead,
  onClose,
  onUpdate,
  onDelete,
}: {
  lead: Lead;
  onClose: () => void;
  onUpdate: (updated: Lead) => void;
  onDelete: (id: string) => void;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [status, setStatus] = useState(lead.status);
  const [jobType, setJobType] = useState(lead.jobType || "");

  useEffect(() => {
    fetch(`/api/leads/${lead.id}/notes`)
      .then((r) => r.json())
      .then(setNotes)
      .catch(() => {});
  }, [lead.id]);

  async function handleStatusChange(newStatus: string) {
    setStatus(newStatus);
    const res = await fetch(`/api/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      onUpdate({ ...lead, ...updated });
    }
  }

  async function handleJobTypeChange(newType: string) {
    setJobType(newType);
    const res = await fetch(`/api/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobType: newType }),
    });
    if (res.ok) {
      const updated = await res.json();
      onUpdate({ ...lead, ...updated });
    }
  }

  async function handleAddNote() {
    if (!newNote.trim()) return;
    const res = await fetch(`/api/leads/${lead.id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newNote }),
    });
    if (res.ok) {
      const note = await res.json();
      setNotes([note, ...notes]);
      setNewNote("");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    const res = await fetch(`/api/leads/${lead.id}`, { method: "DELETE" });
    if (res.ok) {
      onDelete(lead.id);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/50" onClick={onClose}>
      <div
        className="h-full w-full max-w-lg overflow-y-auto bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">{lead.name}</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500 hover:text-red-700">
              <Trash2 size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
        </div>

        <div className="space-y-4 p-4">
          {/* Contact Info */}
          <div className="space-y-2">
            {lead.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-gray-400" />
                {lead.phone}
              </div>
            )}
            {lead.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-gray-400" />
                {lead.email}
              </div>
            )}
            {lead.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-gray-400" />
                {lead.address}
              </div>
            )}
          </div>

          <Separator />

          {/* Status & Job Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Job Type</Label>
              <Select value={jobType} onValueChange={handleJobTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {jobTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-2 gap-3">
            {lead.roofArea && (
              <div>
                <Label className="text-xs text-gray-500">Roof Area</Label>
                <p className="font-medium text-sm">{lead.roofArea.toLocaleString()} sq ft</p>
              </div>
            )}
            {lead.materialPref && (
              <div>
                <Label className="text-xs text-gray-500">Material</Label>
                <p className="font-medium text-sm capitalize">{lead.materialPref}</p>
              </div>
            )}
            {lead.estimatedValue && (
              <div>
                <Label className="text-xs text-gray-500">Estimated Value</Label>
                <p className="font-medium text-sm">${lead.estimatedValue.toLocaleString()}</p>
              </div>
            )}
            {lead.source && (
              <div>
                <Label className="text-xs text-gray-500">Source</Label>
                <Badge variant="secondary" className="text-xs">{lead.source.replace("_", " ")}</Badge>
              </div>
            )}
          </div>

          <Separator />

          {/* Notes */}
          <div>
            <Label className="text-sm font-semibold">Notes</Label>
            <div className="mt-2 flex gap-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[60px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
              />
              <Button size="sm" onClick={handleAddNote} className="bg-emerald-500 hover:bg-emerald-600">
                <Send size={14} />
              </Button>
            </div>

            <div className="mt-3 space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm">{note.content}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
