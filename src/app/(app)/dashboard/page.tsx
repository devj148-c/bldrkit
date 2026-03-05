"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calculator,
  Globe,
  Paintbrush,
  Users,
  Clock,
} from "lucide-react";

interface DashboardStats {
  totalLeads: number;
  leadsThisMonth: number;
  conversionRate: number;
  pipelineValue: number;
  recentLeads: {
    id: string;
    name: string;
    status: string;
    jobType: string | null;
    estimatedValue: number | null;
    createdAt: string;
    source: string | null;
  }[];
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  quoted: "bg-purple-100 text-purple-800",
  negotiating: "bg-orange-100 text-orange-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-red-100 text-red-800",
};

const quickActions = [
  { href: "/quotes", label: "New Quote", icon: Calculator, color: "bg-blue-500" },
  { href: "/leads", label: "View Leads", icon: Users, color: "bg-emerald-500" },
  { href: "/website-builder", label: "Edit Website", icon: Globe, color: "bg-purple-500" },
  { href: "/visualizer", label: "AI Visualizer", icon: Paintbrush, color: "bg-amber-500" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col">
      <Header title="Dashboard" />
      <div className="flex-1 space-y-6 p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        ) : stats ? (
          <>
            <StatsCards
              totalLeads={stats.totalLeads}
              leadsThisMonth={stats.leadsThisMonth}
              conversionRate={stats.conversionRate}
              pipelineValue={stats.pipelineValue}
            />

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action) => (
                      <Link key={action.href} href={action.href}>
                        <Button
                          variant="outline"
                          className="h-auto w-full flex-col gap-2 py-4"
                        >
                          <div className={`rounded-lg p-2 ${action.color} text-white`}>
                            <action.icon size={20} />
                          </div>
                          <span className="text-sm font-medium">{action.label}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock size={18} />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.recentLeads.length === 0 ? (
                      <p className="text-sm text-gray-500">No recent activity</p>
                    ) : (
                      stats.recentLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <p className="font-medium text-sm">{lead.name}</p>
                            <p className="text-xs text-gray-500">
                              {lead.jobType ? lead.jobType.replace("_", " ") : "—"} · via{" "}
                              {lead.source?.replace("_", " ") || "unknown"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {lead.estimatedValue && (
                              <span className="text-sm font-medium text-gray-700">
                                ${lead.estimatedValue.toLocaleString()}
                              </span>
                            )}
                            <Badge
                              variant="secondary"
                              className={statusColors[lead.status] || ""}
                            >
                              {lead.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Failed to load dashboard data.</p>
        )}
      </div>
    </div>
  );
}
