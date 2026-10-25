"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, Pencil, Layers, Send, Archive, Trash2, List, LayoutGrid } from "lucide-react";

import { coursesApi, categoriesApi } from "@/lib/api";
import { AdminCourseItem } from "@/lib/types";
import { useUrlParams } from "@/lib/useUrlParams";
import { COURSE_LEVEL_OPTIONS, COURSE_STATUS_OPTIONS, apiErrorMessage } from "@/lib/courseView";
import { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { ListFilters } from "@/components/ui/ListFilters";
import { TablePagination } from "@/components/ui/TablePagination";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { CoursesSkeleton } from "@/components/courses/CoursesSkeleton";
import { CourseCard } from "@/components/courses/CourseCard";
import { CoursesHeader } from "@/components/courses/list/CoursesHeader";
import { CourseStatsRow } from "@/components/courses/list/CourseStatsRow";
import { CoursesTable } from "@/components/courses/list/CoursesTable";
import { CoursesLoadError } from "@/components/courses/list/CoursesLoadError";

const TABLE_PAGE_SIZES = [10, 20, 50];
const GRID_PAGE_SIZES = [6, 12, 24];
const ICON = "w-3.5 h-3.5 text-primary-400";

function CoursesContent() {
  const router = useRouter();
  const { get, getPage, set } = useUrlParams();

  const [courses, setCourses] = useState<AdminCourseItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<AdminCourseItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const query = get("q");
  const status = get("status", "All");
  const category = get("category", "All");
  const level = get("level", "All");
  const view = get("view") === "grid" ? "grid" : "table";
  const pageSizes = view === "grid" ? GRID_PAGE_SIZES : TABLE_PAGE_SIZES;
  const sizeParam = Number(get("size"));
  const pageSize = pageSizes.includes(sizeParam) ? sizeParam : pageSizes[0];
  const page = getPage();

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [courseData, categoryData] = await Promise.all([
        coursesApi.getAll(),
        categoriesApi.getAll().catch(() => []),
      ]);
      const list: AdminCourseItem[] = Array.isArray(courseData) ? courseData : [];
      setCourses(list);
      const names = Array.isArray(categoryData) ? categoryData.map((c: { name: string }) => c.name) : [];
      setCategories(names.length ? names : Array.from(new Set(list.map((c) => c.category?.name).filter(Boolean) as string[])));
    } catch (error) {
      setLoadError(apiErrorMessage(error, "The course service is not responding. Check your connection and try again."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch from the courses API
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCourses();
  }, [loadCourses]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return courses.filter(
      (c) =>
        (status === "All" || c.status === status) &&
        (category === "All" || c.category?.name === category) &&
        (level === "All" || c.level === level) &&
        (!q ||
          c.title.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.instructorName ?? "").toLowerCase().includes(q))
    );
  }, [courses, query, status, category, level]);

  if (isLoading) return <CoursesSkeleton view={view} />;
  if (loadError) return <CoursesLoadError message={loadError} onRetry={loadCourses} />;

  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const isFiltered = !!query || status !== "All" || category !== "All" || level !== "All";

  const toggleStatus = async (course: AdminCourseItem) => {
    const next = course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setUpdatingId(course.id);
    const toastId = toast.loading(next === "PUBLISHED" ? "Publishing course..." : "Moving to drafts...", {
      description: course.title,
    });
    try {
      await coursesApi.update(course.id, { status: next });
      setCourses((prev) => prev.map((c) => (c.id === course.id ? { ...c, status: next } : c)));
      toast.success(next === "PUBLISHED" ? "Course published" : "Course unpublished", {
        id: toastId,
        description: next === "PUBLISHED" ? "Students can now find and enroll in it." : "It is hidden from students until published again.",
      });
    } catch (error) {
      toast.error("Could not update course", { id: toastId, description: apiErrorMessage(error, "Please try again.") });
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteCourse = async () => {
    if (!deleting) return;
    const course = deleting;
    const toastId = toast.loading("Deleting course...", { description: course.title });
    try {
      await coursesApi.delete(course.id);
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
      toast.success("Course deleted", { id: toastId, description: `"${course.title}" was removed from the catalog.` });
    } catch (error) {
      toast.error("Could not delete course", {
        id: toastId,
        description: apiErrorMessage(error, "The course is still in the catalog. Please try again."),
      });
      throw error;
    }
  };

  const getMenuItems = (course: AdminCourseItem): DropdownActionItem[] => [
    { key: "view", label: "View Details", icon: <Eye className={ICON} />, onClick: () => router.push(`/courses/${course.id}`) },
    { key: "edit", label: "Edit Course", icon: <Pencil className={ICON} />, onClick: () => router.push(`/courses/${course.id}/edit`) },
    { key: "curriculum", label: "Manage Curriculum", icon: <Layers className={ICON} />, onClick: () => router.push(`/courses/${course.id}/edit`) },
    {
      key: "status",
      label: course.status === "PUBLISHED" ? "Unpublish" : "Publish",
      icon: course.status === "PUBLISHED" ? <Archive className={ICON} /> : <Send className={ICON} />,
      separatorBefore: true,
      disabled: updatingId === course.id,
      onClick: () => toggleStatus(course),
    },
    {
      key: "delete",
      label: "Delete Course",
      icon: <Trash2 className="w-3.5 h-3.5" />,
      danger: true,
      separatorBefore: true,
      onClick: () => setDeleting(course),
    },
  ];

  const pagination = (
    <TablePagination
      variant={view === "grid" ? "plain" : "attached"}
      currentPage={page}
      pageSize={pageSize}
      totalCount={filtered.length}
      itemLabel="courses"
      onPageChange={(next) => set({ page: next })}
      onPageSizeChange={(size) => set({ size: size === pageSizes[0] ? null : size, page: null })}
      pageSizeOptions={pageSizes}
    />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-5 text-left pb-8"
    >
      <CoursesHeader
        onCreate={() => router.push("/courses/create")}
        onCategories={() => router.push("/categories")}
      />
      <CourseStatsRow courses={courses} />

      <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-4">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="flex-1 min-w-0">
            <ListFilters
              query={query}
              searchPlaceholder="Search courses by title, slug or instructor..."
              onQueryChange={(q) => set({ q, page: null })}
              selects={[
                {
                  key: "status",
                  value: status,
                  options: [{ value: "All", label: "All Status" }, ...COURSE_STATUS_OPTIONS],
                  onChange: (value) => set({ status: value, page: null }),
                  className: "xl:w-40",
                },
                {
                  key: "category",
                  value: category,
                  options: [{ value: "All", label: "All Categories" }, ...categories],
                  onChange: (value) => set({ category: value, page: null }),
                  className: "xl:w-48",
                },
                {
                  key: "level",
                  value: level,
                  options: [{ value: "All", label: "All Levels" }, ...COURSE_LEVEL_OPTIONS],
                  onChange: (value) => set({ level: value, page: null }),
                  className: "xl:w-40",
                },
              ]}
              onReset={() => set({ q: null, status: null, category: null, level: null, page: null })}
              isFiltered={isFiltered}
            />
          </div>
          <SegmentedControl<"table" | "grid">
            className="self-start h-10"
            value={view}
            onChange={(next) => set({ view: next === "table" ? null : next, size: null, page: null })}
            options={[
              { value: "table", label: "Table view", icon: <List />, iconOnly: true },
              { value: "grid", label: "Grid view", icon: <LayoutGrid />, iconOnly: true },
            ]}
          />
        </div>

        {view === "table" ? (
          <CoursesTable
            courses={rows}
            onView={(course) => router.push(`/courses/${course.id}`)}
            getMenuItems={getMenuItems}
            footer={pagination}
          />
        ) : rows.length > 0 ? (
          <>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
              {rows.map((course, idx) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: "easeOut", delay: Math.min(idx, 8) * 0.04 }}
                >
                <CourseCard
                  course={course}
                  onViewDetails={(c) => router.push(`/courses/${c.id}`)}
                  onEdit={(c) => router.push(`/courses/${c.id}/edit`)}
                  onManageCurriculum={(c) => router.push(`/courses/${c.id}/edit`)}
                  onDelete={(courseId) => setDeleting(courses.find((c) => c.id === courseId) ?? null)}
                />
                </motion.div>
              ))}
              </AnimatePresence>
            </motion.div>
            {pagination}
          </>
        ) : (
          <p className="body-sm-regular text-primary-300 text-center py-12 rounded-lg border border-dashed border-dash">
            {courses.length ? "No courses match your filters." : "No courses yet. Create your first course to get started."}
          </p>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Course"
        subtitle={deleting ? `"${deleting.title}"` : undefined}
        message="This removes the course with its modules, lessons and enrollment records. This action cannot be undone."
        confirmLabel="Delete Course"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="w-4 h-4" />}
        onClose={() => setDeleting(null)}
        onConfirm={deleteCourse}
      />
    </motion.div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<CoursesSkeleton />}>
      <CoursesContent />
    </Suspense>
  );
}
