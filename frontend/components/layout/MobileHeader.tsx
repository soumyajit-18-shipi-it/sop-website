"use client";

export default function MobileHeader() {
  return (
    <header class="md:hidden bg-surface-container-lowest text-primary w-full top-0 sticky border-b border-outline-variant transition-colors duration-200 z-40">
      <div class="flex justify-between items-center w-full px-4 py-3 max-w-[1440px] mx-auto">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
            QP
          </div>
          <span class="font-bold text-primary text-base">QPI Platform</span>
        </div>
        <button class="text-on-secondary-container hover:bg-surface-container-low p-2 rounded-full transition-colors duration-200">
          <span class="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </header>
  );
}
