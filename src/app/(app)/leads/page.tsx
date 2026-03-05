"use client";

import { Header } from "@/components/layout/Header";
import { KanbanBoard } from "@/components/leads/KanbanBoard";

export default function LeadsPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header title="Lead CRM" />
      <KanbanBoard />
    </div>
  );
}
