"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Clock,
  DollarSign,
  Users,
  Zap,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Star,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Demo data — will be AI-generated from real data when DB is connected
const DEMO_INSIGHTS = {
  hotLeads: [
    {
      name: "Sarah Johnson",
      address: "1234 Oak Drive, Dallas, TX",
      service: "Roof Replacement",
      score: 92,
      reason: "Requested estimate 2 days ago, viewed your website 4 times, lives in a neighborhood with 3 recent roof replacements",
      action: "Call within 2 hours — high urgency",
    },
    {
      name: "Mike Thompson",
      address: "567 Elm Street, Plano, TX",
      service: "Storm Damage Inspection",
      score: 87,
      reason: "Filed insurance claim last week, found you via Google search for 'storm damage roofer near me'",
      action: "Call today — insurance deadline approaching",
    },
    {
      name: "Jennifer Davis",
      address: "890 Maple Ave, Frisco, TX",
      service: "Roof Inspection",
      score: 78,
      reason: "Home purchased 18 months ago, no inspection on record, neighborhood avg roof age: 15 years",
      action: "Send inspection offer email",
    },
  ],
  weeklyMetrics: {
    leadsThisWeek: 12,
    leadsTrend: "+33%",
    conversionRate: "28%",
    avgJobValue: "$8,450",
    revenueThisWeek: "$23,660",
    revenueTrend: "+18%",
    followUpsDue: 5,
    estimatesPending: 3,
  },
  recommendations: [
    {
      type: "opportunity",
      title: "Storm season approaching",
      description: "March-May historically brings 40% more storm damage leads. Consider running Google Ads for 'storm damage roof repair [city]' keywords.",
      impact: "High",
      icon: TrendingUp,
    },
    {
      type: "warning",
      title: "3 estimates expiring this week",
      description: "Estimates for Williams, Chen, and Rodriguez expire in 3, 5, and 7 days. Follow up before they go to a competitor.",
      impact: "High",
      icon: AlertTriangle,
    },
    {
      type: "tip",
      title: "You're not getting Google reviews",
      description: "Only 2 reviews in the last 30 days. Top-ranking competitors in your area average 8/month. Send review requests after every completed job.",
      impact: "Medium",
      icon: Star,
    },
    {
      type: "opportunity",
      title: "Add metal roofing to your services",
      description: "12 searches/month for 'metal roofing contractor' in your area with low competition. If you offer metal roofing, add it to your website.",
      impact: "Medium",
      icon: Zap,
    },
    {
      type: "tip",
      title: "Your average response time is 4.2 hours",
      description: "Top converters respond within 30 minutes. Leads contacted within 5 minutes are 21x more likely to convert.",
      impact: "High",
      icon: Clock,
    },
  ],
  pipelineHealth: {
    leads: 8,
    quoted: 5,
    scheduled: 3,
    inProgress: 2,
    avgDaysToClose: 12,
    winRate: "35%",
    lostReasons: [
      { reason: "Price too high", count: 3 },
      { reason: "Went with competitor", count: 2 },
      { reason: "Decided to wait", count: 2 },
      { reason: "No response", count: 4 },
    ],
  },
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-500 bg-green-500/10" : score >= 60 ? "text-yellow-500 bg-yellow-500/10" : "text-red-500 bg-red-500/10"
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold", color)}>
      <Brain className="h-3 w-3" />
      {score}
    </span>
  )
}

export function InsightsDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* AI Badge */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Brain className="h-4 w-4 text-primary" />
        <span>Powered by AI — these insights update automatically as your data grows</span>
        <Badge variant="outline" className="text-xs">Demo Data</Badge>
      </div>

      {/* Weekly Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Leads This Week", value: DEMO_INSIGHTS.weeklyMetrics.leadsThisWeek, trend: DEMO_INSIGHTS.weeklyMetrics.leadsTrend, icon: Users },
          { label: "Conversion Rate", value: DEMO_INSIGHTS.weeklyMetrics.conversionRate, icon: TrendingUp },
          { label: "Avg Job Value", value: DEMO_INSIGHTS.weeklyMetrics.avgJobValue, icon: DollarSign },
          { label: "Revenue This Week", value: DEMO_INSIGHTS.weeklyMetrics.revenueThisWeek, trend: DEMO_INSIGHTS.weeklyMetrics.revenueTrend, icon: BarChart3 },
        ].map((metric) => (
          <Card key={metric.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold mt-1">{metric.value}</p>
                  {metric.trend && (
                    <p className="text-xs text-green-500 mt-1">↑ {metric.trend} vs last week</p>
                  )}
                </div>
                <metric.icon className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Hot Leads */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Hot Leads — Call These First
              </CardTitle>
              <CardDescription>AI-ranked by likelihood to convert</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {DEMO_INSIGHTS.hotLeads.map((lead, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-2 hover:border-primary/50 transition cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{lead.name}</span>
                        <ScoreBadge score={lead.score} />
                      </div>
                      <p className="text-xs text-muted-foreground">{lead.address}</p>
                    </div>
                    <Badge variant="outline">{lead.service}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{lead.reason}</p>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs font-medium text-primary">→ {lead.action}</p>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Smart Recommendations
              </CardTitle>
              <CardDescription>AI-generated suggestions to grow your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {DEMO_INSIGHTS.recommendations.map((rec, i) => (
                <div key={i} className={cn(
                  "flex gap-4 p-4 rounded-lg border",
                  rec.type === "warning" ? "border-yellow-500/30 bg-yellow-500/5" : "border-border"
                )}>
                  <rec.icon className={cn(
                    "h-5 w-5 mt-0.5 shrink-0",
                    rec.type === "warning" ? "text-yellow-500" : rec.type === "opportunity" ? "text-green-500" : "text-blue-500"
                  )} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{rec.title}</p>
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        rec.impact === "High" ? "text-red-500 border-red-500/30" : "text-yellow-500 border-yellow-500/30"
                      )}>
                        {rec.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Health */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pipeline Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { stage: "Leads", count: DEMO_INSIGHTS.pipelineHealth.leads, color: "bg-blue-500" },
                  { stage: "Quoted", count: DEMO_INSIGHTS.pipelineHealth.quoted, color: "bg-yellow-500" },
                  { stage: "Scheduled", count: DEMO_INSIGHTS.pipelineHealth.scheduled, color: "bg-orange-500" },
                  { stage: "In Progress", count: DEMO_INSIGHTS.pipelineHealth.inProgress, color: "bg-green-500" },
                ].map((item) => (
                  <div key={item.stage} className="flex items-center gap-3">
                    <div className={cn("h-2 w-2 rounded-full", item.color)} />
                    <span className="text-sm flex-1">{item.stage}</span>
                    <span className="text-sm font-bold">{item.count}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Win Rate</span>
                  <span className="font-medium">{DEMO_INSIGHTS.pipelineHealth.winRate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Days to Close</span>
                  <span className="font-medium">{DEMO_INSIGHTS.pipelineHealth.avgDaysToClose}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Why You're Losing Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DEMO_INSIGHTS.pipelineHealth.lostReasons.map((reason) => (
                  <div key={reason.reason} className="flex items-center gap-3">
                    <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-destructive/60 rounded-full"
                        style={{ width: `${(reason.count / 11) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-32 text-right">{reason.reason}</span>
                    <span className="text-xs font-medium w-4">{reason.count}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                💡 Tip: &quot;No response&quot; is your biggest loss. Set up automatic follow-up reminders at 24h, 48h, and 7 days.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { text: "Follow up with 5 overdue leads", urgent: true },
                  { text: "Send 3 expiring estimates", urgent: true },
                  { text: "Request reviews from 2 recent completions", urgent: false },
                  { text: "Update website with spring pricing", urgent: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className={cn("h-1.5 w-1.5 rounded-full", item.urgent ? "bg-red-500" : "bg-muted-foreground")} />
                    <span className={item.urgent ? "font-medium" : "text-muted-foreground"}>{item.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
