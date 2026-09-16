import SidebarNav from "@/components/layout/SidebarNav";
import MobileHeader from "@/components/layout/MobileHeader";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div class="min-h-screen flex flex-col md:flex-row bg-background">
      <MobileHeader />
      <SidebarNav />
      <div class="flex-1 md:ml-[240px] flex flex-col min-h-screen">
        <main class="flex-1 p-margin pb-24 md:pb-margin max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
