"use client";

import React from "react";
import { SearchX, Video } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface LiveClassesEmptyStateProps {
  isFiltered: boolean;
  onReset: () => void;
  onSchedule: () => void;
}

/** No classes yet, or filters that match nothing. */
export function LiveClassesEmptyState({ isFiltered, onReset, onSchedule }: LiveClassesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-2 py-12 px-4">
      <span className="w-12 h-12 rounded-full bg-gray-bg text-primary-300 flex items-center justify-center">
        {isFiltered ? <SearchX className="w-6 h-6" /> : <Video className="w-6 h-6" />}
      </span>
      <p className="body-medium font-semibold! text-primary-500">
        {isFiltered ? "No live classes match your filters" : "No live classes yet"}
      </p>
      <p className="body-sm-regular text-primary-300 max-w-sm">
        {isFiltered
          ? "Try a different search term, status, instructor, course or date range."
          : "Schedule your first live class, webinar or workshop to see it here."}
      </p>
      {isFiltered ? (
        <SecondaryButton size="sm" className="mt-2" onClick={onReset}>
          Reset Filters
        </SecondaryButton>
      ) : (
        <PrimaryButton size="sm" className="mt-2" onClick={onSchedule}>
          Schedule Live Class
        </PrimaryButton>
      )}
    </div>
  );
}

export default LiveClassesEmptyState;
