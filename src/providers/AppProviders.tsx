"use client";

import React from "react";
import { ReduxProvider } from "./ReduxProvider";
import { QueryProvider } from "./QueryProvider";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
        <Toaster position="top-right" richColors />
      </QueryProvider>
    </ReduxProvider>
  );
}
