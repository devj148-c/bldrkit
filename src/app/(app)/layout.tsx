import { Sidebar } from "@/components/layout/Sidebar";
import { Providers } from "../providers";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 lg:ml-64">{children}</main>
      </div>
    </Providers>
  );
}
