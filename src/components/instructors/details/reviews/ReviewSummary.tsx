import React from "react";
import { StarRating } from "@/components/ui/StarRating";
import { InstructorReviewRow } from "../instructorDetailsData";

export function ReviewSummary({ reviews }: { reviews: InstructorReviewRow[] }) {
  const total = reviews.length;
  const average = total ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  const counts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
      <div className="rounded-xl border border-dash px-8 py-4 text-center shrink-0">
        <p className="heading-h3 font-bold text-primary-500">{average.toFixed(1)}</p>
        <StarRating rating={average} size="lg" className="my-1.5" />
        <p className="body-sm-regular text-primary-400">{total.toLocaleString()} reviews</p>
      </div>

      <div className="space-y-1.5 w-full sm:w-80">
        {counts.map(({ stars, count }) => (
          <div key={stars} className="flex items-center gap-3">
            <span className="body-sm-regular text-primary-400 w-12 shrink-0">{stars} star</span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue"
                style={{ width: total ? `${(count / total) * 100}%` : "0%" }}
              />
            </div>
            <span className="body-sm-regular text-primary-400 w-8 text-right shrink-0">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSummary;
