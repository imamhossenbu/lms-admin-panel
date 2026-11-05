"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { categoriesApi } from "@/lib/api";
import { categoryPathLabel } from "@/lib/categoryStorage";
import { apiErrorMessage } from "@/lib/courseView";
import { instructorsApi } from "@/lib/api/instructors";
import { toInstructorItem } from "@/lib/instructors/instructorView";
import type { CategoryOption } from "@/components/courses/constants";
import type { InstructorItem } from "@/types/instructor";

/** Loads the categories and the workspace's instructors the page depends on. */
export function useCreateCourseData() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [instructors, setInstructors] = useState<InstructorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const loadInstructors = async () => {
      try {
        const res = await instructorsApi.list({ limit: 100, sortBy: "name", sortOrder: "asc" });
        if (alive) setInstructors(res.data.map((i, idx) => toInstructorItem(i, idx)));
      } catch (err) {
        if (alive) toast.error("Couldn't load instructors", { description: apiErrorMessage(err, "Please refresh the page to try again.") });
      }
    };

    const load = async () => {
      try {
        const fetched = await categoriesApi.getAll();
        const list: CategoryOption[] = (Array.isArray(fetched) ? fetched : []).map(
          (c: { id: string; name: string; slug: string; parentId?: string | null }, _i: number, all: { id: string; name: string; parentId?: string | null }[]) => ({
            id: c.id,
            // Sub-categories read "Parent › Child".
            name: categoryPathLabel(c, all),
            slug: c.slug,
          })
        );
        if (alive) setCategories(list);
      } catch (err) {
        if (alive) {
          toast.error("Couldn't load categories", {
            description: apiErrorMessage(err, "Please refresh the page to try again."),
          });
        }
      }
    };

    void Promise.all([load(), loadInstructors()]).finally(() => alive && setIsLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  /** Adds a category created inline (e.g. "+ Add New Category" on step 4) without refetching. */
  const addCategory = useCallback((category: CategoryOption) => {
    setCategories((prev) => (prev.some((c) => c.id === category.id) ? prev : [...prev, category]));
  }, []);

  return { categories, instructors, isLoading, addCategory };
}
