"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Award } from "lucide-react";

export function CourseDetailsOutcomes() {
  const learningOutcomes = [
    "Design and deploy production-grade fullstack web applications",
    "Master state management, performance optimization, and caching strategies",
    "Integrate AI services, LLM prompt engineering, and autonomous pipelines",
    "Implement zero-trust role-based access control and security compliance",
    "Set up end-to-end continuous integration and Kubernetes cloud orchestration",
  ];

  const prerequisites = [
    "Proficiency in modern TypeScript or JavaScript ES6+",
    "Basic understanding of web protocols, HTTP APIs, and client-server models",
    "Familiarity with terminal commands and Git version control",
  ];

  return (
    <div className="space-y-5 text-left">
      {/* What You'll Learn */}
      <div className="p-4 rounded-[12px] bg-[#F8F9FA] border border-[#EDEDED] space-y-3">
        <h4 className="body-md-medium text-primary-500 font-bold flex items-center gap-2">
          <Award className="w-4 h-4 text-[#1C4D8D]" />
          <span>What Students Will Master</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {learningOutcomes.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="body-sm-regular text-primary-500">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      <div className="p-4 rounded-[12px] bg-white border border-[#EDEDED] space-y-3">
        <h4 className="body-md-medium text-primary-500 font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Recommended Prerequisites</span>
        </h4>
        <ul className="space-y-2 list-disc list-inside body-sm-regular text-primary-500">
          {prerequisites.map((req, idx) => (
            <li key={idx} className="leading-relaxed">
              {req}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
