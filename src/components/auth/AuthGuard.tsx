"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, logout, setInitialized } from "@/store/slices/authSlice";
import { authApi } from "@/lib/api";

const PUBLIC_AUTH_ROUTES = ["/login", "/forgot-password", "/reset-password"];

export function isPublicAuthRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return PUBLIC_AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isClientReady, setIsClientReady] = useState(false);

  const isAuthRoute = isPublicAuthRoute(pathname);

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
              if (!isAuthRoute) {
                router.replace("/login");
              }
            }
          });
      } else {
        dispatch(setInitialized(true));
        if (!isAuthRoute) {
          router.replace("/login");
        }
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
    } finally {
      setIsClientReady(true);
    }
  }, [dispatch, pathname, router, isAuthRoute]);

  // If on public auth route, render immediately without guard check
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Once client check completes and user is confirmed unauthenticated on protected route,
  // hide content while router redirects to /login
  if (isClientReady && !isAuthenticated && !isAuthRoute) {
    return null;
  }

  // Both SSR and initial client hydration render children consistently:
  // Zero hydration mismatch, zero flash of ugly authentication splash card!
  return <>{children}</>;
}
