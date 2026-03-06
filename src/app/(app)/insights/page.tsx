import { Header } from "@/components/layout/Header"
import { InsightsDashboard } from "@/components/insights/InsightsDashboard"

export default function InsightsPage() {
  return (
    <>
      <Header
        title="AI Insights"
        subtitle="Smart recommendations to grow your business"
      />
      <div className="p-6">
        <InsightsDashboard />
      </div>
    </>
  )
}
