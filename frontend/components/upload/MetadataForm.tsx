"use client";

import React from "react";

export interface MetadataValues {
  academicYear: string;
  department: string;
  courseCode: string;
  term: string;
  examType: string;
  totalMarks: number;
}

interface MetadataFormProps {
  values: MetadataValues;
  onChange: (values: MetadataValues) => void;
}

export default function MetadataForm({ values, onChange }: MetadataFormProps) {
  const handleChange = (field: keyof MetadataValues, val: any) => {
    onChange({
      ...values,
      [field]: val,
    });
  };

  return (
    <section class="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg relative">
      <div class="absolute top-0 left-0 w-1 h-full bg-surface-variant"></div>
      <h3 class="font-headline-sm text-headline-sm text-primary mb-md flex items-center gap-sm">
        <span class="material-symbols-outlined text-primary-container">counter_2</span>
        Paper Metadata
      </h3>

      <form class="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div class="flex flex-col gap-xs">
          <label class="text-xs font-semibold text-primary" htmlFor="academic-year">
            Academic Year
          </label>
          <select
            id="academic-year"
            value={values.academicYear}
            onChange={(e) => handleChange("academicYear", e.target.value)}
            class="border border-outline-variant rounded p-2 bg-surface-container-lowest text-sm focus:border-primary outline-none"
          >
            <option value="2025-2026">2025 - 2026</option>
            <option value="2024-2025">2024 - 2025</option>
            <option value="2023-2024">2023 - 2024</option>
          </select>
        </div>

        <div class="flex flex-col gap-xs">
          <label class="text-xs font-semibold text-primary" htmlFor="department">
            Department
          </label>
          <select
            id="department"
            value={values.department}
            onChange={(e) => handleChange("department", e.target.value)}
            class="border border-outline-variant rounded p-2 bg-surface-container-lowest text-sm focus:border-primary outline-none"
          >
            <option value="Department of Physics">Department of Physics</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
          </select>
        </div>

        <div class="flex flex-col gap-xs">
          <label class="text-xs font-semibold text-primary" htmlFor="course-code">
            Subject / Course Code
          </label>
          <input
            id="course-code"
            type="text"
            value={values.courseCode}
            onChange={(e) => handleChange("courseCode", e.target.value)}
            placeholder="e.g. PHY-201"
            class="border border-outline-variant rounded p-2 bg-surface-container-lowest text-sm focus:border-primary outline-none"
          />
        </div>

        <div class="flex flex-col gap-xs">
          <label class="text-xs font-semibold text-primary" htmlFor="exam-term">
            Term & Exam Type
          </label>
          <div class="flex gap-2">
            <select
              id="exam-term"
              value={values.term}
              onChange={(e) => handleChange("term", e.target.value)}
              class="flex-1 border border-outline-variant rounded p-2 bg-surface-container-lowest text-sm focus:border-primary outline-none"
            >
              <option value="Fall">Fall</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
            </select>
            <select
              value={values.examType}
              onChange={(e) => handleChange("examType", e.target.value)}
              class="flex-1 border border-outline-variant rounded p-2 bg-surface-container-lowest text-sm focus:border-primary outline-none"
            >
              <option value="Final Examination">Final Exam</option>
              <option value="Midterm Examination">Midterm</option>
              <option value="Quiz">Quiz</option>
            </select>
          </div>
        </div>

        <div class="flex flex-col gap-xs md:col-span-2">
          <label class="text-xs font-semibold text-primary" htmlFor="total-marks">
            Total Paper Marks
          </label>
          <input
            id="total-marks"
            type="number"
            value={values.totalMarks}
            onChange={(e) => handleChange("totalMarks", Number(e.target.value))}
            placeholder="100"
            class="border border-outline-variant rounded p-2 bg-surface-container-lowest text-sm focus:border-primary outline-none"
          />
        </div>
      </form>
    </section>
  );
}
