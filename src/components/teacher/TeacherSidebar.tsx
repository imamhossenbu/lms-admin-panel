"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/cn";
import { TEACHER_NAV, isTeacherNavActive } from "./teacherNav";

/** Teacher-mode navigation (white sidebar like the admin panel; horizontal strip on small screens). */
export function TeacherSidebar({ counts }: { counts: Partial<Record<string, number>> }) {
  const pathname = usePathname();
  const links = TEACHER_NAV.map((item) => {
    const active = isTeacherNavActive(pathname, item.href);
    const n = counts[item.href];
    return (
      <Link key={item.href} href={item.href} className={cn("relative flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 body-sm-medium transition-colors", active ? "text-brand-orange" : "text-primary-400 hover:bg-slate-50 hover:text-primary-500")}>
        {active && <motion.span layoutId="teach-nav" className="absolute inset-0 -z-10 rounded-lg bg-brand-orange-light" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
        <item.icon className="h-4.5 w-4.5" />
        <span className="flex-1 whitespace-nowrap">{item.label}</span>
        {!!n && <span className="rounded-full bg-brand-orange px-2 py-0.5 body-2xsm-regular font-semibold text-white">{n}</span>}
      </Link>
    );
  });
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-dash bg-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-dash px-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange-light text-brand-orange">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="flex flex-col">
            <span className="body-medium text-primary-500">EduPro</span>
            <span className="body-2xsm-regular text-primary-300">Teacher Panel</span>
          </span>
        </div>
        <nav aria-label="Teacher" className="isolate flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3">
          {links}
        </nav>
      </aside>
      <nav aria-label="Teacher" className="isolate flex gap-1 overflow-x-auto border-b border-dash bg-white px-3 py-2 lg:hidden">
        {links}
      </nav>
    </>
  );
}

export default TeacherSidebar;
