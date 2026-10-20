import { AdminCourseItem } from "@/lib/types";

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export const DEFAULT_FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop";

export const SVG_FALLBACK =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231C4D8D'/%3E%3Cstop offset='100%25' stop-color='%230F2854'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' fill='white' font-family='sans-serif' font-size='26' font-weight='600' text-anchor='middle' dy='.3em'%3ECourse Banner%3C/text%3E%3C/svg%3E";

export const PRESET_BANNERS = [
  {
    name: "AI & Neural Networks",
    url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Modern React & Next.js",
    url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Cloud, Docker & DevOps",
    url: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "TypeScript Engineering",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Python & Machine Learning",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Cybersecurity & Cryptography",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
  },
];

export const DEFAULT_COURSE_CATEGORIES: CategoryOption[] = [
  { id: "c1", name: "Fullstack Web", slug: "fullstack-web" },
  { id: "c2", name: "Artificial Intelligence", slug: "artificial-intelligence" },
  { id: "c3", name: "Cloud & DevOps", slug: "cloud-devops" },
  { id: "c4", name: "Software Engineering", slug: "software-engineering" },
  { id: "c5", name: "Cybersecurity", slug: "cybersecurity" },
];

export const INITIAL_COURSES: AdminCourseItem[] = [
  {
    id: "crs-1",
    title: "Mastering Next.js 16 & Enterprise Architecture",
    slug: "nextjs-16-enterprise",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
    shortDescription:
      "Master React 19 Server Components, Turbopack, and microservices architecture.",
    price: 99,
    isFree: false,
    status: "PUBLISHED",
    level: "ADVANCED",
    language: "English",
    durationMinutes: 1080,
    totalDuration: "18 Hours",
    category: { id: "c1", name: "Fullstack Web" },
    totalStudents: 2840,
    ratingAverage: 4.9,
    instructorName: "Tanvir Ahmed",
  },
  {
    id: "crs-2",
    title: "Advanced Gemini 3.8 & AI Agent Architecture",
    slug: "gemini-ai-agent-engineering",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    shortDescription:
      "Build autonomous agents with Gemini 3.8 Flash SDK and sub-second Groq pipelines.",
    price: 129,
    isFree: false,
    status: "PUBLISHED",
    level: "INTERMEDIATE",
    language: "English",
    durationMinutes: 840,
    totalDuration: "14 Hours",
    category: { id: "c2", name: "Artificial Intelligence" },
    totalStudents: 1950,
    ratingAverage: 4.95,
    instructorName: "Imam Hossain",
  },
  {
    id: "crs-3",
    title: "Foundations of TypeScript 6 & Clean Code",
    slug: "typescript-foundations",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    shortDescription:
      "Type safety, generics, decorators, and clean domain-driven architecture.",
    price: 0,
    isFree: true,
    status: "PUBLISHED",
    level: "BEGINNER",
    language: "English",
    durationMinutes: 540,
    totalDuration: "9 Hours",
    category: { id: "c3", name: "Software Engineering" },
    totalStudents: 4890,
    ratingAverage: 4.8,
    instructorName: "Dr. Farhana Yasmin",
  },
  {
    id: "crs-4",
    title: "Docker, Kubernetes & Production CI/CD Pipelines",
    slug: "devops-docker-kubernetes",
    thumbnail:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop",
    shortDescription:
      "Container orchestration, multi-stage builds, and cloud deployment pipelines.",
    price: 79,
    isFree: false,
    status: "PUBLISHED",
    level: "INTERMEDIATE",
    language: "English",
    durationMinutes: 960,
    totalDuration: "16 Hours",
    category: { id: "c4", name: "Cloud & DevOps" },
    totalStudents: 1420,
    ratingAverage: 4.85,
    instructorName: "Engr. Mahmudul Huq",
  },
  {
    id: "crs-5",
    title: "Fullstack Python Machine Learning with PyTorch",
    slug: "python-ml-pytorch",
    thumbnail:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    shortDescription:
      "Deep learning neural networks, tensor operations, and model deployment.",
    price: 110,
    isFree: false,
    status: "PUBLISHED",
    level: "ADVANCED",
    language: "English",
    durationMinutes: 1200,
    totalDuration: "20 Hours",
    category: { id: "c2", name: "Artificial Intelligence" },
    totalStudents: 980,
    ratingAverage: 4.9,
    instructorName: "Nusrat Jahan",
  },
  {
    id: "crs-6",
    title: "Microservices with NestJS, RabbitMQ & Redis",
    slug: "nestjs-microservices-rabbitmq",
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    shortDescription:
      "Event-driven architecture, distributed queues, caching, and resilient database pools.",
    price: 89,
    isFree: false,
    status: "DRAFT",
    level: "ADVANCED",
    language: "English",
    durationMinutes: 720,
    totalDuration: "12 Hours",
    category: { id: "c4", name: "Cloud & DevOps" },
    totalStudents: 640,
    ratingAverage: 4.75,
    instructorName: "Tanvir Ahmed",
  },
];
