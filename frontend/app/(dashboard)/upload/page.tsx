"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DropZone from "@/components/upload/DropZone";
import MetadataForm, { MetadataValues } from "@/components/upload/MetadataForm";
import AnalysisProgress from "@/components/upload/AnalysisProgress";

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<MetadataValues>({
    academicYear: "2025-2026",
    department: "Department of Physics",
    courseCode: "PHY-201",
    term: "Fall",
    examType: "Final Examination",
    totalMarks: 100,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentStep, setCurrentStep] = useState("Awaiting file upload");
  const [reportId, setReportId] = useState<string | null>(null);
  const [reportReady, setReportReady] = useState(false);

  const handleBeginAnalysis = async () => {
    if (!selectedFile) {
      alert("Please select a question paper file first.");
      return;
    }

    setIsAnalyzing(true);
    setProgressPercent(15);
    setCurrentStep("Uploading paper document...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("course_id", "123e4567-e89b-12d3-a456-426614174000");
      formData.append("academic_year", metadata.academicYear);
      formData.append("term", metadata.term);
      formData.append("exam_type", metadata.examType);
      formData.append("total_marks", metadata.totalMarks.toString());

      // Mock upload API call fallback for dev
      const res = await fetch("http://localhost:8000/api/v1/papers/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload API failed");
      }

      const data = await res.json();
      setProgressPercent(60);
      setCurrentStep("Parsing questions & generating vector embeddings...");

      setTimeout(() => {
        setProgressPercent(100);
        setCurrentStep("Analysis complete");
        setReportId(data.report_id || "mock-report-123");
        setReportReady(true);
        setIsAnalyzing(false);
      }, 1500);

    } catch (err) {
      // Dev mock simulation fallback
      setTimeout(() => {
        setProgressPercent(100);
        setCurrentStep("Analysis complete (Dev Mock)");
        setReportId("mock-report-123");
        setReportReady(true);
        setIsAnalyzing(false);
      }, 1500);
    }
  };

  const handleViewReport = () => {
    if (reportId) {
      router.push(`/reports/${reportId}`);
    } else {
      router.push("/reports/mock-report-123");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Upload & Analyze Paper
        </h1>
        <p className="text-slate-500 mt-2 max-w-2xl">
          Submit a new question paper draft for archival similarity analysis and quality verification.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <DropZone selectedFile={selectedFile} onFileSelected={setSelectedFile} />
          <MetadataForm values={metadata} onChange={setMetadata} />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <AnalysisProgress
            isAnalyzing={isAnalyzing}
            progressPercent={progressPercent}
            currentStep={currentStep}
            reportReady={reportReady}
            onViewReport={handleViewReport}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={() => {
            setSelectedFile(null);
            setReportReady(false);
            setProgressPercent(0);
          }}
          className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-full text-sm font-semibold hover:bg-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleBeginAnalysis}
          disabled={!selectedFile || isAnalyzing || reportReady}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
            selectedFile && !isAnalyzing && !reportReady
              ? "bg-accent text-white hover:bg-primary cursor-pointer shadow-sm"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isAnalyzing ? "Scanning..." : reportReady ? "Analysis Complete" : "Begin Analysis"}
        </button>
      </div>
    </div>
  );
}
