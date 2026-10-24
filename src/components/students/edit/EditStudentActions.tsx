"use client";

import React from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";

interface EditStudentActionsProps {
  studentId: string;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function EditStudentActions({
  studentId,
  isSubmitting,
  onCancel,
}: EditStudentActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      <Link
        href={`/students/${studentId}`}
        onClick={onCancel}
        className="px-5 py-2.5 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 body-sm-medium transition-colors shadow-2xs"
      >
        Cancel
      </Link>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue hover:bg-[#1D60E3] active:bg-[#1853C9] text-white body-sm-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Saving Changes...</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4 stroke-[2.2]" />
            <span>Save Changes</span>
          </>
        )}
      </button>
    </div>
  );
}
