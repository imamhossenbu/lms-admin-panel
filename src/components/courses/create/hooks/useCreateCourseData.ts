"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { categoriesApi } from "@/lib/api";
import { apiErrorMessage } from "@/lib/courseView";
import { getStoredInstructors, INSTRUCTORS_UPDATED_EVENT } from "@/lib/instructorStorage";
import type { CategoryOption } from "@/components/courses/constants";
import type { InstructorItem } from "@/types/instructor";

/** Loads the categories (backend) and instructor list (local store) the page depends on. */
export function useCreateCourseData() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [instructors, setInstructors] = useState<InstructorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const fetched = await categoriesApi.getAll();
        const list: CategoryOption[] = (Array.isArray(fetched) ? fetched : []).map(
          (c: { id: string; name: string; slug: string }) => ({ id: c.id, name: c.name, slug: c.slug })
        );
        if (alive) setCategories(list);
      } catch (err) {
        if (alive) {
          toast.error("Couldn't load categories", {
            description: apiErrorMessage(err, "Please refresh the page to try again."),
          });
        }
      } finally {
        if (alive) {
          setInstructors(getStoredInstructors());
          setIsLoading(false);
        }
      }
    };

    const syncInstructors = () => setInstructors(getStoredInstructors());
    window.addEventListener(INSTRUCTORS_UPDATED_EVENT, syncInstructors);
    void load();

    return () => {
      alive = false;
      window.removeEventListener(INSTRUCTORS_UPDATED_EVENT, syncInstructors);
    };
  }, []);

  return { categories, instructors, isLoading };
}
