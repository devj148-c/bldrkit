import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 h-16 border-b">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold text-primary">BLDR</span>
          <span className="text-2xl font-bold">Kit</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center py-24 px-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          The platform for{" "}
          <span className="text-primary">home services</span>{" "}
          professionals
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          CRM, job management, estimates, invoices, scheduling, and team management —
          all in one platform built for your trade.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Start Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Customer CRM", desc: "Track leads, customers, and relationships in one place" },
            { title: "Job Board", desc: "Kanban-style job management from lead to completion" },
            { title: "Estimates & Invoices", desc: "Professional estimates and invoices with online payments" },
            { title: "Scheduling", desc: "Calendar view of all jobs with drag-and-drop scheduling" },
            { title: "Team Management", desc: "Invite your team, assign roles, manage access by module" },
            { title: "Multi-Trade", desc: "Enable modules for roofing, HVAC, plumbing, and more" },
          ].map((feature) => (
            <div key={feature.title} className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{feature.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6 border-t">
        <h2 className="text-3xl font-bold mb-4">Ready to streamline your business?</h2>
        <p className="text-muted-foreground mb-8">Join thousands of home services professionals on BLDRKit</p>
        <Link href="/register">
          <Button size="lg">Get Started — Free</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-center text-sm text-muted-foreground">
        <span className="text-primary font-bold">BLDR</span>
        <span className="font-bold">Kit</span>
        {" "}&copy; {new Date().getFullYear()}. All rights reserved.
      </footer>
    </div>
  )
}
