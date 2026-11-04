/** A course row in course pickers (student enrollment, instructor assignment). */
export interface EnrollmentCourse {
  id: string;
  orderNumber: number;
  title: string;
  category: string;
  instructor: {
    name: string;
    avatarUrl: string;
  };
  studentsCount: number;
  duration: string;
  price: string;
  iconType: "html" | "css" | "javascript" | "react" | "node" | "uiux";
}
