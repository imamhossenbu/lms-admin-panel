"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface StudentTabPlaceholderProps {
  title: string;
}

export function StudentTabPlaceholder({ title }: StudentTabPlaceholderProps) {
  return (
    <div className="bg-white rounded-xl border border-dash p-12 text-center shadow-2xs space-y-3">
      <div className="w-12 h-12 rounded-full bg-blue-14 text-blue flex items-center justify-center mx-auto">
        <Sparkles className="w-6 h-6" />
      </div>
      <h3 className="heading-h5 font-bold text-primary-500">{title}</h3>
      <p className="body-sm-regular text-primary-300 max-w-md mx-auto">
        This section is ready for data integration. Provide the screen design or requirements to activate the full interface.
      </p>
    </div>
  );
}
