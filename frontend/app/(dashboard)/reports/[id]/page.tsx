import Link from "next/link";

export default function ReportPage({ params }: { params: { id: string } }) {
  return (
    <div class="flex flex-col gap-lg">
      <header class="flex items-center gap-4 border-b border-outline-variant pb-4">
        <Link href="/upload" class="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant">
          <span class="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 class="font-headline-md font-bold text-primary">Originality & Match Report</h1>
          <p class="text-xs text-on-surface-variant">PHY-201 Final Examination Draft • Report ID: {params.id}</p>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div class="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg text-center" style={{ borderTop: "4px solid #009c6b" }}>
          <h3 class="text-sm font-semibold text-on-surface mb-2">Originality Score</h3>
          <div class="text-display-lg font-bold text-primary my-4">88%</div>
          <span class="inline-flex items-center gap-1 bg-on-tertiary-container/10 px-3 py-1 rounded-full text-on-tertiary-container text-xs font-semibold">
            <span class="material-symbols-outlined filled text-xs">verified</span> High Originality
          </span>
        </div>

        <div class="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col justify-between">
          <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Identified Repetitions</h3>
          <div class="text-display-lg font-bold text-error my-2">3</div>
          <p class="text-xs text-on-surface-variant">Questions matched from historical course archives (2019-2024)</p>
        </div>
      </div>
    </div>
  );
}
