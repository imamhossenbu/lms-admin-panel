"use client";

import React from "react";
import { Mail, EyeOff } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/ui/StarRating";
import { InstructorReviewRow } from "../instructorDetailsData";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";

interface ReviewListItemProps {
  review: InstructorReviewRow;
  onHide: (review: InstructorReviewRow) => void;
}

export function ReviewListItem({ review, onHide }: ReviewListItemProps) {
  return (
    <li className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 lg:items-center py-4">
      <div className="lg:col-span-3 flex items-center gap-3 min-w-0">
        <Avatar src={review.avatarUrl} name={review.studentName} size={48} />
        <div className="min-w-0">
          <p className="body-medium font-semibold text-primary-500 truncate">{review.studentName}</p>
          <p className="body-sm-regular text-primary-300 truncate">{review.course.title}</p>
        </div>
      </div>

      <div className="lg:col-span-2 flex items-center gap-2.5">
        <StarRating rating={review.rating} />
        <span className="body-sm-medium text-primary-500">{review.rating.toFixed(1)}</span>
      </div>

      <p className="lg:col-span-5 body-sm-regular text-primary-400 leading-relaxed">{review.comment}</p>

      <div className="lg:col-span-2 flex items-center justify-between lg:justify-end gap-4">
        <span className="body-sm-regular text-primary-300 whitespace-nowrap">{review.date}</span>
        <RowMoreMenu
          items={[
            {
              key: "email",
              label: "Email Student",
              icon: <Mail className="w-3.5 h-3.5 text-primary-400" />,
              onClick: () => {
                window.location.href = `mailto:${review.studentEmail}`;
              },
            },
            {
              key: "hide",
              label: "Hide Review",
              icon: <EyeOff className="w-3.5 h-3.5" />,
              danger: true,
              separatorBefore: true,
              onClick: () => onHide(review),
            },
          ]}
        />
      </div>
    </li>
  );
}

export default ReviewListItem;
