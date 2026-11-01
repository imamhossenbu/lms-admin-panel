"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, SearchX } from "lucide-react";
import PrimaryButton from "@/components/ui/primary-button";

/** Shown when the course being edited can't be loaded. */
export function CourseNotFoundState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="dashboard-card shadow-2xs flex flex-col items-center gap-4 px-6 py-16 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-14">
        <SearchX className="h-7 w-7 text-red" />
      </span>
      <div>
        <h2 className="heading-h5 text-primary-500">Course not found</h2>
        <p className="mt-1 body-sm-regular text-primary-300">
          This course may have been deleted, or the link is incorrect.
        </p>
      </div>
      <Link href="/courses">
        <PrimaryButton leftIcon={<ArrowLeft />}>Back to Courses</PrimaryButton>
      </Link>
    </motion.div>
  );
}

export default CourseNotFoundState;
