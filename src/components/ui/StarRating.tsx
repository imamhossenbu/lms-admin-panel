import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASS = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-6 h-6" };

export function StarRating({ rating, max = 5, size = "md", className }: StarRatingProps) {
  const rounded = Math.round(rating);
  return (
    <div className={cn("inline-flex items-center gap-0.5 shrink-0", className)} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(
            SIZE_CLASS[size],
            i < rounded ? "text-yellow fill-current" : "text-slate-200 fill-current"
          )}
        />
      ))}
    </div>
  );
}

export default StarRating;
