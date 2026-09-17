import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function ReportPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <Link href="/upload" className="p-2 rounded-full hover:bg-white text-slate-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Originality & Match Report</h1>
          <p className="text-xs text-slate-500">PHY-201 Final Examination Draft · Report ID: {params.id}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="qpi-card p-6 text-center border-t-4 border-t-emerald-500">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Originality Score</h3>
          <div className="text-5xl font-bold text-slate-900 my-4">88%</div>
          <span className="inline-flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full text-emerald-700 text-xs font-semibold">
            <ShieldCheck size={14} /> High Originality
          </span>
        </div>

        <div className="lg:col-span-2 qpi-card p-6 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Identified Repetitions</h3>
          <div className="text-5xl font-bold text-red-600 my-2">3</div>
          <p className="text-sm text-slate-500">Questions matched from historical course archives (2019-2024)</p>
        </div>
      </div>
    </div>
  );
}
