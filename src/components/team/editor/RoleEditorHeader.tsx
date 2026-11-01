"use client";

import React from "react";
import { Copy, Save, ShieldPlus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/primary-button";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { SystemRoleBadge } from "../shared/TeamBadges";

export const ROLE_FORM_ID = "team-role-form";
export type RoleEditorMode = "create" | "edit" | "view";

export interface RoleEditorHeaderProps {
  mode: RoleEditorMode;
  roleName?: string;
  locked?: boolean;
  isSubmitting: boolean;
  onDuplicate?: () => void;
}

const TITLE: Record<RoleEditorMode, string> = { create: "Create role", edit: "Edit role", view: "View role" };
const SUBTITLE: Record<RoleEditorMode, string> = {
  create: "Name the role and choose exactly what people with it can see and do.",
  edit: "Changes apply immediately to everyone who has this role.",
  view: "Built-in roles can't be changed. Duplicate it to make a version you can edit.",
};

/** 🏠 › Team & Roles › Roles › {name}, title + orange Save / Create / Duplicate to customise. */
export function RoleEditorHeader({ mode, roleName, locked, isSubmitting, onDuplicate }: RoleEditorHeaderProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Team & Roles", href: "/users" },
    { label: "Roles", href: "/users?tab=roles" },
    { label: mode === "create" ? "New role" : roleName || "Role" },
  ];
  return (
    <PageHeader
      className="mb-0"
      breadcrumbs={breadcrumbs}
      title={<span className="heading-h3 font-bold! tracking-tight text-primary-500">{mode === "view" && roleName ? roleName : TITLE[mode]}</span>}
      badge={mode === "view" ? <SystemRoleBadge locked={locked} /> : undefined}
      subtitle={SUBTITLE[mode]}
    >
      {mode === "view" ? (
        <PrimaryButton leftIcon={<Copy className="h-4 w-4" />} onClick={onDuplicate}>
          Duplicate to customise
        </PrimaryButton>
      ) : (
        <RoleSubmitButton mode={mode} isSubmitting={isSubmitting} />
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
