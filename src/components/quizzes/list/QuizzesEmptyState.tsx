"use client";

import React from "react";
import { FileQuestion, SearchX } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface QuizzesEmptyStateProps {
  isFiltered: boolean;
  onReset: () => void;
  onCreate: () => void;
}

/** No quizzes yet, or no quizzes match the current filters. */
export function QuizzesEmptyState({ isFiltered, onReset, onCreate }: QuizzesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-bg text-primary-300">
        {isFiltered ? <SearchX className="h-6 w-6" /> : <FileQuestion className="h-6 w-6" />}
      </span>
      <p className="body-medium font-semibold! text-primary-500">{isFiltered ? "No quizzes match your filters" : "No quizzes yet"}</p>
      <p className="max-w-sm body-sm-regular text-primary-300">
        {isFiltered ? "Try a different search term, course, module, status or difficulty." : "Create your first quiz to start assessing your students."}
      </p>
      {isFiltered ? (
        <SecondaryButton size="sm" className="mt-2" onClick={onReset}>
          Reset Filters
        </SecondaryButton>
      ) : (
        <PrimaryButton size="sm" className="mt-2" onClick={onCreate}>
          Create Quiz
        </PrimaryButton>
      )}
    </div>
  );
}

export default QuizzesEmptyState;
