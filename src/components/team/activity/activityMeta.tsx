import React from "react";
import { Ban, KeyRound, MailPlus, MailX, RotateCcw, Send, ShieldCheck, ShieldPlus, ShieldX, UserCheck, UserCog, UserMinus } from "lucide-react";
import type { TeamEvent, TeamEventType } from "@/types/team";

export type ActivityGroup = "invitations" | "access" | "roles" | "security";

export const ACTIVITY_GROUPS: { value: "All" | ActivityGroup; label: string }[] = [
  { value: "All", label: "All activity" },
  { value: "invitations", label: "Invitations" },
  { value: "access", label: "Access changes" },
  { value: "roles", label: "Roles & permissions" },
  { value: "security", label: "Security" },
];

/** Icon, token tile classes, sentence verb and filter group per event type. */
export const EVENT_META: Record<TeamEventType, { icon: React.ReactNode; tile: string; verb: string; group: ActivityGroup }> = {
  INVITED: { icon: <MailPlus className="h-4 w-4" />, tile: "bg-blue-14 text-blue", verb: "invited", group: "invitations" },
  INVITE_RESENT: { icon: <Send className="h-4 w-4" />, tile: "bg-blue-14 text-blue", verb: "resent the invitation to", group: "invitations" },
  INVITE_REVOKED: { icon: <MailX className="h-4 w-4" />, tile: "bg-gray-bg text-primary-400", verb: "revoked the invitation for", group: "invitations" },
  JOINED: { icon: <UserCheck className="h-4 w-4" />, tile: "bg-green-bg text-green", verb: "joined the team", group: "invitations" },
  ROLE_CHANGED: { icon: <UserCog className="h-4 w-4" />, tile: "bg-purple-14 text-purple", verb: "changed the role of", group: "access" },
  SUSPENDED: { icon: <Ban className="h-4 w-4" />, tile: "bg-red-14 text-red", verb: "suspended", group: "access" },
  REACTIVATED: { icon: <RotateCcw className="h-4 w-4" />, tile: "bg-green-bg text-green", verb: "reactivated", group: "access" },
  REMOVED: { icon: <UserMinus className="h-4 w-4" />, tile: "bg-red-14 text-red", verb: "removed", group: "access" },
  TWO_FA_ENABLED: { icon: <ShieldCheck className="h-4 w-4" />, tile: "bg-green-bg text-green", verb: "turned on two-factor authentication", group: "security" },
  TWO_FA_RESET: { icon: <KeyRound className="h-4 w-4" />, tile: "bg-yellow-bg text-yellow", verb: "reset two-factor authentication for", group: "security" },
  ROLE_CREATED: { icon: <ShieldPlus className="h-4 w-4" />, tile: "bg-brand-orange-light text-brand-orange", verb: "created the role", group: "roles" },
  ROLE_UPDATED: { icon: <ShieldCheck className="h-4 w-4" />, tile: "bg-brand-orange-light text-brand-orange", verb: "edited permissions of", group: "roles" },
  ROLE_DELETED: { icon: <ShieldX className="h-4 w-4" />, tile: "bg-red-14 text-red", verb: "deleted the role", group: "roles" },
};

/** Self events ("Jahid Hasan joined the team") have no separate target. */
export const isSelfEvent = (e: TeamEvent) => e.type === "JOINED" || (e.type === "TWO_FA_ENABLED" && e.actor === e.targetName);

export const parseActivityGroup = (v: string): "All" | ActivityGroup => (ACTIVITY_GROUPS.some((g) => g.value === v) ? (v as ActivityGroup) : "All");

export function filterEvents(events: TeamEvent[], group: "All" | ActivityGroup, q: string) {
  const s = q.trim().toLowerCase();
  return events
    .filter((e) => group === "All" || EVENT_META[e.type].group === group)
    .filter((e) => !s || `${e.actor} ${e.targetName} ${e.detail} ${EVENT_META[e.type].verb}`.toLowerCase().includes(s))
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}
