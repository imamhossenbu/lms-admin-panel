"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, UserX } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SecondaryButton } from "@/components/ui/secondary-button";

/** Student details couldn't load: not found in this workspace (404) or another failure. */
export function StudentLoadError({ notFound, message }: { notFound: boolean; message: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-6 text-left">
      <Breadcrumb items={[{ label: "Students", href: "/students" }, { label: notFound ? "Not found" : "Error" }]} />
      <div className="bg-white rounded-xl border border-dash p-12 text-center shadow-2xs space-y-3">
        <div className="w-12 h-12 rounded-full bg-red-14 text-red flex items-center justify-center mx-auto">
          <UserX className="w-6 h-6" />
        </div>
        <h3 className="heading-h5 text-primary-500">{notFound ? "Student not found" : "Couldn't load this student"}</h3>
        <p className="body-sm-regular text-primary-300 max-w-md mx-auto">
          {notFound ? "This student doesn't exist in your workspace or was deleted." : message}
        </p>
        <Link href="/students" className="inline-block pt-2">
          <SecondaryButton type="button" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to students
          </SecondaryButton>
        </Link>
      </div>
    </motion.div>
  );
}

export default StudentLoadError;
