export type CategoryStatus = "Active" | "Inactive";

export interface SubCategoryItem {
  id: string;
  name: string;
  slug: string;
  courseCount: number;
  status: CategoryStatus;
  createdDate: string;
  parentId: string;
}

export interface CategoryItem {
  id: string;
  orderNumber: number;
  name: string;
  slug: string;
  description: string;
  parentId?: string | null;
  totalCourses: number;
  publishedCourses: number;
  status: CategoryStatus;
  createdDate: string;
  iconId: string;
  colorScheme:
    | "purple"
    | "red"
    | "orange"
    | "green"
    | "amber"
    | "blue"
    | "indigo"
    | "emerald"
    | "pink"
    | "cyan";
  subCategories?: SubCategoryItem[];
}

export interface CategoryIconOption {
  id: string;
  label: string;
  colorBg: string;
  colorText: string;
  colorBorder: string;
}

export type CategoryDrawerMode = "create" | "edit" | "details";
