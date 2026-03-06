import { Header } from "@/components/layout/Header"
import { SetupWizard } from "@/components/website-builder/SetupWizard"

export default function WebsiteBuilderSetupPage() {
  return (
    <>
      <Header
        title="Website Builder"
        subtitle="Set up your professional roofing website in minutes"
      />
      <div className="p-6">
        <SetupWizard />
      </div>
    </>
  )
}
