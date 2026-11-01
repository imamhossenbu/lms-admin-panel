"use client";

import React from "react";
import { FileText, Plus } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";

/** Shown when an assignment has no instructions yet. */
export function InstructionsEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-dash bg-gray-bg px-4 py-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-14 text-blue">
        <FileText className="h-6 w-6" />
      </span>
      <p className="mt-3 body-md-medium font-semibold! text-primary-500">No instructions yet</p>
      <p className="mx-auto mt-1 max-w-sm body-sm-regular text-primary-300">
        Add an overview, learning objectives and step-by-step tasks so students know exactly what to submit.
      </p>
      <PrimaryButton size="sm" leftIcon={<Plus />} onClick={onAdd} className="mt-4">
        Add Instructions
      </PrimaryButton>
    </div>
  );
}

export default InstructionsEmptyState;
