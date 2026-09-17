import SidebarNav from "@/components/layout/SidebarNav";
import MobileHeader from "@/components/layout/MobileHeader";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <MobileHeader />
      <SidebarNav />
      <div className="flex-1 md:ml-[260px] flex flex-col min-h-screen">
        <main className="flex-1 p-5 md:p-8 pb-24 md:pb-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
