"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { TemplateSelector } from "@/components/website-builder/TemplateSelector";
import { SiteEditor } from "@/components/website-builder/SiteEditor";
import { SitePreview } from "@/components/website-builder/SitePreview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Eye, Loader2, Globe } from "lucide-react";

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

export default function WebsiteBuilderPage() {
  const [data, setData] = useState<WebsiteData>({
    template: "modern",
    businessName: "",
    phone: "",
    email: "",
    aboutText: "",
    services: [],
    serviceAreas: [],
    testimonials: [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/website")
      .then((r) => r.json())
      .then((website) => {
        setData({
          template: website.template || "modern",
          businessName: website.businessName || "",
          phone: website.phone || "",
          email: website.email || "",
          aboutText: website.aboutText || "",
          services: safeParseJSON(website.services, []),
          serviceAreas: safeParseJSON(website.serviceAreas, []),
          testimonials: safeParseJSON(website.testimonials, []),
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function safeParseJSON<T>(str: string | null | undefined, fallback: T): T {
    if (!str) return fallback;
    try {
      return JSON.parse(str);
    } catch {
      return fallback;
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/website", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Website Builder" />
        <div className="flex flex-1 items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header title="Website Builder" />
      <div className="flex items-center justify-between border-b bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-purple-500" />
          <span className="text-sm font-medium">SEO Website Builder</span>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-sm text-emerald-600">Saved!</span>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            {saving ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Save size={16} className="mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="edit" className="flex-1">
        <div className="border-b bg-white px-6">
          <TabsList>
            <TabsTrigger value="edit">
              <Save size={14} className="mr-1.5" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye size={14} className="mr-1.5" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="p-6 space-y-6">
          <TemplateSelector
            selected={data.template}
            onSelect={(template) => setData({ ...data, template })}
          />
          <SiteEditor
            data={data}
            onChange={setData}
          />
        </TabsContent>

        <TabsContent value="preview" className="p-6">
          <div className="mx-auto max-w-2xl">
            <SitePreview {...data} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
