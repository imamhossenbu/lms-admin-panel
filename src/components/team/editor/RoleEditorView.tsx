"use client";

import React from "react";
import { useUrlParams } from "@/lib/useUrlParams";
import { useTeamReady, useTeamStore } from "../shared/useTeamStore";
import { TeamNotFound } from "../shared/TeamNotFound";
import { RoleEditorForm } from "./RoleEditorForm";
import { RoleEditorSkeleton } from "./RoleEditorSkeleton";
import { RoleViewOnly } from "./RoleViewOnly";

export type RoleEditorViewProps = { mode: "create" } | { mode: "edit"; roleId: string };

/** Route entry for /users/roles/new (?from=<roleId>) and /users/roles/[id]/edit (custom + built-in roles are editable; Super Admin opens read-only). */
export function RoleEditorView(props: RoleEditorViewProps) {
  const ready = useTeamReady();
  const { roles, members } = useTeamStore();
  const { get } = useUrlParams();

  if (!ready) return <RoleEditorSkeleton />;

  if (props.mode === "create") {
    const template = roles.find((r) => r.id === get("from"));
    return <RoleEditorForm key={template?.id ?? "blank"} mode="create" template={template} roles={roles} members={members} />;
  }

  const role = roles.find((r) => r.id === props.roleId);
  if (!role) return <TeamNotFound what="role" />;
  if (role.isLocked) return <RoleViewOnly role={role} members={members} />;
  return <RoleEditorForm key={role.id} mode="edit" original={role} roles={roles} members={members} />;
}

export default RoleEditorView;
