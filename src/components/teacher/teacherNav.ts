import { BookOpen, ClipboardCheck, FileQuestion, LayoutDashboard, MessageCircleQuestion, Radio, UserCog, Users, type LucideIcon } from "lucide-react";

export const TEACHER_NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/teach", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teach/courses", label: "My Courses", icon: BookOpen },
  { href: "/teach/students", label: "Students", icon: Users },
  { href: "/teach/grading", label: "Grading", icon: ClipboardCheck },
  { href: "/teach/quizzes", label: "Quiz Results", icon: FileQuestion },
  { href: "/teach/questions", label: "Q&A", icon: MessageCircleQuestion },
  { href: "/teach/live", label: "Live Classes", icon: Radio },
  { href: "/teach/profile", label: "Profile", icon: UserCog },
];

export const isTeacherNavActive = (pathname: string, href: string) => (href === "/teach" ? pathname === "/teach" : pathname.startsWith(href));
