"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/upload", label: "Upload & Scan", icon: "cloud_upload" },
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/insights", label: "Insights", icon: "lightbulb" },
  ];

  return (
    <nav class="hidden md:flex flex-col gap-base p-md bg-surface-container-low text-primary font-sans h-full w-[240px] fixed left-0 top-0 border-r border-outline-variant z-40">
      <div class="flex flex-col mb-xl">
        <div class="flex items-center gap-md mb-2">
          <div class="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
            QP
          </div>
          <div>
            <div class="text-headline-sm font-bold text-primary">QPI Platform</div>
          </div>
        </div>
        <div class="mt-4">
          <div class="font-bold text-primary text-sm">Dr. Academic User</div>
          <div class="text-on-surface-variant text-xs">Senior Faculty</div>
          <div class="text-on-surface-variant text-[10px]">Department of Science</div>
        </div>
      </div>

      <div class="flex flex-col gap-sm flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              class={`flex items-center gap-md px-4 py-3 rounded-full text-xs font-semibold transition-all duration-200 ease-in-out ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? "filled" : ""}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
