"use client";

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { UsersTableClient } from "@/components/users/UsersTableClient";
import { ToneBadge } from "@/components/ui/ToneBadge";

function UsersTableSkeleton() {
  return (
    <div className="rounded-[12px] border border-dash bg-white p-5 space-y-4 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="h-10 w-96 bg-slate-100 rounded-lg" />
        <div className="h-10 w-full md:w-80 bg-slate-100 rounded-lg" />
      </div>
      <div className="rounded-[10px] border border-dash overflow-hidden">
        <div className="bg-slate-50 border-b border-dash grid grid-cols-12 divide-x divide-dash px-3.5 py-3">
          <div className="col-span-4"><div className="h-4 w-28 bg-slate-200 rounded" /></div>
          <div className="col-span-2 px-3"><div className="h-4 w-16 bg-slate-200 rounded" /></div>
          <div className="col-span-2 px-3"><div className="h-4 w-16 bg-slate-200 rounded" /></div>
          <div className="col-span-2 px-3"><div className="h-4 w-20 bg-slate-200 rounded" /></div>
          <div className="col-span-2 pl-3"><div className="h-4 w-14 bg-slate-200 rounded" /></div>
        </div>
        <div className="divide-y divide-dash">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="grid grid-cols-12 divide-x divide-dash px-3.5 py-3.5 items-center">
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-40 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="col-span-2 px-3">
                <div className="h-5 w-20 bg-slate-100 rounded-full" />
              </div>
              <div className="col-span-2 px-3">
                <div className="h-5 w-16 bg-slate-100 rounded-full" />
              </div>
              <div className="col-span-2 px-3">
                <div className="h-4 w-24 bg-slate-100 rounded" />
              </div>
              <div className="col-span-2 pl-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-slate-100" />
                <div className="w-7 h-7 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function UsersManagementPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="space-y-6 text-left bg-white"
    >
      <PageHeader
        title="User & Access Directory"
        description="Oversee student enrollments, instructor credentials, and administrative authority."
        badge={<ToneBadge tone="navy">RBAC Enforced</ToneBadge>}
      />
      <Suspense fallback={<UsersTableSkeleton />}>
        <UsersTableClient />
      </Suspense>
    </motion.div>
  );
}
