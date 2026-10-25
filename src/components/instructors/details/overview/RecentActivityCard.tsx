"use client";

import React from "react";
import {
  Clock,
  CirclePlay,
  ClipboardList,
  Pencil,
  Video,
  UserPlus,
  BookOpen,
  Star,
  Wallet,
  Mail,
} from "lucide-react";
import { DetailCard } from "@/components/ui/DetailCard";
import { InstructorTimelineItem, TimelineKind } from "../instructorDetailsData";
import { ViewAllButton } from "./RecentCoursesCard";

const KIND_STYLE: Record<TimelineKind, { icon: React.ReactNode; className: string }> = {
  lesson: { icon: <CirclePlay />, className: "bg-purple-14 text-purple" },
  assignment: { icon: <ClipboardList />, className: "bg-blue-14 text-blue" },
  update: { icon: <Pencil />, className: "bg-purple-14 text-purple" },
  live: { icon: <Video />, className: "bg-yellow-14 text-yellow" },
  enroll: { icon: <UserPlus />, className: "bg-green-bg text-green" },
  course: { icon: <BookOpen />, className: "bg-blue-14 text-blue" },
  review: { icon: <Star />, className: "bg-yellow-14 text-yellow" },
  payout: { icon: <Wallet />, className: "bg-green-bg text-green" },
  message: { icon: <Mail />, className: "bg-blue-14 text-blue" },
};

interface RecentActivityCardProps {
  activities: InstructorTimelineItem[];
  onViewAll: () => void;
}

export function RecentActivityCard({ activities, onViewAll }: RecentActivityCardProps) {
  return (
    <DetailCard icon={<Clock />} title="Recent Activity" action={<ViewAllButton onClick={onViewAll} />}>
      {activities.length > 0 ? (
        <ol className="space-y-4">
          {activities.slice(0, 5).map((activity) => {
            const style = KIND_STYLE[activity.kind];
            return (
              <li key={activity.id} className="flex items-start gap-3">
                <span
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5 ${style.className}`}
                >
                  {style.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="body-sm-medium text-primary-500 leading-snug">{activity.title}</p>
                  {activity.subtitle && (
                    <p className="body-xsm-regular text-primary-300 truncate">{activity.subtitle}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="body-xsm-regular text-primary-300 whitespace-nowrap">{activity.date}</p>
                  {activity.time && (
                    <p className="body-xsm-regular text-primary-300 whitespace-nowrap">{activity.time}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="body-sm-regular text-primary-300 text-center py-6">No recent activity.</p>
      )}
    </DetailCard>
  );
}

export default RecentActivityCard;
