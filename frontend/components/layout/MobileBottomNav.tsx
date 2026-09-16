"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/upload", label: "Upload", icon: "cloud_upload" },
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/insights", label: "Insights", icon: "lightbulb" },
  ];

  return (
    <nav class="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 bg-surface-container-lowest border-t border-outline-variant z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            class={`flex flex-col items-center justify-center p-2 rounded-full transition-transform ${
              isActive
                ? "bg-primary-container text-on-primary-container px-4 py-1"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className={`material-symbols-outlined ${isActive ? "filled" : ""}`}>
              {item.icon}
            </span>
            <span class="text-[11px] font-medium mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
