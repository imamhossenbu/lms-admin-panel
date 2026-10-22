"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { AuthGuard, isPublicAuthRoute } from "@/components/auth/AuthGuard";

function AdminShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = isPublicAuthRoute(pathname);

  if (isAuthPage) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
          <AdminNavbar />
          <main className="p-6 lg:p-8 flex-1 max-w-[1600px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
          <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
        </div>
      }
    >
      <AdminShellContent>{children}</AdminShellContent>
    </Suspense>
  );
}
