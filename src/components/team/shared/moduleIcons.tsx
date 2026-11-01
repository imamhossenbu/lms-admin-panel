import React from "react";
import { Award, Bell, BookOpen, CheckSquare, CreditCard, FileSpreadsheet, FolderTree, LayoutDashboard, LineChart, MessageSquare, Settings, ShieldCheck, ShoppingBag, UserCheck, Users, Video } from "lucide-react";
import type { TeamModule } from "@/types/team";

/** Same icons as the sidebar so modules are recognisable in the matrix. */
const ICONS: Record<TeamModule, React.ElementType> = {
  dashboard: LayoutDashboard,
  analytics: LineChart,
  courses: BookOpen,
  categories: FolderTree,
  students: Users,
  instructors: UserCheck,
  orders: ShoppingBag,
  payments: CreditCard,
  liveClasses: Video,
  assignments: FileSpreadsheet,
  quizzes: CheckSquare,
  community: MessageSquare,
  certificates: Award,
  notifications: Bell,
  settings: Settings,
  team: ShieldCheck,
};

export function ModuleIcon({ module, className = "h-4 w-4" }: { module: TeamModule; className?: string }) {
  const Icon = ICONS[module];
  return <Icon className={className} />;
}

export default ModuleIcon;
