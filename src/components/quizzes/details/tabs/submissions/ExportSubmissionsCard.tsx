"use client";

import React from "react";
import { ChevronDown, Download, FileSpreadsheet, Filter } from "lucide-react";
import { toast } from "sonner";
import type { QuizAttempt, QuizItem } from "@/types/quiz";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { downloadAttemptsCsv } from "../../quizCsv";

export interface ExportSubmissionsCardProps {
  quiz: QuizItem;
  attempts: QuizAttempt[];
  filtered: QuizAttempt[];
}

/** "Export Submissions ▾": CSV of the filtered rows or of every attempt. */
export function ExportSubmissionsCard({ quiz, attempts, filtered }: ExportSubmissionsCardProps) {
  const exportRows = (rows: QuizAttempt[], suffix: string) => {
    if (!rows.length) {
      toast.error("Nothing to export", { description: "No submissions match the current selection." });
      return;
    }
    try {
      const file = downloadAttemptsCsv(quiz, rows, suffix);
      toast.success("Download started", { description: `${rows.length} submission${rows.length === 1 ? "" : "s"} saved to ${file}.` });
    } catch {
      toast.error("Download failed", { description: "Your browser blocked the file. Please try again." });
    }
  };

  return (
    <AppDropdownMenu
      align="end"
      items={[
        { key: "filtered", label: `Export filtered (${filtered.length})`, icon: <Filter className="h-4 w-4" />, onClick: () => exportRows(filtered, "submissions-filtered"), disabled: !filtered.length },
        { key: "all", label: `Export all (${attempts.length})`, icon: <FileSpreadsheet className="h-4 w-4" />, onClick: () => exportRows(attempts, "submissions"), disabled: !attempts.length },
      ]}
      trigger={
        <SecondaryButton fullWidth size="lg" leftIcon={<Download />} rightIcon={<ChevronDown />}>
          Export Submissions
        </SecondaryButton>
      }
    />
  );
}

export default ExportSubmissionsCard;
