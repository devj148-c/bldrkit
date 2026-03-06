import { Header } from "@/components/layout/Header"
import { QuickEstimateCalculator } from "@/components/estimates/QuickEstimateCalculator"

export default function QuickEstimatePage() {
  return (
    <>
      <Header
        title="Quick Estimate"
        subtitle="Generate a professional estimate in under 2 minutes"
      />
      <div className="p-6">
        <QuickEstimateCalculator />
      </div>
    </>
  )
}
