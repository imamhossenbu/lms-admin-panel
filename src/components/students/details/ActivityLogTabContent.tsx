"use client";

import React, { useState, useMemo } from "react";
import {
  History,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { AppSelect } from "@/components/ui/AppSelect";
import { CourseBadgeIcon } from "../create/CourseBadgeIcon";
import { ActivityTypeIcon } from "./ActivityTypeIcon";
import { StudentActivityLogItem } from "./mockStudentDetails";

interface ActivityLogTabContentProps {
  activities: StudentActivityLogItem[];
}

export function ActivityLogTabContent({
  activities: initialActivities,
}: ActivityLogTabContentProps) {
  const [activities] =
    useState<StudentActivityLogItem[]>(initialActivities);
  const [activityFilter, setActivityFilter] = useState("All Activities");
  const [timeFilter, setTimeFilter] = useState("All Time");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.activityTitle.toLowerCase().includes(q) ||
        item.details.toLowerCase().includes(q) ||
        item.relatedItemName.toLowerCase().includes(q);

      const matchesActivity =
        activityFilter === "All Activities" ||
        item.activityTitle.toLowerCase().includes(activityFilter.toLowerCase()) ||
        (activityFilter === "Completed Quiz" && item.activityType === "completed_quiz") ||
        (activityFilter === "Submitted Assignment" && item.activityType === "submitted_assignment") ||
        (activityFilter === "Enrolled in Course" && item.activityType === "enrolled_course") ||
        (activityFilter === "Failed Quiz" && item.activityType === "failed_quiz") ||
        (activityFilter === "Account Created" && item.activityType === "account_created");

      return matchesSearch && matchesActivity;
    });
  }, [activities, searchQuery, activityFilter]);

  const columns: ColumnDef<StudentActivityLogItem>[] = [
    {
      key: "number",
      header: "#",
      width: "48px",
      align: "center",
      render: (row) => (
        <span className="body-xsm-medium text-primary-300">
          {row.orderNumber}
        </span>
      ),
    },
    {
      key: "dateTime",
      header: "Date & Time",
      render: (row) => (
        <div className="space-y-0.5 whitespace-nowrap">
          <div className="body-sm-medium font-semibold text-primary-500">
            {row.date}
          </div>
          <div className="body-2xsm-regular text-primary-300">
            {row.time}
          </div>
        </div>
      ),
    },
    {
      key: "activity",
      header: "Activity",
      width: "70px",
      align: "center",
      render: (row) => <ActivityTypeIcon type={row.activityType} />,
    },
    {
      key: "details",
      header: "Details",
      render: (row) => (
        <div className="space-y-0.5">
          <div className="body-sm-medium font-bold text-primary-500 whitespace-nowrap">
            {row.activityTitle}
          </div>
          <div className="body-2xsm-regular text-primary-400">
            {row.details}
          </div>
        </div>
      ),
    },
    {
      key: "relatedItem",
      header: "Related Item",
      render: (row) => {
        if (!row.relatedItemIcon || row.relatedItemName === "—") {
          return <span className="body-sm-regular text-primary-300">—</span>;
        }

        return (
          <div className="flex items-center gap-3">
            <CourseBadgeIcon type={row.relatedItemIcon} size="md" />
            <div className="space-y-0.5">
              <div className="body-sm-medium font-semibold text-primary-500 whitespace-nowrap">
                {row.relatedItemName}
              </div>
              <div className="body-2xsm-regular text-primary-300 whitespace-nowrap">
                {row.relatedItemType}
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs text-left">
      {/* Header and Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Title with Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="title-medium font-bold text-primary-500">
              Activity Log
            </h2>
            <p className="body-sm-regular text-primary-300">
              A complete history of this student&apos;s activities on the platform.
            </p>
          </div>
        </div>

        {/* Right Toolbar: All Activities + All Time + Search */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <AppSelect
            value={activityFilter}
            onValueChange={setActivityFilter}
            options={[
              "All Activities",
              "Completed Quiz",
              "Submitted Assignment",
              "Enrolled in Course",
              "Failed Quiz",
              "Account Created",
            ]}
          />

          <AppSelect
            value={timeFilter}
            onValueChange={setTimeFilter}
            options={["All Time", "Today", "Last 7 Days", "Last 30 Days"]}
          />

          <div className="relative w-48 sm:w-56">
            <Search className="w-4 h-4 text-primary-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-dash bg-[#F8FAFC] body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>
        </div>
      </div>

      {/* DataTable with Column-wise Borders */}
      <div className="rounded-lg border border-dash overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredActivities}
          verticalBorders={true}
          tableClassName="border-collapse"
        />
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between pt-2">
        <span className="body-sm-regular text-primary-300">
          Showing {filteredActivities.length} of {activities.length} activities
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="w-8 h-8 rounded-lg border border-dash bg-white text-primary-300 flex items-center justify-center body-sm-medium disabled:opacity-50 cursor-not-allowed hover:bg-slate-50 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-blue text-white flex items-center justify-center body-sm-medium font-bold shadow-2xs"
          >
            1
          </button>
          <button
            type="button"
            disabled
            className="w-8 h-8 rounded-lg border border-dash bg-white text-primary-300 flex items-center justify-center body-sm-medium disabled:opacity-50 cursor-not-allowed hover:bg-slate-50 transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
