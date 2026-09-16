import Link from "next/link";
import { BentoGrid, BentoCard } from "@/components/layout/BentoGrid";

export default function DashboardPage() {
  return (
    <div class="flex flex-col gap-xl">
      <header class="flex justify-between items-end flex-wrap gap-md">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-primary">Faculty Dashboard</h1>
          <p class="text-on-surface-variant text-sm mt-1">
            Overview of recent question paper submissions and quality metrics.
          </p>
        </div>
        <Link
          href="/upload"
          class="bg-primary text-on-primary font-semibold text-xs px-lg py-2 rounded-full flex items-center gap-2 hover:bg-primary-container transition-colors"
        >
          <span class="material-symbols-outlined text-base">cloud_upload</span>
          Upload New Paper
        </Link>
      </header>

      <BentoGrid>
        <BentoCard colSpan={4}>
          <div class="flex justify-between items-start mb-md">
            <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Total Analyzed
            </span>
            <span class="material-symbols-outlined text-outline">description</span>
          </div>
          <div>
            <div class="font-display-lg text-display-lg text-primary">1,248</div>
            <div class="text-xs text-on-tertiary-container mt-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">arrow_upward</span>
              12% from last term
            </div>
          </div>
        </BentoCard>

        <BentoCard colSpan={4}>
          <div class="flex justify-between items-start mb-md">
            <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Avg. Originality
            </span>
            <span class="material-symbols-outlined text-outline">verified</span>
          </div>
          <div>
            <div class="font-display-lg text-display-lg text-primary">82%</div>
            <div class="w-full h-1 bg-surface-variant mt-2 rounded-full overflow-hidden">
              <div class="h-full bg-primary w-[82%]"></div>
            </div>
          </div>
        </BentoCard>

        <BentoCard colSpan={4} className="hover:border-surface-tint cursor-pointer">
          <Link href="/upload" class="flex flex-col items-center justify-center text-center h-full">
            <span class="material-symbols-outlined text-outline text-[36px] mb-2">upload_file</span>
            <span class="font-semibold text-primary text-sm">Drag & Drop Question Paper</span>
            <span class="text-xs text-on-surface-variant">PDF, DOCX up to 25MB</span>
          </Link>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
