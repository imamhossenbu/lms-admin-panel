"use client";

import React, { useState } from "react";
import { Plus, Search, Star, Users, BookOpen } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CreateCourseModal } from "./CreateCourseModal";
import { AdminCourseItem } from "@/lib/types";

const INITIAL_COURSES: AdminCourseItem[] = [
  {
    id: "crs-1",
    title: "Mastering Next.js 16 & Enterprise Architecture",
    slug: "nextjs-16-enterprise",
    price: 99,
    isFree: false,
    status: "PUBLISHED",
    category: { id: "c1", name: "Fullstack Web" },
    totalStudents: 2840,
    ratingAverage: 4.9,
    instructorName: "Tanvir Ahmed",
  },
  {
    id: "crs-2",
    title: "Advanced Gemini & AI Agent Engineering",
    slug: "gemini-ai-agent-engineering",
    price: 129,
    isFree: false,
    status: "PUBLISHED",
    category: { id: "c2", name: "Artificial Intelligence" },
    totalStudents: 1950,
    ratingAverage: 4.95,
    instructorName: "Imam Hossain",
  },
  {
    id: "crs-3",
    title: "Foundations of TypeScript 6 & Clean Code",
    slug: "typescript-foundations",
    price: 0,
    isFree: true,
    status: "PUBLISHED",
    category: { id: "c1", name: "Software Engineering" },
    totalStudents: 4890,
    ratingAverage: 4.8,
    instructorName: "Dr. Farhana Yasmin",
  },
  {
    id: "crs-4",
    title: "Docker, Kubernetes & Production CI/CD",
    slug: "devops-docker-kubernetes",
    price: 79,
    isFree: false,
    status: "DRAFT",
    category: { id: "c3", name: "Cloud & DevOps" },
    totalStudents: 0,
    ratingAverage: 0,
    instructorName: "Engr. Mahmudul Huq",
  },
];

export function CoursesGridClient() {
  const [courses, setCourses] = useState<AdminCourseItem[]>(INITIAL_COURSES);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-dash body-sm-regular bg-white"
          />
        </div>

        <PrimaryButton
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Course
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="dashboard-card p-5 flex flex-col justify-between hover:border-brand-primary transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <ToneBadge tone="ice" size="sm">{course.category.name}</ToneBadge>
                <ToneBadge tone={course.status === "PUBLISHED" ? "success" : "warning"} size="sm">
                  {course.status}
                </ToneBadge>
              </div>

              <h4 className="title-sm text-brand-navy mb-1.5 line-clamp-2">{course.title}</h4>
              <p className="body-xsm-regular text-muted mb-4">By {course.instructorName}</p>
            </div>

            <div className="pt-3 border-t border-dash flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 body-xsm-medium text-muted">
                  <Users className="w-3.5 h-3.5" />
                  {course.totalStudents.toLocaleString()}
                </span>
                {course.ratingAverage > 0 && (
                  <span className="flex items-center gap-1 body-xsm-medium text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {course.ratingAverage}
                  </span>
                )}
              </div>

              <span className="body-sm-medium text-brand-navy font-bold">
                {course.isFree ? "Free" : `$${course.price}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      <CreateCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(newCourse) => setCourses((prev) => [newCourse, ...prev])}
      />
    </div>
  );
}
