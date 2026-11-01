import {
  CalendarClock,
  CalendarPlus,
  FileText,
  MessageSquareText,
  MonitorUp,
  PencilLine,
  PlayCircle,
  StopCircle,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { LiveActivityKind } from "@/types/liveClass";

export interface ActivityKindMeta {
  label: string;
  icon: LucideIcon;
  /** Icon tile classes (globals.css tokens). */
  tile: string;
}

export const ACTIVITY_META: Record<LiveActivityKind, ActivityKindMeta> = {
  CLASS_SCHEDULED: { label: "Class Scheduled", icon: CalendarPlus, tile: "bg-blue-14 text-blue" },
  CLASS_UPDATED: { label: "Class Updated", icon: CalendarClock, tile: "bg-yellow-bg text-yellow" },
  CLASS_CANCELLED: { label: "Class Cancelled", icon: XCircle, tile: "bg-red-14 text-red" },
  CLASS_STARTED: { label: "Class Started", icon: PlayCircle, tile: "bg-green-bg text-green" },
  STUDENTS_JOINED: { label: "Students Joined", icon: Users, tile: "bg-blue-14 text-blue" },
  QUESTION_ASKED: { label: "New Question", icon: MessageSquareText, tile: "bg-purple-14 text-purple" },
  QUESTION_ANSWERED: { label: "Instructor Answered", icon: PencilLine, tile: "bg-brand-orange-light text-brand-orange" },
  SCREEN_SHARED: { label: "Screen Shared", icon: MonitorUp, tile: "bg-red-14 text-red" },
  RESOURCE_SHARED: { label: "Resource Shared", icon: FileText, tile: "bg-blue-14 text-blue" },
  CLASS_ENDED: { label: "Class Ended", icon: StopCircle, tile: "bg-gray-bg text-primary-400" },
};

export const ACTIVITY_KINDS = Object.keys(ACTIVITY_META) as LiveActivityKind[];

/** Events that exist before a class takes place. */
export const SCHEDULING_KINDS: LiveActivityKind[] = ["CLASS_SCHEDULED", "CLASS_UPDATED", "CLASS_CANCELLED"];
