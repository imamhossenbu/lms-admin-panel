"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, logout, setInitialized } from "@/store/slices/authSlice";
import { authApi } from "@/lib/api";
import { GraduationCap, ShieldCheck } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("admin_token");
        const storedUserJson = localStorage.getItem("admin_user");

        if (storedToken && storedUserJson) {
          try {
            const parsedUser = JSON.parse(storedUserJson);
            dispatch(
              setCredentials({
                user: parsedUser,
                token: storedToken,
              })
            );

            // Re-verify in background with backend
            authApi
              .getProfile()
              .then((freshProfile) => {
                dispatch(
                  setCredentials({
                    user: freshProfile,
                    token: storedToken,
                  })
                );
              })
              .catch((err) => {
                if (err.response?.status === 401) {
                  dispatch(logout());
                  if (pathname !== "/login") {
                    router.replace("/login");
                  }
                }
              });
          } catch {
            dispatch(logout());
          }
        } else {
          dispatch(setInitialized(true));
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setChecking(false);
      }
    };

    initAuth();
  }, [dispatch, pathname, router]);

  useEffect(() => {
    if (checking) return;

    const isAuthRoute = pathname === "/login";

    if (!isAuthenticated && !isAuthRoute) {
      router.replace("/login");
    } else if (isAuthenticated && isAuthRoute) {
      router.replace("/");
    }
  }, [isAuthenticated, pathname, checking, router]);

  // Loading Splash Screen while determining auth state
  if (checking || (!isInitialized && pathname !== "/login")) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#071326] text-white">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1C4D8D] to-[#4988C4] flex items-center justify-center shadow-2xl shadow-[#1C4D8D]/50 border border-[#BDE8F5]/30 animate-pulse">
            <GraduationCap className="w-10 h-10 text-[#BDE8F5]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#071326] flex items-center justify-center shadow-md">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-white">
            LMS AI Enterprise
          </h2>
          <p className="text-sm text-[#BDE8F5]/70">
            Verifying administrative telemetry session...
          </p>
        </div>

        <div className="mt-6 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#4988C4] animate-ping" />
          <span className="w-2 h-2 rounded-full bg-[#BDE8F5]" />
          <span className="w-2 h-2 rounded-full bg-[#1C4D8D]" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
