"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { TablePagination } from "@/components/ui/TablePagination";
import { useUrlParams } from "@/lib/useUrlParams";
import { DetailCard } from "@/components/ui/DetailCard";
import { InstructorCourseRow, InstructorReviewRow } from "./instructorDetailsData";
import { TabFilterBar } from "./TabFilterBar";
import { ReviewSummary } from "./reviews/ReviewSummary";
import { ReviewListItem } from "./reviews/ReviewListItem";

const PAGE_SIZE = 6;

interface InstructorReviewsTabProps {
  reviews: InstructorReviewRow[];
  courses: InstructorCourseRow[];
}

export function InstructorReviewsTab({ reviews, courses }: InstructorReviewsTabProps) {
  const { get, getPage, set } = useUrlParams();
  const query = get("q");
  const course = get("course", "All");
  const rating = get("rating", "All");
  const page = getPage();
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  const visible = useMemo(() => reviews.filter((r) => !hiddenIds.includes(r.id)), [reviews, hiddenIds]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return visible.filter(
      (r) =>
        (!q ||
          r.comment.toLowerCase().includes(q) ||
          r.studentName.toLowerCase().includes(q) ||
          r.course.title.toLowerCase().includes(q)) &&
        (course === "All" || r.course.id === course) &&
        (rating === "All" || r.rating === Number(rating))
    );
  }, [visible, query, course, rating]);

  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleHide = (review: InstructorReviewRow) => {
    setHiddenIds((prev) => [...prev, review.id]);
    toast.success("Review hidden", {
      description: `${review.studentName}'s review is no longer shown publicly.`,
      action: {
        label: "Undo",
        onClick: () => setHiddenIds((prev) => prev.filter((id) => id !== review.id)),
      },
    });
  };

  return (
    <DetailCard
      title={`Reviews (${visible.length.toLocaleString()})`}
      description="What students are saying about this instructor."
      action={visible.length > 0 ? <ReviewSummary reviews={visible} /> : undefined}
      bodyClassName="space-y-4"
    >
      <TabFilterBar
        className="pt-4 border-t border-dash"
        search={{
          value: query,
          placeholder: "Search reviews...",
          onChange: (q) => set({ q, page: null }),
          className: "md:w-96",
        }}
        filters={[
          {
            key: "course",
            value: course,
            options: [
              { value: "All", label: "All Courses" },
              ...courses.map((c) => ({ value: c.id, label: c.title })),
            ],
            onChange: (value) => set({ course: value, page: null }),
          },
          {
            key: "rating",
            value: rating,
            options: [
              { value: "All", label: "All Ratings" },
              ...[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} Star${n > 1 ? "s" : ""}` })),
            ],
            onChange: (value) => set({ rating: value, page: null }),
            className: "md:w-48",
          },
        ]}
        onReset={() => set({ q: null, course: null, rating: null, page: null })}
      />

      <div className="rounded-lg border border-dash overflow-hidden">
        {rows.length > 0 ? (
          <ul className="divide-y divide-dash px-4">
            {rows.map((review) => (
              <ReviewListItem key={review.id} review={review} onHide={handleHide} />
            ))}
          </ul>
        ) : (
          <p className="body-sm-regular text-primary-300 text-center py-10">
            {visible.length === 0 ? "This instructor has no reviews yet." : "No reviews match your filters."}
          </p>
        )}
        <TablePagination
          currentPage={page}
          pageSize={PAGE_SIZE}
          totalCount={filtered.length}
          itemLabel="reviews"
          onPageChange={(next) => set({ page: next })}
        />
      </div>
    </DetailCard>
  );
}

export default InstructorReviewsTab;
