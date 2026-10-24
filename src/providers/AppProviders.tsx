"use client";

import React, { useState, useEffect } from "react";
import { ReduxProvider } from "./ReduxProvider";
import { QueryProvider } from "./QueryProvider";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
        {mounted && (
          <>
            <HotToaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: "#ffffff",
                  color: "#0F172A",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 500,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                },
              }}
            />
            <SonnerToaster position="top-right" richColors />
          </>
        )}
      </QueryProvider>
    </ReduxProvider>
  );
}
