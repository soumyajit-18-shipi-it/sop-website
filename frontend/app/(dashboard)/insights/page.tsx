import { Circle } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Preparation Insights</h1>
        <p className="text-sm text-slate-500 mt-1">
          Analyze historical course data to optimize your upcoming question paper.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 qpi-card p-6">
          <h3 className="text-base font-bold text-slate-900 mb-2">Proposed Draft Freshness</h3>
          <p className="text-sm text-slate-500 mb-4">
            Your current draft indicates high novelty compared to department submissions from the last 5 years.
          </p>
          <div className="text-5xl font-bold text-slate-900">85%</div>
        </div>

        <div className="md:col-span-4 qpi-card p-6 border-t-4 border-t-accent">
          <h3 className="text-base font-bold text-slate-900 mb-3">Conceptual Gaps</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Circle className="text-accent mt-0.5 shrink-0" size={14} />
              <div>
                <p className="font-semibold text-slate-900">Advanced Metamaterials</p>
                <p className="text-slate-500 text-xs">Last covered: Fall 2019</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="text-accent mt-0.5 shrink-0" size={14} />
              <div>
                <p className="font-semibold text-slate-900">Quantum Fluid Dynamics</p>
                <p className="text-slate-500 text-xs">Last covered: Spring 2021</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
