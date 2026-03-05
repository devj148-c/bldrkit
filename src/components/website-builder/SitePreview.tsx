"use client";

import { Star, Phone, Mail, MapPin, Shield, CheckCircle } from "lucide-react";

interface PreviewProps {
  template: string;
  businessName: string;
  phone: string;
  email: string;
  aboutText: string;
  services: string[];
  serviceAreas: string[];
  testimonials: { name: string; text: string; rating: number }[];
}

const serviceLabels: Record<string, string> = {
  roof_replacement: "Roof Replacement",
  repair: "Roof Repair",
  inspection: "Roof Inspection",
  storm_damage: "Storm Damage Repair",
  commercial: "Commercial Roofing",
};

const templateStyles = {
  modern: {
    hero: "bg-gradient-to-br from-slate-900 to-slate-700",
    accent: "text-emerald-400",
    btn: "bg-emerald-500",
    section: "bg-white",
  },
  classic: {
    hero: "bg-gradient-to-br from-amber-900 to-amber-700",
    accent: "text-amber-300",
    btn: "bg-amber-600",
    section: "bg-amber-50",
  },
  bold: {
    hero: "bg-gradient-to-br from-emerald-800 to-cyan-700",
    accent: "text-white",
    btn: "bg-cyan-500",
    section: "bg-emerald-50",
  },
};

export function SitePreview(props: PreviewProps) {
  const style = templateStyles[props.template as keyof typeof templateStyles] || templateStyles.modern;
  const biz = props.businessName || "Your Roofing Company";

  return (
    <div className="overflow-hidden rounded-lg border shadow-lg bg-white">
      {/* Hero */}
      <div className={`${style.hero} px-8 py-16 text-center text-white`}>
        <h1 className="text-3xl font-bold">{biz}</h1>
        <p className={`mt-2 text-lg ${style.accent}`}>
          Professional Roofing Services You Can Trust
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {props.phone && (
            <span className="flex items-center gap-2 text-sm">
              <Phone size={14} /> {props.phone}
            </span>
          )}
          {props.email && (
            <span className="flex items-center gap-2 text-sm">
              <Mail size={14} /> {props.email}
            </span>
          )}
        </div>
        <button className={`mt-6 rounded-lg ${style.btn} px-6 py-2.5 font-medium text-white`}>
          Get a Free Quote
        </button>
      </div>

      {/* Services */}
      {props.services.length > 0 && (
        <div className={`${style.section} px-8 py-10`}>
          <h2 className="text-center text-xl font-bold text-gray-900">Our Services</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {props.services.map((s) => (
              <div key={s} className="flex items-center gap-2 rounded-lg border bg-white p-3">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                <span className="text-sm font-medium">{serviceLabels[s] || s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About */}
      {props.aboutText && (
        <div className="px-8 py-10 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">About Us</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{props.aboutText}</p>
        </div>
      )}

      {/* Service Areas */}
      {props.serviceAreas.length > 0 && (
        <div className="px-8 py-8">
          <h2 className="text-xl font-bold text-gray-900">Service Areas</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {props.serviceAreas.map((area, i) => (
              <span key={i} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm">
                <MapPin size={12} className="text-gray-400" /> {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials */}
      {props.testimonials.length > 0 && (
        <div className="bg-gray-50 px-8 py-10">
          <h2 className="text-center text-xl font-bold text-gray-900">What Our Customers Say</h2>
          <div className="mt-6 space-y-4">
            {props.testimonials.map((t, i) => (
              <div key={i} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s <= t.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600 italic">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-1 text-sm font-medium text-gray-900">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-900 px-8 py-6 text-center text-white">
        <div className="flex items-center justify-center gap-2">
          <Shield size={16} className="text-emerald-400" />
          <span className="text-sm font-medium">{biz}</span>
        </div>
        <p className="mt-1 text-xs text-gray-400">Licensed & Insured · Free Estimates</p>
      </div>
    </div>
  );
}
