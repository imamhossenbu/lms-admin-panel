"use client";

import type { CategoryFormValues, CategoryItem, CategoryStatus } from "@/types/category";
import { apiClient } from "@/lib/api";

/**
 * Course categories, backed by the Categories API (`/categories`, workspace-scoped). Reads cache what they
 * fetch so getCategoriesSnapshot returns the latest list; every write announces CATEGORIES_UPDATED_EVENT.
 * Errors are Axios errors (show them with apiErrorMessage).
 */

export const CATEGORIES_UPDATED_EVENT = "edupro_categories_updated";

interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  status: string;
  _count?: { courses: number };
  publishedCourses?: number;
}

const announce = () => typeof window !== "undefined" && window.dispatchEvent(new Event(CATEGORIES_UPDATED_EVENT));
const toStatus = (s: string): CategoryStatus => (s === "INACTIVE" ? "Inactive" : "Active");
const fromStatus = (s: CategoryStatus) => (s === "Inactive" ? "INACTIVE" : "ACTIVE");

export function toCategoryItem(c: ApiCategory): CategoryItem {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    iconId: c.icon || "other",
    status: toStatus(c.status),
    totalCourses: c._count?.courses ?? 0,
    publishedCourses: c.publishedCourses ?? 0,
  };
}

const toBody = (v: CategoryFormValues) => ({
  name: v.name.trim(),
  slug: v.slug.trim(),
  description: v.description.trim(),
  icon: v.iconId,
  status: fromStatus(v.status),
});

let cache: CategoryItem[] = [];

export const getCategoriesSnapshot = (): CategoryItem[] => cache;

/** Every category of the workspace, A→Z, with course counts. */
export async function fetchCategories(): Promise<CategoryItem[]> {
  const { data } = await apiClient.get<ApiCategory[]>("/categories");
  cache = data.map(toCategoryItem);
  return cache;
}

export async function createCategory(values: CategoryFormValues): Promise<CategoryItem> {
  const { data } = await apiClient.post<ApiCategory>("/categories", toBody(values));
  const item = toCategoryItem(data);
  cache = [...cache, item];
  announce();
  return item;
}

export async function updateCategory(id: string, values: CategoryFormValues): Promise<CategoryItem> {
  const { data } = await apiClient.patch<ApiCategory>(`/categories/${encodeURIComponent(id)}`, toBody(values));
  const prev = cache.find((c) => c.id === id);
  // PATCH returns the row without counts; keep the known ones.
  const item = { ...toCategoryItem(data), totalCourses: prev?.totalCourses ?? 0, publishedCourses: prev?.publishedCourses ?? 0 };
  cache = cache.map((c) => (c.id === id ? item : c));
  announce();
  return item;
}

/** Refused by the API (409) while courses still use the category. */
export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${encodeURIComponent(id)}`);
  cache = cache.filter((c) => c.id !== id);
  announce();
}
