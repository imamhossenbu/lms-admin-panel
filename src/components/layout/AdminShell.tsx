"use client";

import React, { Suspense, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { TeacherShell } from "@/components/teacher/TeacherShell";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { AuthGuard, isPublicAuthRoute } from "@/components/auth/AuthGuard";
import { BillingStatusBanner } from "@/components/billing/banner/BillingStatusBanner";
import { SuspendedAccountGate } from "@/components/billing/banner/SuspendedAccountGate";

const isTeacherRole = (role?: string | null) => (role ?? "").toUpperCase() === "TEACHER";

function AdminShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = useAppSelector((s) => s.auth.user?.role);
  const isAuthPage = isPublicAuthRoute(pathname);
  const teacher = isTeacherRole(role);
  const onTeach = pathname === "/teach" || pathname.startsWith("/teach/");

  // Teachers live in /teach; admins never land there.
  useEffect(() => {
    if (isAuthPage || !role) return;
    if (teacher && !onTeach) router.replace("/teach");
    if (!teacher && onTeach) router.replace("/");
  }, [isAuthPage, role, teacher, onTeach, router]);

  if (isAuthPage) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  if (teacher) {
    return <AuthGuard>{onTeach ? <TeacherShell>{children}</TeacherShell> : null}</AuthGuard>;
  }
  if (onTeach) return <AuthGuard>{null}</AuthGuard>;

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
