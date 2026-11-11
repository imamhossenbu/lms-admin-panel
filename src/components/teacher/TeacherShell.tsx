"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { teacherApi } from "@/lib/api/teacher";
import { TeacherSidebar } from "./TeacherSidebar";
import { TeacherNavbar } from "./TeacherNavbar";

/** Layout for TEACHER accounts: own sidebar (with grading / Q&A counts) + top bar. */
export function TeacherShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<Record<string, number>>({});
  // Refresh the badges whenever the teacher moves between pages (grading / answering lowers them).
  useEffect(() => {
    let alive = true;
    teacherApi
      .dashboard()
      .then((d) => alive && setCounts({ "/teach/grading": d.stats.pendingSubmissions, "/teach/questions": d.stats.openQuestions }))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [pathname]);
  return (
    <div className="flex min-h-screen bg-gray-bg">
      <TeacherSidebar counts={counts} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TeacherNavbar />
        <main className="mx-auto w-full max-w-400 flex-1 p-3 sm:p-5">{children}</main>
      </div>
    </div>
  );
}

export default TeacherShell;
