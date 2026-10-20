"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, BookOpen } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { CreateCourseModal } from "./CreateCourseModal";
import { AiSyllabusModal } from "./AiSyllabusModal";
import { CourseDetailsModal } from "./CourseDetailsModal";
import { CurriculumBuilderModal } from "./CurriculumBuilderModal";
import { CoursesStats } from "./CoursesStats";
import { CoursesFilterToolbar } from "./CoursesFilterToolbar";
import { CourseTableView } from "./CourseTableView";
import { DeleteCourseModal } from "./DeleteCourseModal";
import { CategoryManagementModal } from "@/components/categories/CategoryManagementModal";
import { Pagination } from "@/components/ui/Pagination";
import PrimaryButton from "@/components/ui/primary-button";
import { AdminCourseItem, CourseModuleItem, CourseLessonItem } from "@/lib/types";
import { coursesApi, categoriesApi } from "@/lib/api";
import { toast } from "sonner";
import { CoursesSkeleton } from "./CoursesSkeleton";

import { useRouter } from "next/navigation";

export interface CoursesGridClientProps {
  isCreateModalOpen?: boolean;
  setIsCreateModalOpen?: (open: boolean) => void;
  isAiModalOpen?: boolean;
  setIsAiModalOpen?: (open: boolean) => void;
  isCategoryModalOpen?: boolean;
  setIsCategoryModalOpen?: (open: boolean) => void;
  refreshTrigger?: number;
}

export function CoursesGridClient({
  isCreateModalOpen: propCreateOpen,
  setIsCreateModalOpen: propSetCreateOpen,
  isAiModalOpen: propAiOpen,
  setIsAiModalOpen: propSetAiOpen,
  isCategoryModalOpen: propCategoryOpen,
  setIsCategoryModalOpen: propSetCategoryOpen,
  refreshTrigger,
}: CoursesGridClientProps = {}) {
  const router = useRouter();
  const [courses, setCourses] = useState<AdminCourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Local modal states (fallbacks when not provided by parent)
  const [localCreateOpen, setLocalCreateOpen] = useState(false);
  const [localAiOpen, setLocalAiOpen] = useState(false);
  const [localCategoryOpen, setLocalCategoryOpen] = useState(false);

  const isCreateOpen = propCreateOpen !== undefined ? propCreateOpen : localCreateOpen;
  const setCreateOpen = propSetCreateOpen || setLocalCreateOpen;

  const isAiOpen = propAiOpen !== undefined ? propAiOpen : localAiOpen;
  const setAiOpen = propSetAiOpen || setLocalAiOpen;

  const isCategoryOpen = propCategoryOpen !== undefined ? propCategoryOpen : localCategoryOpen;
  const setCategoryOpen = propSetCategoryOpen || setLocalCategoryOpen;

  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<AdminCourseItem | null>(null);
  const [selectedCourseForAi, setSelectedCourseForAi] = useState<AdminCourseItem | null>(null);
  const [selectedCourseForCurriculum, setSelectedCourseForCurriculum] = useState<AdminCourseItem | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<AdminCourseItem | null>(null);

  // Load courses & categories from backend
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const data = await coursesApi.getAll();
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.warn("Failed to fetch real courses catalog:", err);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await categoriesApi.getAll();
      if (Array.isArray(cats)) {
        setCategories(cats.map((c) => ({ id: c.id, name: c.name })));
      }
    } catch (err) {
      console.warn("Failed to fetch real categories for courses grid:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [refreshTrigger]);

  const handleCreateCourse = (newCourse: AdminCourseItem) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  const handleDeleteCourse = async (course: AdminCourseItem) => {
    try {
      await coursesApi.delete(course.id);
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
      toast.success("Course Deleted", {
        description: `"${course.title}" was removed from the catalog.`,
      });
    } catch {
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
      toast.success("Course Deleted (Local Sync)");
    }
  };

  const handleApplyAiOutline = async (courseTitle: string, outline: any) => {
    let targetCourse = selectedCourseForAi;
    if (!targetCourse) {
      targetCourse =
        courses.find(
          (c) => c.title.toLowerCase() === courseTitle.toLowerCase()
        ) || null;
    }

    const toastId = toast.loading("Applying AI Curriculum to database...");

    try {
      let courseIdToUse = targetCourse?.id;

      if (!courseIdToUse) {
        // Create course on backend first
        const createdCourse = await coursesApi.create({
          title: courseTitle,
          slug: courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          price: 99,
          isFree: false,
          status: "PUBLISHED",
          level: outline.level || "INTERMEDIATE",
          description: outline.summary || "AI Synthesized Curriculum Outline",
          thumbnail:
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
        });
        courseIdToUse = createdCourse?.id;
      }

      if (courseIdToUse && Array.isArray(outline.modules)) {
        for (let i = 0; i < outline.modules.length; i++) {
          const rawMod = outline.modules[i];
          const modOrder = i + 1;
          const modTitle = (rawMod.title || rawMod.moduleTitle || `Module ${modOrder}`).trim();
          const modDesc = rawMod.description || "";

          const createdMod = await coursesApi.createModule(courseIdToUse, {
            title: modTitle,
            description: modDesc,
            order: modOrder,
          });

          if (createdMod?.id && Array.isArray(rawMod.lessons)) {
            for (let j = 0; j < rawMod.lessons.length; j++) {
              const rawLes = rawMod.lessons[j];
              const lesTitle = (
                typeof rawLes === "string"
                  ? rawLes
                  : rawLes.title || (rawLes as any).summary || `Lesson ${j + 1}`
              ).trim();
              const lesType =
                typeof rawLes === "object" && rawLes.type ? rawLes.type : "VIDEO";
              const lesDuration =
                typeof rawLes === "object" && rawLes.durationMinutes
                  ? Number(rawLes.durationMinutes)
                  : 15;
              const lesContent =
                typeof rawLes === "object"
                  ? rawLes.content || rawLes.summary || null
                  : null;

              await coursesApi.createLesson(courseIdToUse, createdMod.id, {
                title: lesTitle,
                type: lesType,
                durationMinutes: lesDuration,
                order: j + 1,
                content: lesContent,
              });
            }
          }
        }
      }

      setAiOpen(false);
      setSelectedCourseForAi(null);
      await fetchCourses();

      toast.success("AI Curriculum Synchronized!", {
        id: toastId,
        description: `Modular outline successfully saved in database for "${courseTitle}".`,
      });

      if (courseIdToUse) {
        router.push(`/courses/${courseIdToUse}/edit`);
      }
    } catch (err: any) {
      console.error("AI Catalog Outline error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to apply AI outline", {
        id: toastId,
      });
      await fetchCourses();
    }
  };

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.instructorName &&
          course.instructorName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        categoryFilter === "ALL" ||
        (course.category && course.category.name === categoryFilter);

      const matchesLevel =
        levelFilter === "ALL" || course.level === levelFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && course.status === "PUBLISHED") ||
        (statusFilter === "DRAFT" && course.status === "DRAFT") ||
        (statusFilter === "FREE" && course.isFree);

      return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
    });
  }, [courses, searchQuery, categoryFilter, levelFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / pageSize) || 1;
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCourses.slice(startIndex, startIndex + pageSize);
  }, [filteredCourses, currentPage, pageSize]);

  const categoryOptions = [
    { label: "All Academic Disciplines", value: "ALL" },
    ...categories.map((c) => ({ label: c.name, value: c.name })),
  ];

  const statusTabs = [
    { id: "ALL", label: `All Catalog (${courses.length})` },
    {
      id: "PUBLISHED",
      label: `Published (${courses.filter((c) => c.status === "PUBLISHED").length})`,
    },
    {
      id: "DRAFT",
      label: `Drafts (${courses.filter((c) => c.status === "DRAFT").length})`,
    },
    {
      id: "FREE",
      label: `Free Open-Access (${courses.filter((c) => c.isFree).length})`,
    },
  ];

  if (isLoading) {
    return <CoursesSkeleton showHeader={false} />;
  }

  return (
    <div className="space-y-6 text-left">
      {/* KPI Stats Overview */}
      <CoursesStats courses={courses} />

      {/* Filter and View Toolbar */}
      <CoursesFilterToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categoryOptions={categoryOptions}
        levelFilter={levelFilter}
        onLevelFilterChange={setLevelFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusTabs={statusTabs}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Course Catalog View (Grid / Table) */}
      {paginatedCourses.length === 0 ? (
        <div className="py-16 text-center rounded-[12px] border-2 border-dashed border-[#EDEDED] bg-[#F8F9FA]/40 space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1C4D8D] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="body-md-medium text-primary-500 font-bold">
              No matching courses found
            </h4>
            <p className="body-sm-regular subtext-500 mt-1">
              Try adjusting your search filters or add a new course to your catalog.
            </p>
          </div>
          <PrimaryButton
            onClick={() => router.push("/courses/create")}
            icon={<Plus className="w-4 h-4" />}
          >
            Create Course
          </PrimaryButton>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onViewDetails={(c) => router.push(`/courses/${c.id}`)}
              onEdit={(c) => router.push(`/courses/${c.id}/edit`)}
              onGenerateOutline={(c) => {
                setSelectedCourseForAi(c);
                setAiOpen(true);
              }}
              onManageCurriculum={(c) => router.push(`/courses/${c.id}/edit`)}
              onDelete={(id) => {
                const found = courses.find((item) => item.id === id);
                if (found) setDeletingCourse(found);
              }}
            />
          ))}
        </div>
      ) : (
        <CourseTableView
          courses={paginatedCourses}
          onViewDetails={(c) => router.push(`/courses/${c.id}`)}
          onEditCourse={(c) => router.push(`/courses/${c.id}/edit`)}
          onManageCurriculum={(c) => router.push(`/courses/${c.id}/edit`)}
          onOpenAiOutline={(c) => {
            setSelectedCourseForAi(c);
            setAiOpen(true);
          }}
          onDeleteCourse={setDeletingCourse}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="body-sm-regular text-primary-400">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredCourses.length)} of{" "}
            {filteredCourses.length} courses
          </span>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredCourses.length}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateCourse}
      />

      {/* Course Details Modal */}
      <CourseDetailsModal
        isOpen={Boolean(selectedCourseForDetails)}
        onClose={() => setSelectedCourseForDetails(null)}
        course={selectedCourseForDetails}
        onOpenAiOutline={(c) => {
          setSelectedCourseForAi(c);
          setAiOpen(true);
        }}
        onManageCurriculum={setSelectedCourseForCurriculum}
      />

      {/* AI Syllabus Generator Modal */}
      <AiSyllabusModal
        isOpen={isAiOpen}
        onClose={() => {
          setAiOpen(false);
          setSelectedCourseForAi(null);
        }}
        defaultTitle={selectedCourseForAi?.title || ""}
        onApplyOutline={handleApplyAiOutline}
      />

      {/* Curriculum & Lessons Builder Modal */}
      <CurriculumBuilderModal
        isOpen={Boolean(selectedCourseForCurriculum)}
        onClose={() => setSelectedCourseForCurriculum(null)}
        course={selectedCourseForCurriculum}
        onCurriculumUpdated={() => {
          fetchCourses();
        }}
      />

      {/* Category Management Hub Modal */}
      <CategoryManagementModal
        isOpen={isCategoryOpen}
        onClose={() => setCategoryOpen(false)}
        onCategoryCreated={() => {
          fetchCategories();
        }}
      />

      {/* Delete Course Confirmation Modal */}
      <DeleteCourseModal
        isOpen={Boolean(deletingCourse)}
        onClose={() => setDeletingCourse(null)}
        course={deletingCourse}
        onConfirm={handleDeleteCourse}
      />
    </div>
  );
}

export default CoursesGridClient;
