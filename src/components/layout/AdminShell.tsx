"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { AuthGuard, isPublicAuthRoute } from "@/components/auth/AuthGuard";
import { BillingStatusBanner } from "@/components/billing/banner/BillingStatusBanner";
import { SuspendedAccountGate } from "@/components/billing/banner/SuspendedAccountGate";

function AdminShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = isPublicAuthRoute(pathname);

  if (isAuthPage) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-bg">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-gray-bg">
          <BillingStatusBanner />
          <AdminNavbar />
          <main className="p-3 flex-1 max-w-400 w-full mx-auto">
            <SuspendedAccountGate>{children}</SuspendedAccountGate>
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
        <div className="flex min-h-screen items-center justify-center bg-gray-bg">
          <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
        </div>
      }
    >
      <AdminShellContent>{children}</AdminShellContent>
    </Suspense>
  );
}
