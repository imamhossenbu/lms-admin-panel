"use client";

import React, { useMemo, useState } from "react";
import { Controller, FormProvider, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { RotateCcw, Undo2 } from "lucide-react";
import type { RolePermissions, TeamMember, TeamRole } from "@/types/team";
import { roleFormSchema, type RoleFormValues } from "@/validations/teamSchema";
import { createRole, resetRoleToDefault, updateRole } from "@/lib/teamStorage";
import { countPermissions, emptyPermissions, isRoleModified, normalizePermissions, samePermissions } from "@/lib/teamPermissions";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ProTipCard } from "@/components/ui/ProTipCard";
import { errorText, plural } from "../shared/teamFormat";
import { useUnsavedChangesGuard } from "../shared/useUnsavedChangesGuard";
import { RoleEditorHeader, ROLE_FORM_ID } from "./RoleEditorHeader";
import { RoleDetailsCard } from "./RoleDetailsCard";
import { PermissionsCard } from "./PermissionsCard";
import { RoleSummaryCard } from "./RoleSummaryCard";
import { RoleMembersCard } from "./RoleMembersCard";
import { RoleSaveBar } from "./RoleSaveBar";
import { SystemRoleCallout } from "./SystemRoleCallout";

export interface RoleEditorFormProps {
  mode: "create" | "edit";
  /** The role being edited (edit mode) — custom or built-in (not Super Admin). */
  original?: TeamRole;
  /** Starting point for a new role (create with ?from=<roleId>). */
  template?: TeamRole;
  roles: TeamRole[];
  members: TeamMember[];
}

const LIST_HREF = "/users?tab=roles";

function initialValues(original?: TeamRole, template?: TeamRole): RoleFormValues {
  if (original) return { name: original.name, description: original.description, tone: original.tone, permissions: normalizePermissions(original.permissions) };
  if (template) return { name: `${template.name} (Custom)`.slice(0, 40), description: template.description, tone: template.tone === "orange" ? "blue" : template.tone, permissions: normalizePermissions(template.permissions) };
  return { name: "", description: "", tone: "blue", permissions: emptyPermissions() };
}

const sameValues = (a: RoleFormValues, b: RoleFormValues) => a.name === b.name && a.description === b.description && a.tone === b.tone && samePermissions(a.permissions as RolePermissions, b.permissions as RolePermissions);

/**
 * Create / edit a role: details + permission matrix, sticky live summary aside, sticky save bar, unsaved-changes guard.
 * Built-in roles: name locked, "Modified" badge when the matrix differs from the preset, "Reset to default".
 */
export function RoleEditorForm({ mode, original, template, roles, members }: RoleEditorFormProps) {
  const baseline = useMemo(() => initialValues(original, template), [original, template]);
  const taken = useMemo(() => roles.filter((r) => r.id !== original?.id).map((r) => r.name.trim().toLowerCase()), [roles, original?.id]);
  const schema = useMemo(() => roleFormSchema(taken), [taken]);
  const [confirmReset, setConfirmReset] = useState(false);

  const form = useForm<RoleFormValues>({ resolver: zodResolver(schema), defaultValues: baseline, mode: "onTouched" });
  const { control, handleSubmit, formState, reset, setValue } = form;
  const values = useWatch({ control }) as RoleFormValues;
  const current: RoleFormValues = { ...baseline, ...values };
  const isDirty = !sameValues(current, baseline);
  const guard = useUnsavedChangesGuard(isDirty && !formState.isSubmitSuccessful);
  const assigned = original ? members.filter((m) => m.roleId === original.id) : [];

  const defaults = original?.isSystem && original.defaultPermissions ? normalizePermissions(original.defaultPermissions) : null;
  const differsFromDefault = !!defaults && !samePermissions(current.permissions as RolePermissions, defaults);
  const storedModified = !!original && isRoleModified(original);

  const onSubmit = async (v: RoleFormValues) => {
    const toastId = toast.loading(mode === "create" ? "Creating role..." : "Saving changes...", { description: v.name.trim() });
    try {
      const saved = mode === "create" || !original ? await createRole(v) : await updateRole(original.id, v);
      reset(v);
      toast.success(mode === "create" ? "Role created" : "Changes saved", {
        id: toastId,
        description: mode === "create" ? `${saved.name} is ready. Assign it from Members or when inviting people.` : `${saved.name} was updated for ${plural(assigned.length, "person", "people")}.`,
      });
      guard.navigate(LIST_HREF);
    } catch (err) {
      toast.error(mode === "create" ? "Couldn't create the role" : "Couldn't save changes", { id: toastId, description: errorText(err) });
    }
  };

  /** Persisted reset when the stored role is modified; otherwise only the unsaved matrix goes back to the preset. */
  const onReset = async () => {
    if (!original || !defaults) return;
    if (storedModified) {
      const toastId = toast.loading("Restoring default permissions...", { description: original.name });
      try {
        await resetRoleToDefault(original.id);
        toast.success("Role reset to default", { id: toastId, description: `${original.name} is back to its ${countPermissions(defaults)} default permissions for ${plural(assigned.length, "person", "people")}.` });
      } catch (err) {
        toast.error("Couldn't reset the role", { id: toastId, description: errorText(err) });
        throw err;
      }
    } else {
      toast.success("Default permissions restored", { description: "Your unsaved permission changes were discarded." });
    }
    setValue("permissions", defaults, { shouldValidate: true });
  };

  const onInvalid = (errors: FieldErrors<RoleFormValues>) => {
    const first = errors.name?.message ?? errors.description?.message ?? errors.permissions?.message ?? errors.permissions?.root?.message ?? "Some fields need attention.";
    toast.error("Please fix the highlighted fields", { description: first });
    const el = document.getElementById(errors.name ? "role-name" : errors.description ? "role-description" : "role-permissions");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.focus({ preventScroll: true });
  };

  const permissionsError = formState.errors.permissions?.message ?? formState.errors.permissions?.root?.message;

  return (
    <FormProvider {...form}>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8 text-left">
        <RoleEditorHeader
          mode={mode}
          roleName={original?.name}
          isSystem={!!original?.isSystem}
          modified={differsFromDefault}
          isSubmitting={formState.isSubmitting}
          onReset={defaults ? () => setConfirmReset(true) : undefined}
          canReset={storedModified || differsFromDefault}
        />

        <form id={ROLE_FORM_ID} noValidate onSubmit={handleSubmit(onSubmit, onInvalid)} className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
          <div className="min-w-0 space-y-5 xl:col-span-8">
            {original && defaults && <SystemRoleCallout roleName={original.name} permissions={current.permissions as RolePermissions} defaults={defaults} />}
            <RoleDetailsCard nameLocked={!!original?.isSystem} />
            <Controller
              control={control}
              name="permissions"
              render={({ field }) => <PermissionsCard value={field.value as RolePermissions} onChange={(next) => field.onChange(next)} error={permissionsError} modified={differsFromDefault} />}
            />
            <RoleSaveBar mode={mode} isDirty={isDirty} isSubmitting={formState.isSubmitting} onCancel={() => guard.leave(LIST_HREF)} />
          </div>
          <aside className="min-w-0 space-y-5 xl:sticky xl:top-6 xl:col-span-4">
            <RoleSummaryCard permissions={current.permissions as RolePermissions} />
            <RoleMembersCard members={assigned} roleId={original?.id} isNew={mode === "create"} />
            <ProTipCard>
              {original?.isSystem
                ? "Changes apply to everyone with this role. Need more access for just one person? Give them extra permissions from their profile instead."
                : "Start from the closest role with \"Duplicate\", then remove what this team doesn't need. Fewer permissions means fewer mistakes."}
            </ProTipCard>
          </aside>
        </form>
      </motion.div>

      <ConfirmModal
        isOpen={!!guard.pendingHref}
        title="Discard unsaved changes?"
        subtitle={mode === "create" ? "This role hasn't been created yet." : "Your edits haven't been saved."}
        message="If you leave now, the changes you made on this page will be lost."
        confirmLabel="Discard changes"
        pendingLabel="Leaving..."
        confirmIcon={<Undo2 className="h-4 w-4" />}
        onClose={guard.cancelLeave}
        onConfirm={async () => {
          guard.confirmLeave();
        }}
      />

      {original && defaults && (
        <ConfirmModal
          isOpen={confirmReset}
          title="Reset to default permissions?"
          subtitle={original.name}
          message={
            storedModified
              ? `${original.name} goes back to its ${countPermissions(defaults)} built-in permissions right away for ${plural(assigned.length, "person", "people")}. Extra permissions given to individual members are kept.`
              : "Your unsaved permission changes will be replaced with the built-in preset."
          }
          confirmLabel="Reset to default"
          pendingLabel="Resetting..."
          confirmIcon={<RotateCcw className="h-4 w-4" />}
          onClose={() => setConfirmReset(false)}
          onConfirm={onReset}
        />
      )}
    </FormProvider>
  );
}

export default RoleEditorForm;
