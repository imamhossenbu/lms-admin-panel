import { Code2, FileText, Link2, PlaySquare, type LucideIcon } from "lucide-react";
import type { LiveResource, LiveResourceType } from "@/types/liveClass";

export type ResourceTone = "red" | "blue" | "green" | "purple";

export interface ResourceTypeMeta {
  label: string;
  tone: ResourceTone;
  icon: LucideIcon;
  /** Quick Actions row. */
  action: string;
  actionHint: string;
  /** File input accept list ("" = link only). */
  accept: string;
  /** Upload size limit in bytes. */
  maxBytes: number;
}

const MB = 1024 * 1024;

export const RESOURCE_TYPES: LiveResourceType[] = ["RECORDING", "DOCUMENT", "LINK", "CODE"];

export const RESOURCE_TYPE_META: Record<LiveResourceType, ResourceTypeMeta> = {
  RECORDING: { label: "Recording", tone: "red", icon: PlaySquare, action: "Upload Recording", actionHint: "Add class recording video", accept: "video/*", maxBytes: 4096 * MB },
  DOCUMENT: {
    label: "Document",
    tone: "blue",
    icon: FileText,
    action: "Upload Document",
    actionHint: "Share class notes or materials",
    accept: ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md",
    maxBytes: 100 * MB,
  },
  LINK: { label: "Link", tone: "green", icon: Link2, action: "Add External Link", actionHint: "Share useful links and resources", accept: "", maxBytes: 0 },
  CODE: {
    label: "Code",
    tone: "purple",
    icon: Code2,
    action: "Add Code Example",
    actionHint: "Share code files or snippets",
    accept: ".zip,.js,.jsx,.ts,.tsx,.py,.java,.html,.css,.json,.txt,.md",
    maxBytes: 100 * MB,
  },
};

export const TONE_TILE: Record<ResourceTone, string> = {
  red: "bg-red-14 text-red",
  blue: "bg-blue-14 text-blue",
  green: "bg-green-bg text-green",
  purple: "bg-purple-14 text-purple",
};

export const VISIBILITY_META: Record<LiveResource["visibility"], { label: string; tone: "green" | "blue" | "gray" }> = {
  ALL_STUDENTS: { label: "All Students", tone: "green" },
  ATTENDEES: { label: "Attendees Only", tone: "blue" },
  HIDDEN: { label: "Hidden", tone: "gray" },
};

export const VISIBILITY_OPTIONS = (Object.keys(VISIBILITY_META) as LiveResource["visibility"][]).map((v) => ({ value: v, label: VISIBILITY_META[v].label }));
export const TYPE_OPTIONS = RESOURCE_TYPES.map((t) => ({ value: t, label: RESOURCE_TYPE_META[t].label }));
