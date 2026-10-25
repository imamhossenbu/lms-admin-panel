"use client";

import React from "react";
import { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { InstructorFullDetails, InstructorCourseRow } from "./instructorDetailsData";
import { InstructorTabKey } from "./InstructorDetailsTabs";
import { InstructorInfoCard } from "./overview/InstructorInfoCard";
import { RecentCoursesCard } from "./overview/RecentCoursesCard";
import { RecentStudentsCard } from "./overview/RecentStudentsCard";
import { AccountAccessCard } from "./overview/AccountAccessCard";
import { AdditionalInfoCard } from "./overview/AdditionalInfoCard";
import { RecentActivityCard } from "./overview/RecentActivityCard";

interface InstructorOverviewTabProps {
  details: InstructorFullDetails;
  onNavigate: (tab: InstructorTabKey, params?: Record<string, string>) => void;
  getCourseActions: (course: InstructorCourseRow) => DropdownActionItem[];
}

export function InstructorOverviewTab({ details, onNavigate, getCourseActions }: InstructorOverviewTabProps) {
  const { instructor } = details;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <div className="xl:col-span-8 space-y-6">
        <InstructorInfoCard instructor={instructor} />
        <RecentCoursesCard
          courses={details.courses}
          onViewAll={() => onNavigate("courses")}
          onViewCourse={(course) => onNavigate("courses", { q: course.title })}
          getCourseActions={getCourseActions}
        />
        <RecentStudentsCard students={details.students} onViewAll={() => onNavigate("students")} />
      </div>

      <div className="xl:col-span-4 space-y-6">
        <AccountAccessCard email={instructor.email} account={details.account} />
        <AdditionalInfoCard
          specialization={instructor.expertise}
          website={details.website}
          socials={details.socials}
        />
        <RecentActivityCard activities={details.activities} onViewAll={() => onNavigate("activity-log")} />
      </div>
    </div>
  );
}

export default InstructorOverviewTab;
