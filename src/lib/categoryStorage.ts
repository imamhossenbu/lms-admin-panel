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
  parentId?: string | null;
  createdAt?: string;
  _count?: { courses: number; children?: number };
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
    parentId: c.parentId ?? null,
    subCategoryCount: c._count?.children ?? 0,
    createdAt: c.createdAt ?? "",
  };
}

/**
 * Tree order: each top-level category (A→Z) followed by its sub-categories (A→Z). Sub-categories whose parent
 * isn't in `items` (e.g. filtered out) follow at the end.
 */
export function inTreeOrder<T extends { id: string; name: string; parentId: string | null }>(items: T[]): T[] {
  const byName = (a: T, b: T) => a.name.localeCompare(b.name);
  const ids = new Set(items.map((c) => c.id));
  const roots = items.filter((c) => !c.parentId || !ids.has(c.parentId)).sort(byName);
  return roots.flatMap((r) => [r, ...items.filter((c) => c.parentId === r.id).sort(byName)]);
}

/** "Parent › Child" for a sub-category, the name for a top-level one. */
export function categoryPathLabel<T extends { id: string; name: string; parentId?: string | null }>(item: T, all: T[]): string {
  const parent = item.parentId ? all.find((c) => c.id === item.parentId) : undefined;
  return parent ? `${parent.name} › ${item.name}` : item.name;
}

const toBody = (v: CategoryFormValues) => ({
  name: v.name.trim(),
  slug: v.slug.trim(),
  description: v.description.trim(),
  icon: v.iconId,
  status: fromStatus(v.status),
  parentId: v.parentId || null,
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
  cache = [...cache.map((c) => (c.id === item.parentId ? { ...c, subCategoryCount: c.subCategoryCount + 1 } : c)), item];
  announce();
  return item;
}

export async function updateCategory(id: string, values: CategoryFormValues): Promise<CategoryItem> {
  const { data } = await apiClient.patch<ApiCategory>(`/categories/${encodeURIComponent(id)}`, toBody(values));
  const prev = cache.find((c) => c.id === id);
  // PATCH returns the row without counts; keep the known ones.
  const item = { ...toCategoryItem(data), totalCourses: prev?.totalCourses ?? 0, publishedCourses: prev?.publishedCourses ?? 0, subCategoryCount: prev?.subCategoryCount ?? 0 };
  // A new parent gains a sub-category, the old one loses it.
  if (prev && prev.parentId !== item.parentId) {
    cache = cache.map((c) =>
      c.id === prev.parentId ? { ...c, subCategoryCount: Math.max(0, c.subCategoryCount - 1) } : c.id === item.parentId ? { ...c, subCategoryCount: c.subCategoryCount + 1 } : c
    );
  }
  cache = cache.map((c) => (c.id === id ? item : c));
  announce();
  return item;
}

/** Refused by the API (409) while courses or sub-categories still use the category. */
export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${encodeURIComponent(id)}`);
  const gone = cache.find((c) => c.id === id);
  cache = cache.filter((c) => c.id !== id).map((c) => (c.id === gone?.parentId ? { ...c, subCategoryCount: Math.max(0, c.subCategoryCount - 1) } : c));
  announce();
}
