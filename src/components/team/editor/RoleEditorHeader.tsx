"use client";

import React from "react";
import { Copy, RotateCcw, Save, ShieldPlus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { ModifiedRoleBadge, SystemRoleBadge } from "../shared/TeamBadges";

export const ROLE_FORM_ID = "team-role-form";
export type RoleEditorMode = "create" | "edit" | "view";

export interface RoleEditorHeaderProps {
  mode: RoleEditorMode;
  roleName?: string;
  /** Built-in role (edit / view). */
  isSystem?: boolean;
  locked?: boolean;
  /** System role: current (form) permissions differ from the default preset. */
  modified?: boolean;
  isSubmitting: boolean;
  onDuplicate?: () => void;
  /** System role: opens the "Reset to default" confirm. */
  onReset?: () => void;
  canReset?: boolean;
}

const TITLE: Record<RoleEditorMode, string> = { create: "Create role", edit: "Edit role", view: "View role" };

function subtitle(mode: RoleEditorMode, isSystem?: boolean) {
  if (mode === "create") return "Name the role and choose exactly what people with it can see and do.";
  if (mode === "view") return "Super Admin always has every permission, so the workspace owner can never be locked out.";
  return isSystem
    ? "Built-in role: the name stays the same, but you can change its permissions and reset them to the defaults at any time."
    : "Changes apply immediately to everyone who has this role.";
}

/** 🏠 › Team & Roles › Roles › {name}, title + badges + Reset to default (system) + orange Save / Create / Duplicate. */
export function RoleEditorHeader({ mode, roleName, isSystem, locked, modified, isSubmitting, onDuplicate, onReset, canReset }: RoleEditorHeaderProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Team & Roles", href: "/users" },
    { label: "Roles", href: "/users?tab=roles" },
    { label: mode === "create" ? "New role" : roleName || "Role" },
  ];
  const badge =
    mode !== "create" && isSystem ? (
      <span className="inline-flex flex-wrap items-center gap-1.5">
        <SystemRoleBadge locked={locked} />
        {modified && <ModifiedRoleBadge />}
      </span>
    ) : undefined;
  return (
    <PageHeader
      className="mb-0"
      breadcrumbs={breadcrumbs}
      title={<span className="heading-h3 font-bold! tracking-tight text-primary-500">{mode !== "create" && roleName ? roleName : TITLE[mode]}</span>}
      badge={badge}
      subtitle={subtitle(mode, isSystem)}
    >
      {mode === "view" ? (
        <PrimaryButton leftIcon={<Copy className="h-4 w-4" />} onClick={onDuplicate}>
          Duplicate
        </PrimaryButton>
      ) : (
        <div className="flex flex-wrap items-center gap-2.5">
          {isSystem && onReset && (
            <SecondaryButton type="button" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={onReset} disabled={!canReset || isSubmitting} title={canReset ? "Restore the built-in permissions" : "Already using the default permissions"}>
              Reset to default
            </SecondaryButton>
          )}
          <RoleSubmitButton mode={mode} isSubmitting={isSubmitting} />
        </div>
      )}
    </PageHeader>
  );
}

/** Orange submit bound to the role form by id (header + save bar). */
export function RoleSubmitButton({ mode, isSubmitting }: { mode: RoleEditorMode; isSubmitting: boolean }) {
  return (
    <PrimaryButton type="submit" form={ROLE_FORM_ID} isLoading={isSubmitting} disabled={isSubmitting} leftIcon={mode === "create" ? <ShieldPlus className="h-4 w-4" /> : <Save className="h-4 w-4" />}>
      {isSubmitting ? "Saving..." : mode === "create" ? "Create role" : "Save changes"}
    </PrimaryButton>
  );
}

export default RoleEditorHeader;
