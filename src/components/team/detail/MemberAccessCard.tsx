"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eraser, Eye, KeyRound, KeySquare, Pencil, UserCog } from "lucide-react";
import type { RolePermissions, TeamMember, TeamRole } from "@/types/team";
import { countPermissions, describePermissions, effectivePermissions, emptyPermissions, extraCount, listGrants } from "@/lib/teamPermissions";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PermissionMatrix } from "../editor/PermissionMatrix";
import { PermissionSourceLegend } from "../shared/PermissionSourceLegend";
import { ExtraPermissionsBadge, RoleBadge } from "../shared/TeamBadges";
import { plural } from "../shared/teamFormat";
import { EditExtraPermissionsModal } from "./EditExtraPermissionsModal";

export interface MemberAccessCardProps {
  member: TeamMember;
  role: TeamRole | undefined;
  busy: boolean;
  onChangeRole: () => void;
  /** Saves the member's extra permissions (resolves on success, throws on failure). */
  onSaveExtras: (extras: RolePermissions) => Promise<unknown>;
}

/**
 * Role + extras summary, and the effective matrix with the source of each permission
 * (orange = from the role, blue = extra). "Edit extra permissions" / "Remove all extras" for everyone but
 * the owner and Super Admin holders (they already have everything).
 */
export function MemberAccessCard({ member, role, busy, onChangeRole, onSaveExtras }: MemberAccessCardProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const n = extraCount(member);
  const hasEverything = member.isOwner || !!role?.isLocked;
  const canExtras = !!role && !hasEverything;
  const effective = effectivePermissions(member, role);
  const invited = member.status === "INVITED";
  const who = member.name || member.email;

  return (
    <IconSectionCard
      icon={<KeyRound className="h-5 w-5" />}
      tone="purple"
      title="Access"
      description={
        invited
          ? "What they'll be able to do once they accept."
          : hasEverything
            ? "Full access — this member has every permission."
            : n
              ? `Effective permissions: ${role?.name ?? "role"} + ${plural(n, "extra permission")}.`
              : "Effective permissions from their role."
      }
      action={
        <div className="flex flex-wrap justify-end gap-2">
          {role && (
            <CardActionButton icon={role.isLocked ? <Eye /> : <Pencil />} onClick={() => router.push(`/users/roles/${role.id}/edit`)}>
              {role.isLocked ? "View role" : "Edit role"}
            </CardActionButton>
          )}
          {!member.isOwner && (
            <CardActionButton icon={<UserCog />} onClick={onChangeRole} disabled={busy}>
              Change role
            </CardActionButton>
          )}
          {canExtras && (
            <CardActionButton icon={<KeySquare />} onClick={() => setEditing(true)} disabled={busy}>
              Edit extra permissions
            </CardActionButton>
          )}
          {canExtras && n > 0 && (
            <CardActionButton icon={<Eraser />} onClick={() => setConfirmClear(true)} disabled={busy}>
              Remove all extras
            </CardActionButton>
          )}
        </div>
      }
    >
      {role ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 rounded-xl border border-dash bg-gray-bg p-3.5 sm:flex-row sm:items-start">
            <div className="flex shrink-0 items-center gap-1.5">
              <RoleBadge role={role} size="md" />
              <ExtraPermissionsBadge count={n} size="md" long />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="body-sm-regular text-primary-400">{describePermissions(effective)}</p>
              {n > 0 && <p className="body-xsm-regular text-blue">Extra on top of {role.name}: {listGrants(member.extraPermissions, 4)}</p>}
              {member.isOwner && <p className="body-xsm-regular text-primary-300">The workspace owner always has every permission, so extra permissions don&apos;t apply.</p>}
              {!member.isOwner && role.isLocked && <p className="body-xsm-regular text-primary-300">{role.name} already includes every permission, so extra permissions don&apos;t apply.</p>}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <PermissionSourceLegend roleName={role.name} showExtra={!hasEverything} />
            <span className="body-xsm-medium text-primary-400 tabular-nums">{plural(countPermissions(effective), "permission")} in total</span>
          </div>
          <PermissionMatrix base={hasEverything ? effective : role.permissions} baseLabel={role.name} value={hasEverything ? emptyPermissions() : member.extraPermissions} readOnly compact />
        </div>
      ) : (
        <p className="body-sm-regular text-primary-300">This member&apos;s role no longer exists. Assign a new role to restore access.</p>
      )}

      {role && canExtras && (
        <>
          <EditExtraPermissionsModal isOpen={editing} member={member} role={role} onClose={() => setEditing(false)} onSubmit={onSaveExtras} />
          <ConfirmModal
            isOpen={confirmClear}
            title="Remove all extra permissions?"
            subtitle={who}
            message={`${who} loses ${plural(n, "extra permission")} (${listGrants(member.extraPermissions, 3)}) and keeps exactly what ${role.name} allows.`}
            confirmLabel="Remove all extras"
            pendingLabel="Removing..."
            confirmIcon={<Eraser className="h-4 w-4" />}
            onClose={() => setConfirmClear(false)}
            onConfirm={async () => {
              await onSaveExtras(emptyPermissions());
            }}
          />
        </>
      )}
    </IconSectionCard>
  );
}

export default MemberAccessCard;
