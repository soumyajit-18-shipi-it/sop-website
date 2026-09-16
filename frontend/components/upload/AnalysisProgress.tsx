"use client";

import React from "react";

interface AnalysisProgressProps {
  isAnalyzing: boolean;
  progressPercent: number;
  currentStep: string;
  onViewReport: () => void;
  reportReady: boolean;
}

export default function AnalysisProgress({
  isAnalyzing,
  progressPercent,
  currentStep,
  onViewReport,
  reportReady,
}: AnalysisProgressProps) {
  return (
    <section class="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg relative h-full flex flex-col justify-between">
      <div>
        <div class="absolute top-0 left-0 w-1 h-full bg-surface-variant"></div>
        <h3 class="font-headline-sm text-headline-sm text-primary mb-md flex items-center gap-sm">
          <span class="material-symbols-outlined text-primary-container">counter_3</span>
          Analysis Status
        </h3>

        {!isAnalyzing && !reportReady && (
          <div class="flex-1 flex flex-col items-center justify-center opacity-60 text-center py-12">
            <span class="material-symbols-outlined text-[48px] text-outline-variant mb-md">
              analytics
            </span>
            <p class="text-sm text-on-surface-variant">
              Awaiting paper upload and submission to begin analysis.
            </p>
          </div>
        )}

        {(isAnalyzing || reportReady) && (
          <div class="flex flex-col gap-4 py-4">
            <div class="flex justify-between items-end">
              <span class="text-xs font-semibold text-primary">{currentStep}</span>
              <span class="text-xs text-on-surface-variant font-bold">{progressPercent}%</span>
            </div>

            <div class="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
              <div
                class="h-full bg-primary-container transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div class="mt-4 p-3 bg-surface-container-low rounded-lg border border-outline-variant">
              <div class="flex items-center gap-2 text-xs text-primary font-medium">
                <span class="material-symbols-outlined text-base text-on-tertiary-container">
                  {reportReady ? "check_circle" : "sync"}
                </span>
                <span>
                  {reportReady
                    ? "Analysis complete. Question matches and originality score calculated."
                    : "Scanning course exam database..."}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {reportReady && (
        <button
          onClick={onViewReport}
          class="w-full mt-6 bg-primary text-on-primary font-bold text-sm py-3 rounded-lg hover:bg-primary-container transition-colors flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-base">visibility</span>
          View Originality & Match Report
        </button>
      )}
    </section>
  );
}
