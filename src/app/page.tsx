import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Clock, Shield, Zap, Star, Phone, Globe, Calculator, Users, Calendar, FileText, BarChart3, MessageSquare } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 h-16 border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold text-primary">BLDR</span>
          <span className="text-2xl font-bold">Kit</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#features" className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition">Features</Link>
          <Link href="#pricing" className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition">Pricing</Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Start Free</Button>
          </Link>
        </div>
      </nav>

      {/* Hero — Specific to roofers, addresses the dream outcome */}
      <section className="max-w-5xl mx-auto text-center py-20 md:py-28 px-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Zap className="h-4 w-4" />
          Built specifically for roofing contractors
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Stop losing jobs to contractors<br />
          with <span className="text-primary">better websites</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
          BLDRKit gives you a professional website, CRM, estimates, invoices, scheduling, and a booking system — 
          all set up in under 30 minutes. No tech skills needed.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Join the 80% of roofing contractors who are finally getting the tools they deserve.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link href="/quote">
            <Button variant="outline" size="lg" className="text-lg px-8 w-full sm:w-auto">
              Get Instant Estimate
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 w-full sm:w-auto">
              Start Free — No Credit Card <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#demo">
            <Button variant="outline" size="lg" className="text-lg px-8 w-full sm:w-auto">
              See It In Action
            </Button>
          </Link>
        </div>
        
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>Setup in 30 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>No contracts — cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <span>Free plan available</span>
          </div>
        </div>
      </section>

      {/* Pain Points — Articulate their problem better than they can */}
      <section className="border-t border-b bg-muted/30 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Sound familiar?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Most roofing contractors deal with these problems every single day.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { pain: "You're tracking jobs in spreadsheets, sticky notes, or your head", solution: "BLDRKit's job board shows every job from lead to completion — drag and drop to update status" },
              { pain: "Customers can't find you online — or your website looks like it's from 2005", solution: "AI builds you a professional, SEO-optimized website in 30 minutes flat" },
              { pain: "You're writing estimates on paper and losing them in your truck", solution: "Create professional estimates on your phone in 2 minutes. Send instantly. Get notified when they view it." },
              { pain: "You forget to follow up with leads and they go to the other guy", solution: "Every lead is tracked in your CRM. Never lose another job to a missed follow-up." },
              { pain: "You're paying $300+/month for ServiceTitan and only using 10% of it", solution: "BLDRKit starts free. Pro is $79/month. No per-user fees. No long contracts." },
              { pain: "Homeowners call, but you're on a roof and can't answer — so they call someone else", solution: "The booking widget on your website lets them schedule an appointment without calling. You get notified instantly." },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-lg border p-6 space-y-3">
                <p className="text-sm font-medium text-destructive/80">❌ {item.pain}</p>
                <p className="text-sm text-muted-foreground">✅ {item.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid — What you get */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Everything a roofing contractor needs</h2>
        <p className="text-center text-muted-foreground mb-12">One platform. No duct tape. No switching between 5 different apps.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Globe, title: "AI Website Builder", desc: "Answer a few questions, and AI builds you a professional website that ranks on Google. Service pages, location pages, blog — all auto-generated.", tag: "Coming Soon" },
            { icon: Users, title: "Customer CRM", desc: "Every lead, customer, and job in one place. See their full history — quotes, invoices, photos, notes. Never lose track of anyone." },
            { icon: BarChart3, title: "Kanban Job Board", desc: "Drag jobs from Lead → Quoted → Scheduled → In Progress → Done. See your entire pipeline at a glance." },
            { icon: Calculator, title: "Estimates & Invoices", desc: "Build professional estimates with line items. Convert to invoices in one click. Send electronically. Get paid faster." },
            { icon: Calendar, title: "Scheduling", desc: "Calendar view of all your jobs. See who's working where. Drag to reschedule. No double-booking." },
            { icon: MessageSquare, title: "Booking Widget", desc: "Customers book appointments right from your website. You get a text and email. Calendar invite sent to both of you automatically.", tag: "Coming Soon" },
            { icon: Phone, title: "Text Us Button", desc: "Website visitors tap 'Text Us' and it opens a text to your phone. On desktop, they see a QR code. Zero setup.", tag: "Coming Soon" },
            { icon: FileText, title: "Team Management", desc: "Add your crew. Assign roles. Control who sees what. Admin, manager, and field tech views." },
            { icon: Shield, title: "Multi-Trade Ready", desc: "Start with roofing. Add HVAC, plumbing, electrical, gutters, siding — each module built for that specific trade." },
          ].map((feature) => (
            <div key={feature.title} className="space-y-3 p-6 rounded-lg border bg-card hover:border-primary/50 transition">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                {feature.tag && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{feature.tag}</span>
                )}
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Speed Section — Hormozi: latency beats magnitude */}
      <section className="border-t bg-muted/30 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Up and running in 30 minutes. Not 30 days.</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Most roofing software takes weeks to set up. We built BLDRKit so you can be live before lunch.
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Create Account", time: "2 min", desc: "Name, email, company info" },
              { step: "2", title: "Pick Your Services", time: "3 min", desc: "Check which services you offer" },
              { step: "3", title: "AI Builds Your Site", time: "10 min", desc: "Professional website auto-generated" },
              { step: "4", title: "Start Getting Leads", time: "Now", desc: "Share your link, get bookings" },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto">
                  {item.step}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-xs text-primary font-medium">{item.time}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — Transparent, no per-user, Hormozi-style value stacking */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Simple, transparent pricing</h2>
        <p className="text-center text-muted-foreground mb-12">No per-user fees. No long contracts. Cancel anytime.</p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              name: "Free",
              price: "$0",
              desc: "Get started with the basics",
              features: ["Up to 25 customers", "Basic job tracking", "5 estimates/month", "BLDRKit subdomain website"],
              cta: "Start Free",
              highlight: false,
            },
            {
              name: "Pro",
              price: "$79",
              desc: "For growing contractors",
              features: ["Unlimited customers", "Full CRM + job board", "Unlimited estimates & invoices", "AI website with custom domain", "Booking widget", "Text Us button", "Email notifications"],
              cta: "Start Pro",
              highlight: true,
            },
            {
              name: "Business",
              price: "$149",
              desc: "For established companies",
              features: ["Everything in Pro", "Team management (unlimited users)", "Multi-trade modules", "Priority support", "Advanced reporting", "Business phone number", "SMS notifications"],
              cta: "Start Business",
              highlight: false,
            },
            {
              name: "Scale",
              price: "$249",
              desc: "For multi-crew operations",
              features: ["Everything in Business", "Multiple locations", "API access", "Custom integrations", "Dedicated account manager", "White-label options", "QuickBooks sync"],
              cta: "Contact Sales",
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 space-y-6 ${
                plan.highlight
                  ? "border-primary bg-primary/5 ring-1 ring-primary relative"
                  : "bg-card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "$0" && <span className="text-muted-foreground">/month</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{plan.desc}</p>
              </div>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block">
                <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans include a 14-day free trial of Pro features. No credit card required.
        </p>
      </section>

      {/* Guarantee — Risk reversal */}
      <section className="border-t bg-muted/30 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Our Guarantee: Love It or Leave It</h2>
          <p className="text-muted-foreground leading-relaxed">
            Try BLDRKit free for 14 days. If you don&apos;t get at least one new lead from your website in the first month, 
            we&apos;ll extend your trial until you do. No questions asked. We only win when you win.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Your competitor already has a website.<br />
          <span className="text-primary">Time to get yours.</span>
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Set up takes 30 minutes. Your first lead could come today.
        </p>
        <Link href="/register">
          <Button size="lg" className="text-lg px-8">
            Get Started — Free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-primary font-bold">BLDR</span>
            <span className="font-bold">Kit</span>
            <span className="text-sm text-muted-foreground ml-2">&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition">Features</Link>
            <Link href="#pricing" className="hover:text-foreground transition">Pricing</Link>
            <Link href="/login" className="hover:text-foreground transition">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
