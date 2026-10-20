import React, { forwardRef, type ButtonHTMLAttributes } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/cn";

export interface RowActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const RowActionButton = forwardRef<HTMLButtonElement, RowActionButtonProps>(
  ({ label, onClick, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      className={cn(
        "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#E9E9E9] bg-white text-primary-500 transition-colors hover:bg-gray-50",
        className
      )}
      {...props}
    >
      <MoreVertical className="h-4 w-4" />
    </button>
  )
);

RowActionButton.displayName = "RowActionButton";
export default RowActionButton;
