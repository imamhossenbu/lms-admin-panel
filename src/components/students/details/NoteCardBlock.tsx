"use client";

import React from "react";
import { StudentNoteItem } from "./mockStudentDetails";

interface NoteCardBlockProps {
  note: StudentNoteItem;
}

export function NoteCardBlock({ note }: NoteCardBlockProps) {
  const getCategoryStyles = () => {
    switch (note.category) {
      case "good_progress":
        return {
          container: "bg-blue-14 border border-blue/20",
          title: "text-blue",
        };
      case "needs_improvement":
        return {
          container: "bg-yellow-bg border border-yellow/25",
          title: "text-yellow",
        };
      case "student_support":
        return {
          container: "bg-green-bg border border-green/25",
          title: "text-green",
        };
      case "counseling_call":
        return {
          container: "bg-purple-14 border border-purple/25",
          title: "text-purple",
        };
      case "payment_issue":
        return {
          container: "bg-red-14 border border-red/25",
          title: "text-red",
        };
      case "general":
      default:
        return {
          container: "bg-slate-50 border border-dash",
          title: "text-primary-500",
        };
    }
  };

  const styles = getCategoryStyles();

  return (
    <div className={`p-4 rounded-xl ${styles.container} space-y-1 text-left`}>
      <h5 className={`body-sm-medium font-bold ${styles.title}`}>
        {note.categoryLabel}
      </h5>
      <p className="body-sm-regular text-primary-400 leading-relaxed">
        {note.content}
      </p>
    </div>
  );
}
