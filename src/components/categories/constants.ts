import { AdminCategoryItem } from "@/lib/types";

export const EMOJI_OPTIONS = [
  "🤖", "💻", "☁️", "⚡", "🛡️", "📱", "🎨", "📊", "🧠", "🌐", "🔬", "🚀", "🎯", "⚙️"
];

export const DEFAULT_CATEGORIES: AdminCategoryItem[] = [
  {
    id: "cat-ai",
    name: "Artificial Intelligence",
    slug: "artificial-intelligence",
    description: "Deep learning, LLMs, neural networks, and prompt engineering.",
    icon: "🤖",
    status: "ACTIVE",
    _count: { courses: 14 },
  },
  {
    name: "Fullstack Web",
    id: "cat-web",
    slug: "fullstack-web",
    description: "Next.js, React 19, TypeScript, and modern frontend/backend stacks.",
    icon: "💻",
    status: "ACTIVE",
    _count: { courses: 28 },
  },
  {
    name: "Cloud & DevOps",
    id: "cat-cloud",
    slug: "cloud-devops",
    description: "Docker, Kubernetes, AWS, Terraform, and CI/CD automation pipelines.",
    icon: "☁️",
    status: "ACTIVE",
    _count: { courses: 18 },
  },
  {
    name: "Software Engineering",
    id: "cat-se",
    slug: "software-engineering",
    description: "Data structures, algorithms, system design, and clean architecture.",
    icon: "⚡",
    status: "ACTIVE",
    _count: { courses: 22 },
  },
  {
    name: "Cybersecurity",
    id: "cat-cyber",
    slug: "cybersecurity",
    description: "Ethical hacking, zero-trust infrastructure, and cryptography.",
    icon: "🛡️",
    status: "ACTIVE",
    _count: { courses: 8 },
  },
];
