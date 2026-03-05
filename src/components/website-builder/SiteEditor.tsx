"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Star } from "lucide-react";

interface WebsiteData {
  template: string;
  businessName: string;
  phone: string;
  email: string;
  aboutText: string;
  services: string[];
  serviceAreas: string[];
  testimonials: { name: string; text: string; rating: number }[];
}

const SERVICE_OPTIONS = [
  { id: "roof_replacement", label: "Roof Replacement" },
  { id: "repair", label: "Roof Repair" },
  { id: "inspection", label: "Roof Inspection" },
  { id: "storm_damage", label: "Storm Damage" },
  { id: "commercial", label: "Commercial Roofing" },
];

export function SiteEditor({
  data,
  onChange,
}: {
  data: WebsiteData;
  onChange: (data: WebsiteData) => void;
}) {
  function toggleService(serviceId: string) {
    const services = data.services.includes(serviceId)
      ? data.services.filter((s) => s !== serviceId)
      : [...data.services, serviceId];
    onChange({ ...data, services });
  }

  function addServiceArea() {
    const area = prompt("Enter service area (city/town):");
    if (area) onChange({ ...data, serviceAreas: [...data.serviceAreas, area] });
  }

  function removeServiceArea(index: number) {
    onChange({ ...data, serviceAreas: data.serviceAreas.filter((_, i) => i !== index) });
  }

  function addTestimonial() {
    onChange({
      ...data,
      testimonials: [
        ...data.testimonials,
        { name: "", text: "", rating: 5 },
      ],
    });
  }

  function updateTestimonial(index: number, field: string, value: string | number) {
    const testimonials = [...data.testimonials];
    testimonials[index] = { ...testimonials[index], [field]: value };
    onChange({ ...data, testimonials });
  }

  function removeTestimonial(index: number) {
    onChange({ ...data, testimonials: data.testimonials.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-6">
      {/* Business Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Business Name</Label>
            <Input
              value={data.businessName}
              onChange={(e) => onChange({ ...data, businessName: e.target.value })}
              placeholder="Your Roofing Company"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Phone</Label>
              <Input
                value={data.phone}
                onChange={(e) => onChange({ ...data, phone: e.target.value })}
                placeholder="(555) 000-0000"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => onChange({ ...data, email: e.target.value })}
                placeholder="info@company.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Services Offered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map((service) => (
              <button
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  data.services.includes(service.id)
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {data.services.includes(service.id) && "✓ "}
                {service.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Areas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Service Areas</CardTitle>
          <Button variant="outline" size="sm" onClick={addServiceArea}>
            <Plus size={14} className="mr-1" />
            Add Area
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.serviceAreas.map((area, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm"
              >
                {area}
                <button onClick={() => removeServiceArea(i)} className="text-gray-400 hover:text-gray-600">
                  <X size={12} />
                </button>
              </span>
            ))}
            {data.serviceAreas.length === 0 && (
              <p className="text-sm text-gray-400">No service areas added yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">About Section</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.aboutText}
            onChange={(e) => onChange({ ...data, aboutText: e.target.value })}
            placeholder="Tell potential customers about your business..."
            rows={5}
          />
        </CardContent>
      </Card>

      {/* Testimonials */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Testimonials</CardTitle>
          <Button variant="outline" size="sm" onClick={addTestimonial}>
            <Plus size={14} className="mr-1" />
            Add Testimonial
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.testimonials.map((testimonial, i) => (
            <div key={i} className="relative rounded-lg border p-3">
              <button
                onClick={() => removeTestimonial(i)}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
              <div className="space-y-2">
                <Input
                  value={testimonial.name}
                  onChange={(e) => updateTestimonial(i, "name", e.target.value)}
                  placeholder="Customer name"
                  className="text-sm"
                />
                <Textarea
                  value={testimonial.text}
                  onChange={(e) => updateTestimonial(i, "text", e.target.value)}
                  placeholder="What did they say about your work?"
                  rows={2}
                />
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => updateTestimonial(i, "rating", star)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={16}
                        className={star <= testimonial.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {data.testimonials.length === 0 && (
            <p className="text-sm text-gray-400">No testimonials added yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
