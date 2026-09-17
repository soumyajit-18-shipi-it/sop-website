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
  const handleChange = (field: keyof MetadataValues, val: string | number) => {
    onChange({
      ...values,
      [field]: val,
    });
  };

  return (
    <section className="qpi-card p-6">
      <h3 className="text-base font-semibold text-slate-900 mb-5 flex items-center gap-3">
        <span className="qpi-step">2</span>
        Paper Metadata
      </h3>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="qpi-label" htmlFor="academic-year">
            Academic Year
          </label>
          <select
            id="academic-year"
            value={values.academicYear}
            onChange={(e) => handleChange("academicYear", e.target.value)}
            className="qpi-input"
          >
            <option value="2025-2026">2025 - 2026</option>
            <option value="2024-2025">2024 - 2025</option>
            <option value="2023-2024">2023 - 2024</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="qpi-label" htmlFor="department">
            Department
          </label>
          <select
            id="department"
            value={values.department}
            onChange={(e) => handleChange("department", e.target.value)}
            className="qpi-input"
          >
            <option value="Department of Physics">Department of Physics</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="qpi-label" htmlFor="course-code">
            Subject / Course Code
          </label>
          <input
            id="course-code"
            type="text"
            value={values.courseCode}
            onChange={(e) => handleChange("courseCode", e.target.value)}
            placeholder="e.g. PHY-201"
            className="qpi-input"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="qpi-label" htmlFor="exam-term">
            Term & Exam Type
          </label>
          <div className="flex gap-2">
            <select
              id="exam-term"
              value={values.term}
              onChange={(e) => handleChange("term", e.target.value)}
              className="qpi-input flex-1"
            >
              <option value="Fall">Fall</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
            </select>
            <select
              value={values.examType}
              onChange={(e) => handleChange("examType", e.target.value)}
              className="qpi-input flex-1"
            >
              <option value="Final Examination">Final Exam</option>
              <option value="Midterm Examination">Midterm</option>
              <option value="Quiz">Quiz</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="qpi-label" htmlFor="total-marks">
            Total Paper Marks
          </label>
          <input
            id="total-marks"
            type="number"
            value={values.totalMarks}
            onChange={(e) => handleChange("totalMarks", Number(e.target.value))}
            placeholder="100"
            className="qpi-input max-w-xs"
          />
        </div>
      </form>
    </section>
  );
}
