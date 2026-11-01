import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";

/** Label above value. */
export function ReviewItem({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="body-xsm-regular text-primary-300">{label}</p>
      <div className="mt-1 body-sm-medium text-primary-500">{children}</div>
    </div>
  );
}

/** Green check "Yes" / red x "No". */
export function YesNoValue({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1.5 text-green">
      <CheckCircle2 className="h-4 w-4" /> Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-red">
      <XCircle className="h-4 w-4" /> No
    </span>
  );
}

export default ReviewItem;
