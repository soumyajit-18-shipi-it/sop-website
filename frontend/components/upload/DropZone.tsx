"use client";

import React, { useRef, useState } from "react";

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
}

export default function DropZone({ onFileSelected, selectedFile }: DropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const validateAndSelect = (file: File) => {
    const MAX_SIZE = 25 * 1024 * 1024; // 25MB
    if (file.size > MAX_SIZE) {
      alert("File size exceeds maximum 25MB limit.");
      return;
    }
    const name = file.name.toLowerCase();
    if (!name.endsWith(".pdf") && !name.endsWith(".docx")) {
      alert("Please upload a PDF or DOCX file.");
      return;
    }
    onFileSelected(file);
  };

  return (
    <section class="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg relative overflow-hidden group transition-all duration-300">
      <div class="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>
      <h3 class="font-headline-sm text-headline-sm text-primary mb-md flex items-center gap-sm">
        <span class="material-symbols-outlined text-primary-container">counter_1</span>
        File Selection
      </h3>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx"
        class="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-xl flex flex-col items-center justify-center transition-colors cursor-pointer min-h-[220px] ${
          isDragOver
            ? "border-primary-container bg-secondary-container/20"
            : selectedFile
            ? "border-on-tertiary-container bg-surface-container-low"
            : "border-outline-variant hover:border-primary-container bg-surface-container-low hover:bg-surface-container-lowest"
        }`}
      >
        <span class="material-symbols-outlined text-[48px] text-on-surface-variant mb-md">
          {selectedFile ? "verified" : "upload_file"}
        </span>

        {selectedFile ? (
          <div class="text-center">
            <p class="font-bold text-primary text-base">{selectedFile.name}</p>
            <p class="text-xs text-on-surface-variant mt-1">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for scan
            </p>
            <button
              type="button"
              class="mt-3 text-xs bg-primary-container text-on-primary-container px-4 py-1.5 rounded-full font-semibold"
            >
              Change File
            </button>
          </div>
        ) : (
          <div class="text-center">
            <p class="font-headline-sm text-headline-sm text-primary text-center">
              Drag & Drop question paper here
            </p>
            <p class="text-xs text-on-surface-variant mt-1 text-center">
              or browse for PDF or DOCX (Max 25MB)
            </p>
            <button
              type="button"
              class="mt-4 bg-primary-container text-on-primary-container text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary hover:text-on-primary transition-colors"
            >
              Browse Files
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
