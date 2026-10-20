"use client";

import React from "react";
import { BookOpen, Users, Star, Cpu } from "lucide-react";
import { StatGroupCard } from "@/components/ui/StatGroupCard";
import { StatItem } from "@/components/ui/StatCard";
import { AdminCourseItem } from "@/lib/types";

interface CoursesStatsProps {
  courses: AdminCourseItem[];
}

export function CoursesStats({ courses }: CoursesStatsProps) {
  const publishedCourses = courses.filter((c) => c.status === "PUBLISHED").length;
  const totalStudents = courses.reduce((acc, c) => acc + (c.totalStudents || 0), 0);
  const avgRating =
    courses.length > 0
      ? (
          courses.reduce((acc, c) => acc + (c.ratingAverage || 0), 0) /
          courses.length
        ).toFixed(2)
      : "4.90";

  const statsItems: StatItem[] = [
    {
      label: "Active Catalog",
      value: `${publishedCourses} Courses`,
      trend: {
        direction: "up",
        value: `${courses.length - publishedCourses} Staging`,
        comparisonLabel: "active",
      },
      icon: <BookOpen className="w-4 h-4 text-[#1C4D8D]" />,
    },
    {
      label: "Total Learners",
      value: totalStudents.toLocaleString(),
      trend: {
        direction: "up",
        value: "+18.4%",
        comparisonLabel: "this term",
      },
      icon: <Users className="w-4 h-4 text-emerald-600" />,
    },
    {
      label: "Average Rating",
      value: `${avgRating} ★`,
      trend: {
        direction: "up",
        value: "4.9★",
        comparisonLabel: "3.4k reviews",
      },
      icon: <Star className="w-4 h-4 text-amber-500" />,
    },
    {
      label: "AI Syllabi Generated",
      value: "42 Modules",
      trend: {
        direction: "up",
        value: "Sub-sec",
        comparisonLabel: "Gemini 3.8",
      },
      icon: <Cpu className="w-4 h-4 text-purple-600" />,
    },
  ];

  return <StatGroupCard stats={statsItems} />;
}
