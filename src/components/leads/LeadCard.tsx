"use client";

import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin } from "lucide-react";

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  jobType: string | null;
  source: string | null;
  estimatedValue: number | null;
  roofArea: number | null;
  materialPref: string | null;
  createdAt: string;
  updatedAt: string;
  notes?: { id: string; content: string; createdAt: string }[];
}

const jobTypeLabels: Record<string, string> = {
  replacement: "Full Replacement",
  repair: "Major Repair",
  inspection: "Inspection",
  storm: "Storm/Emergency",
};

const sourceLabels: Record<string, string> = {
  quote_tool: "Quote Tool",
  manual: "Manual",
  website: "Website",
};

export function LeadCard({
  lead,
  onClick,
}: {
  lead: Lead;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm text-gray-900">{lead.name}</h4>
        {lead.estimatedValue && (
          <span className="text-xs font-semibold text-emerald-600">
            ${lead.estimatedValue.toLocaleString()}
          </span>
        )}
      </div>

      {lead.jobType && (
        <Badge variant="secondary" className="mt-1.5 text-xs">
          {jobTypeLabels[lead.jobType] || lead.jobType}
        </Badge>
      )}

      <div className="mt-2 space-y-1">
        {lead.phone && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Phone size={12} />
            {lead.phone}
          </div>
        )}
        {lead.email && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Mail size={12} />
            {lead.email}
          </div>
        )}
        {lead.address && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={12} />
            {lead.address}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {sourceLabels[lead.source || ""] || lead.source || "—"}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(lead.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
