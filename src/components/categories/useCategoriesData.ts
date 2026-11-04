"use client";

import { useCallback, useEffect, useState } from "react";
import type { CategoryItem } from "@/types/category";
import { CATEGORIES_UPDATED_EVENT, fetchCategories, getCategoriesSnapshot } from "@/lib/categoryStorage";
import { apiErrorMessage } from "@/lib/apiError";

/** Loads the workspace's categories and keeps them live on CATEGORIES_UPDATED_EVENT. */
export function useCategoriesData() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    fetchCategories().then(
      (list) => {
        if (!alive) return;
        setCategories(list);
        setLoadError(null);
        setIsLoading(false);
      },
      (err) => {
        if (!alive) return;
        setLoadError(apiErrorMessage(err, "We couldn't load the categories. Please try again."));
        setIsLoading(false);
      }
    );
    const onUpdate = () => setCategories(getCategoriesSnapshot());
    window.addEventListener(CATEGORIES_UPDATED_EVENT, onUpdate);
    return () => {
      alive = false;
      window.removeEventListener(CATEGORIES_UPDATED_EVENT, onUpdate);
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setIsLoading(true);
    setLoadError(null);
    setAttempt((n) => n + 1);
  }, []);

  return { categories, isLoading, loadError, retry };
}
