import React from "react";
import Link from "next/link";
import { SectionCard } from "@/components/ui/SectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { BookOpen, Star, Users, ArrowRight } from "lucide-react";

interface TopCourseItem {
  id: string;
  title: string;
  totalStudents: number;
  ratingAverage: number | string;
  price: number | string;
  status: string;
  category?: string;
}

interface TopCoursesCardProps {
  courses?: TopCourseItem[];
}

const DEFAULT_COURSES: TopCourseItem[] = [
  {
    id: "c-1",
    title: "Fullstack Next.js 16 & AI Mastery",
    totalStudents: 1420,
    ratingAverage: 4.9,
    price: 120,
    status: "PUBLISHED",
    category: "Web Development",
  },
  {
    id: "c-2",
    title: "Python Machine Learning Pro & PyTorch",
    totalStudents: 980,
    ratingAverage: 4.8,
    price: 95,
    status: "PUBLISHED",
    category: "Artificial Intelligence",
  },
  {
    id: "c-3",
    title: "Docker & Kubernetes DevOps Architecture",
    totalStudents: 750,
    ratingAverage: 4.9,
    price: 80,
    status: "PUBLISHED",
    category: "Cloud Engineering",
  },
];

export function TopCoursesCard({ courses }: TopCoursesCardProps) {
  const displayCourses = courses && courses.length > 0 ? courses : DEFAULT_COURSES;

  return (
    <SectionCard
      title="Top Performing Curriculums"
      description="Highest enrollment velocity and student ratings"
      action={
        <Link
          href="/courses"
          className="body-sm-medium text-[#1C4D8D] hover:underline flex items-center gap-1 group"
        >
          <span>Manage Catalog</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      }
    >
      <div className="space-y-3 pt-1">
        {displayCourses.map((c) => (
          <div
            key={c.id}
            className="p-3.5 rounded-[10px] bg-[#F8F9FA] hover:bg-[#F3F4F6] border border-[#EDEDED] flex items-center justify-between gap-3 transition-colors text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-[8px] bg-[#EBF4FC] border border-[#BDE8F5]/60 flex items-center justify-center text-[#1C4D8D] shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="body-sm-medium text-primary-500 font-semibold block truncate">
                  {c.title}
                </span>
                <div className="flex items-center gap-2 mt-0.5 body-xsm-regular subtext-500">
                  <span className="flex items-center gap-0.5 text-amber-600 font-medium">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {c.ratingAverage || "4.8"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Users className="w-3 h-3 text-primary-300" />
                    {Number(c.totalStudents || 0).toLocaleString()} learners
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="body-sm-medium text-primary-500 font-bold block">
                ${c.price}
              </span>
              <ToneBadge tone="success" size="sm" className="mt-0.5 body-xsm-medium uppercase font-bold">
                {c.status || "Active"}
              </ToneBadge>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
