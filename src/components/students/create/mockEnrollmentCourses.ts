export interface EnrollmentCourse {
  id: string;
  orderNumber: number;
  title: string;
  category: string;
  instructor: {
    name: string;
    avatarUrl: string;
  };
  duration: string;
  price: string;
  iconType: "html" | "css" | "javascript" | "react" | "node" | "uiux";
}

export const ENROLLMENT_COURSES: EnrollmentCourse[] = [
  {
    id: "course-1",
    orderNumber: 1,
    title: "HTML Fundamentals",
    category: "Web Development",
    instructor: {
      name: "John Doe",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
    },
    duration: "4h 30m",
    price: "Free",
    iconType: "html",
  },
  {
    id: "course-2",
    orderNumber: 2,
    title: "CSS & Responsive Design",
    category: "Web Development",
    instructor: {
      name: "Sarah Khan",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
    },
    duration: "5h 20m",
    price: "Free",
    iconType: "css",
  },
  {
    id: "course-3",
    orderNumber: 3,
    title: "JavaScript Essentials",
    category: "Web Development",
    instructor: {
      name: "John Doe",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
    },
    duration: "6h 15m",
    price: "$49",
    iconType: "javascript",
  },
  {
    id: "course-4",
    orderNumber: 4,
    title: "React for Beginners",
    category: "Web Development",
    instructor: {
      name: "Michael Lee",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
    },
    duration: "7h 40m",
    price: "$79",
    iconType: "react",
  },
  {
    id: "course-5",
    orderNumber: 5,
    title: "Node.js Backend Basics",
    category: "Web Development",
    instructor: {
      name: "Michael Lee",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
    },
    duration: "8h 10m",
    price: "$69",
    iconType: "node",
  },
  {
    id: "course-6",
    orderNumber: 6,
    title: "UI/UX Design Basics",
    category: "Design",
    instructor: {
      name: "Emma Wilson",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80",
    },
    duration: "5h 30m",
    price: "$59",
    iconType: "uiux",
  },
];
