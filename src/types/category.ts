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
}
