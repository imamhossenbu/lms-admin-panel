"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { AuthGuard } from "@/components/auth/AuthGuard";

function AdminShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname ? pathname.startsWith("/login") : false;

  if (isAuthPage) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-white">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <AdminNavbar />
          <main className="p-6 md:p-8 flex-1 max-w-[1600px] w-full mx-auto bg-white">
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
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="w-8 h-8 rounded-full border-2 border-[#1C4D8D] border-t-transparent animate-spin" />
        </div>
      }
    >
      <AdminShellContent>{children}</AdminShellContent>
    </Suspense>
  );
}
