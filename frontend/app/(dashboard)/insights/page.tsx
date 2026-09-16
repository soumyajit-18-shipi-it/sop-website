export default function InsightsPage() {
  return (
    <div class="flex flex-col gap-lg">
      <header>
        <h1 class="font-headline-lg text-headline-lg text-primary">Preparation Insights</h1>
        <p class="text-sm text-on-surface-variant mt-1">
          Analyze historical course data to optimize your upcoming question paper.
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div class="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
          <h3 class="text-base font-bold text-primary mb-2">Proposed Draft Freshness</h3>
          <p class="text-xs text-on-surface-variant mb-4">
            Your current draft indicates high novelty compared to department submissions from the last 5 years.
          </p>
          <div class="text-display-lg font-bold text-primary">85%</div>
        </div>

        <div class="md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg border-t-4 border-t-primary-container">
          <h3 class="text-base font-bold text-primary mb-2">Conceptual Gaps</h3>
          <ul class="space-y-3 text-xs">
            <li class="flex items-start gap-2">
              <span class="material-symbols-outlined text-primary-container text-base">radio_button_unchecked</span>
              <div>
                <p class="font-semibold text-primary">Advanced Metamaterials</p>
                <p class="text-on-surface-variant">Last covered: Fall 2019</p>
              </div>
            </li>
            <li class="flex items-start gap-2">
              <span class="material-symbols-outlined text-primary-container text-base">radio_button_unchecked</span>
              <div>
                <p class="font-semibold text-primary">Quantum Fluid Dynamics</p>
                <p class="text-on-surface-variant">Last covered: Spring 2021</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
