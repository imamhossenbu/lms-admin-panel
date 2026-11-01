"use client";

import React from "react";
import { motion } from "framer-motion";
import { Copy, Eye, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import type { TeamMember, TeamRole } from "@/types/team";
import { TOTAL_PERMISSIONS, countPermissions, modulesWithAccess } from "@/lib/teamPermissions";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { ROLE_TONE_META } from "../shared/roleTone";
import { SystemRoleBadge } from "../shared/TeamBadges";
import { plural } from "../shared/teamFormat";
import { AvatarStack } from "./AvatarStack";

export interface RoleCardProps {
  role: TeamRole;
  members: TeamMember[];
  busy: boolean;
  onOpen: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

/** Role tile: colour icon, name + System/Custom badge, description, coverage bar, holders, actions. */
export function RoleCard({ role, members, busy, onOpen, onDuplicate, onDelete }: RoleCardProps) {
  const tone = ROLE_TONE_META[role.tone];
  const granted = countPermissions(role.permissions);
  const pct = Math.round((granted / TOTAL_PERMISSIONS) * 100);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="dashboard-card shadow-2xs flex flex-col gap-4 p-5 transition-shadow hover:shadow-md"
    >
      <header className="flex items-start gap-3">
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tone.tile)}>
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate body-md-medium font-semibold! text-primary-500" title={role.name}>
              {role.name}
            </h3>
            {role.isSystem ? <SystemRoleBadge locked={role.isLocked} /> : <ToneBadge tone="purple" size="sm">Custom</ToneBadge>}
          </div>
          <p className="mt-0.5 line-clamp-2 body-sm-regular text-primary-300" title={role.description}>
            {role.description || "No description."}
          </p>
        </div>
      </header>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between body-xsm-regular text-primary-300">
          <span>
            {plural(modulesWithAccess(role.permissions).length, "module")} · {plural(granted, "permission")}
          </span>
          <span className="font-semibold text-primary-500 tabular-nums">{pct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div className={cn("h-full rounded-full", tone.swatch)} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <AvatarStack members={members} />
        <span className="body-xsm-regular text-primary-300">{plural(members.length, "member")}</span>
      </div>

      <footer className="mt-auto flex flex-wrap items-center gap-2 border-t border-dash pt-4">
        <CardActionButton icon={role.isSystem ? <Eye /> : <Pencil />} onClick={onOpen}>
          {role.isSystem ? "View" : "Edit"}
        </CardActionButton>
        <CardActionButton icon={<Copy />} onClick={onDuplicate} disabled={busy}>
          Duplicate
        </CardActionButton>
        {!role.isSystem && (
          <CardActionButton icon={<Trash2 />} onClick={onDelete} disabled={busy} className="ml-auto" aria-label={`Delete ${role.name}`}>
            Delete
          </CardActionButton>
        )}
      </footer>
    </motion.article>
  );
}

export default RoleCard;
