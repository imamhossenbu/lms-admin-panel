"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, logout, setInitialized } from "@/store/slices/authSlice";
import { authApi } from "@/lib/api";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("admin_token");
      const storedUserJson = localStorage.getItem("admin_user");

      if (storedToken) {
        let user = null;
        if (storedUserJson) {
          try {
            user = JSON.parse(storedUserJson);
          } catch {
            user = { name: "Administrator", email: "admin@lms.com", role: "ADMIN" };
          }
        } else {
          user = { name: "Administrator", email: "admin@lms.com", role: "ADMIN" };
        }

        dispatch(
          setCredentials({
            user,
            token: storedToken,
          })
        );

        // Silent background session check with backend
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
      } else {
        dispatch(setInitialized(true));
        if (pathname !== "/login") {
          router.replace("/login");
        }
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
    } finally {
      setIsClientReady(true);
    }
  }, [dispatch, pathname, router]);

  // If on login route, render immediately without guard check
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // On protected routes during SSR or before hydration:
  // If user has token in localStorage, render children immediately (which uses native OverviewSkeleton)
  // NEVER show the dark full-screen authentication splash card!
  if (!isClientReady) {
    if (typeof window !== "undefined") {
      const hasToken = !!localStorage.getItem("admin_token");
      if (hasToken) {
        return <>{children}</>;
      }
    }
    // Minimal empty fallback while redirecting unauthenticated users to /login
    return null;
  }

  // If client ready and not authenticated on a protected route, redirect to login
  if (!isAuthenticated && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
