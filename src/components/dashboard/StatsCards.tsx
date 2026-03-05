"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, TrendingUp, DollarSign } from "lucide-react";

interface StatsCardsProps {
  totalLeads: number;
  leadsThisMonth: number;
  conversionRate: number;
  pipelineValue: number;
}

export function StatsCards({
  totalLeads,
  leadsThisMonth,
  conversionRate,
  pipelineValue,
}: StatsCardsProps) {
  const cards = [
    {
      title: "Total Leads",
      value: totalLeads.toString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Leads This Month",
      value: leadsThisMonth.toString(),
      icon: UserPlus,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Pipeline Value",
      value: `$${pipelineValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {card.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
