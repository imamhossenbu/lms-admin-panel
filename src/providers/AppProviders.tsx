"use client";

import React, { useState, useEffect } from "react";
import { ReduxProvider } from "./ReduxProvider";
import { QueryProvider } from "./QueryProvider";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
        {mounted && <Toaster position="top-right" richColors />}
      </QueryProvider>
    </ReduxProvider>
  );
}
