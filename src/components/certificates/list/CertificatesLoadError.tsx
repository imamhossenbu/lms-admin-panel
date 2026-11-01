"use client";

import React from "react";
import { CloudOff, RotateCw } from "lucide-react";
import { SecondaryButton } from "@/components/ui/secondary-button";

/** Shown when the certificates can't be read; offers a retry. */
export function CertificatesLoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="dashboard-card shadow-2xs flex flex-col items-center gap-3 p-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-14 text-red">
        <CloudOff className="h-6 w-6" />
      </span>
      <h2 className="heading-h5 text-primary-500">Couldn&apos;t load certificates</h2>
      <p className="max-w-md body-sm-regular text-primary-300">{message}</p>
      <SecondaryButton className="mt-2" onClick={onRetry} leftIcon={<RotateCw className="h-4 w-4" />}>
        Try Again
      </SecondaryButton>
    </div>
  );
}

export default CertificatesLoadError;
