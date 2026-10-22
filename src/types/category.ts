export type CategoryStatus = "Active" | "Inactive";

export interface CategoryItem {
  id: string;
  orderNumber: number;
  name: string;
  slug: string;
  description: string;
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
}

export interface CategoryIconOption {
  id: string;
  label: string;
  colorBg: string;
  colorText: string;
  colorBorder: string;
}
