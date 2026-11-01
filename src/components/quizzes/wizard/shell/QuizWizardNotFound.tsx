"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileQuestion } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";

/** Edit route for a quiz id that doesn't exist (deleted / bad link). */
export function QuizWizardNotFound() {
  const router = useRouter();
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5">
      <Breadcrumb items={[{ label: "Quizzes", href: "/quizzes" }, { label: "Edit Quiz" }]} />
      <div className="dashboard-card shadow-2xs flex flex-col items-center gap-3 p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-14 text-red">
          <FileQuestion className="h-6 w-6" />
        </span>
        <h2 className="heading-h5 text-primary-500">Quiz not found</h2>
        <p className="max-w-md body-sm-regular text-primary-300">This quiz may have been deleted, or the link is incorrect.</p>
        <PrimaryButton className="mt-2" onClick={() => router.push("/quizzes")}>
          Go to Quizzes
        </PrimaryButton>
      </div>
    </motion.div>
  );
}

export default QuizWizardNotFound;
