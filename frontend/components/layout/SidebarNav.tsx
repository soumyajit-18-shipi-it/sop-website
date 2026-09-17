"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloudUpload, LayoutDashboard, Lightbulb } from "lucide-react";

export default function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/upload", label: "Upload & Scan", icon: CloudUpload },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/insights", label: "Insights", icon: Lightbulb },
  ];

  return (
    <nav className="hidden md:flex flex-col gap-1 p-5 bg-white text-primary h-full w-[260px] fixed left-0 top-0 border-r border-slate-200 z-40">
      <div className="flex items-center gap-3 mb-8 px-1">
        <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-sm shadow-sm">
          QP
        </div>
        <div>
          <div className="text-sm font-bold tracking-tight text-slate-900">QPI Platform</div>
          <div className="text-[11px] text-slate-500">Question Paper Intel</div>
        </div>
      </div>

      <div className="px-3 py-3 mb-6 rounded-2xl bg-slate-50 border border-slate-100">
        <div className="font-semibold text-slate-900 text-sm">Dr. Academic User</div>
        <div className="text-slate-500 text-xs mt-0.5">Senior Faculty</div>
        <div className="text-slate-400 text-[11px]">Department of Science</div>
      </div>

      <div className="flex flex-col gap-1 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-accent shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
