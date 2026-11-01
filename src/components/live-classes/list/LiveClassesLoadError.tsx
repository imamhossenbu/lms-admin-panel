"use client";

import React from "react";
import { CloudOff, RotateCw } from "lucide-react";
import { SecondaryButton } from "@/components/ui/secondary-button";

/** Shown when the live classes can't be read; offers a retry. */
export function LiveClassesLoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="dashboard-card shadow-2xs p-10 flex flex-col items-center text-center gap-3">
      <span className="w-12 h-12 rounded-full bg-red-14 text-red flex items-center justify-center">
        <CloudOff className="w-6 h-6" />
      </span>
      <h2 className="heading-h5 font-bold! text-primary-500">Couldn&apos;t load live classes</h2>
      <p className="body-sm-regular text-primary-300 max-w-md">{message}</p>
      <SecondaryButton className="mt-2" onClick={onRetry} leftIcon={<RotateCw className="w-4 h-4" />}>
        Try Again
      </SecondaryButton>
    </div>
  );
}

export default LiveClassesLoadError;
