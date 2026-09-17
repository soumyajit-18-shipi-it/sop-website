"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloudUpload, LayoutDashboard, Lightbulb } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/upload", label: "Upload", icon: CloudUpload },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/insights", label: "Insights", icon: Lightbulb },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 bg-white border-t border-slate-200 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors min-w-[72px] ${
              isActive ? "text-accent bg-blue-50" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
            <span className="text-[11px] font-medium mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
