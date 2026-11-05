export type CategoryStatus = "Active" | "Inactive";

/** One course category of the workspace (the API's Category with course counts). */
export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Icon id from CATEGORY_ICONS ("code", "design"…), or a legacy emoji / image URL. */
  iconId: string;
  status: CategoryStatus;
  totalCourses: number;
  publishedCourses: number;
  /** Parent category id (null = top level; sub-categories are one level deep). */
  parentId: string | null;
  /** Number of sub-categories under this one. */
  subCategoryCount: number;
  /** ISO datetime. */
  createdAt: string;
}

export interface CategoryIconOption {
  id: string;
  label: string;
}

export type CategoryDrawerMode = "create" | "edit" | "details";

/** What the drawer form submits. */
export interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  status: CategoryStatus;
  iconId: string;
  /** "" = top level. */
  parentId: string;
}
