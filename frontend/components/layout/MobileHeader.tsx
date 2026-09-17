"use client";

import { Bell } from "lucide-react";

export default function MobileHeader() {
  return (
    <header className="md:hidden bg-white text-primary w-full top-0 sticky border-b border-slate-200 z-40">
      <div className="flex justify-between items-center w-full px-4 py-3 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-xs">
            QP
          </div>
          <span className="font-bold text-slate-900 text-base">QPI Platform</span>
        </div>
        <button className="text-slate-500 hover:bg-slate-100 p-2 rounded-full transition-colors">
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
