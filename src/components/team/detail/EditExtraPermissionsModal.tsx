"use client";

import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeySquare } from "lucide-react";
import type { RolePermissions, TeamMember, TeamRole } from "@/types/team";
import { extraPermissionsFormSchema, type ExtraPermissionsFormValues } from "@/validations/teamSchema";
import { countPermissions, normalizeExtras, samePermissions } from "@/lib/teamPermissions";
import { ModalShell } from "@/components/ui/ModalShell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { ExtraPermissionsPicker } from "../shared/ExtraPermissionsPicker";

export interface EditExtraPermissionsModalProps {
  isOpen: boolean;
  member: TeamMember;
  role: TeamRole;
  onClose: () => void;
  /** Throw to keep the modal open (the caller toasts the error). */
  onSubmit: (extras: RolePermissions) => Promise<unknown>;
}

function ExtraPermissionsForm({ member, role, onClose, onSubmit }: Omit<EditExtraPermissionsModalProps, "isOpen">) {
  const initial = normalizeExtras(member.extraPermissions, role.permissions);
  const { control, handleSubmit, formState } = useForm<ExtraPermissionsFormValues>({
    resolver: zodResolver(extraPermissionsFormSchema),
    defaultValues: { extraPermissions: initial },
  });
  const raw = useWatch({ control, name: "extraPermissions" }) as RolePermissions;
  const extras = normalizeExtras(raw, role.permissions);
  const unchanged = samePermissions(extras, initial);
  const n = countPermissions(extras);

  const submit = async (v: ExtraPermissionsFormValues) => {
    try {
      await onSubmit(normalizeExtras(v.extraPermissions, role.permissions));
      onClose();
    } catch {
      /* toast already shown */
    }
  };

  return (
    <ModalShell
      isOpen
      onClose={formState.isSubmitting ? () => {} : onClose}
      title="Edit extra permissions"
      subtitle={`Give ${member.name || member.email} access on top of ${role.name}. Role permissions can't be removed here.`}
      maxWidth="xl"
      footer={
        <>
          <SecondaryButton onClick={onClose} disabled={formState.isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form="extra-permissions-form" isLoading={formState.isSubmitting} disabled={formState.isSubmitting || unchanged} leftIcon={<KeySquare className="h-4 w-4" />}>
            {formState.isSubmitting ? "Saving..." : n === 0 && countPermissions(initial) > 0 ? "Remove all extras" : "Save extra permissions"}
          </PrimaryButton>
        </>
      }
    >
      <form id="extra-permissions-form" noValidate onSubmit={handleSubmit(submit)}>
        <Controller
          control={control}
          name="extraPermissions"
          render={({ field, fieldState }) => (
            <ExtraPermissionsPicker role={role} value={extras} onChange={(next) => field.onChange(next)} error={fieldState.error?.message} disabled={formState.isSubmitting} />
          )}
        />
      </form>
    </ModalShell>
  );
}

/** Member detail: grant / revoke extra permissions on top of the member's role (react-hook-form + zod). */
export function EditExtraPermissionsModal({ isOpen, ...rest }: EditExtraPermissionsModalProps) {
  if (!isOpen) return null;
  return <ExtraPermissionsForm key={rest.member.id} {...rest} />;
}

export default EditExtraPermissionsModal;
