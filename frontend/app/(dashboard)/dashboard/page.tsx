import Link from "next/link";
import { BentoGrid, BentoCard } from "@/components/layout/BentoGrid";
import { ArrowUp, CloudUpload, FileText, ShieldCheck, Upload } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Faculty Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Overview of recent question paper submissions and quality metrics.
          </p>
        </div>
        <Link
          href="/upload"
          className="bg-accent text-white font-semibold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary transition-colors shadow-sm"
        >
          <CloudUpload size={16} />
          Upload New Paper
        </Link>
      </header>

      <BentoGrid>
        <BentoCard colSpan={4}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Analyzed
            </span>
            <FileText className="text-slate-400" size={18} />
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900">1,248</div>
            <div className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
              <ArrowUp size={12} />
              12% from last term
            </div>
          </div>
        </BentoCard>

        <BentoCard colSpan={4}>
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg. Originality
            </span>
            <ShieldCheck className="text-slate-400" size={18} />
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900">82%</div>
            <div className="w-full h-1.5 bg-slate-100 mt-3 rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[82%]" />
            </div>
          </div>
        </BentoCard>

        <BentoCard colSpan={4} className="hover:border-accent/40 cursor-pointer">
          <Link href="/upload" className="flex flex-col items-center justify-center text-center h-full py-2">
            <Upload className="text-accent mb-2" size={32} strokeWidth={1.6} />
            <span className="font-semibold text-slate-900 text-sm">Drag & Drop Question Paper</span>
            <span className="text-xs text-slate-500">PDF, DOCX up to 25MB</span>
          </Link>
        </BentoCard>
      </BentoGrid>
    </div>
  );
}
