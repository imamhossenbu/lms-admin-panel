"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, UserX } from "lucide-react";

export function InstructorNotFound() {
  return (
    <div className="bg-white rounded-xl border border-dash shadow-2xs p-10 flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-red-14 text-red flex items-center justify-center">
        <UserX className="w-6 h-6" />
      </div>
      <h1 className="heading-h5 font-bold text-primary-500">Instructor not found</h1>
      <p className="body-sm-regular text-primary-300 max-w-sm">
        This instructor may have been removed, or the link is incorrect.
      </p>
      <Link
        href="/instructors"
        className="mt-2 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 body-sm-medium transition-colors shadow-2xs"
      >
        <ArrowLeft className="w-4 h-4 text-primary-400" />
        Back to Instructors
      </Link>
    </div>
  );
}

export default InstructorNotFound;
