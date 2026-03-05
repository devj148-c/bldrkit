"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

export function AddressInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <MapPin size={16} />
        Property Address
      </Label>
      <Input
        placeholder="Enter full address (e.g., 123 Main St, Austin, TX 78701)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs text-gray-500">
        Google Maps integration coming soon — address-based estimation is active.
      </p>
    </div>
  );
}
