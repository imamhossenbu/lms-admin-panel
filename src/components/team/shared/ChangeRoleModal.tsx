"use client";

import React, { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCog } from "lucide-react";
import type { TeamMember, TeamRole } from "@/types/team";
import { changeRoleSchema, type ChangeRoleValues } from "@/validations/teamSchema";
import { SUPER_ADMIN_ROLE_ID } from "@/data/mockTeamData";
import { countPermissions, extraCount, listGrants, normalizeExtras, subtractPermissions } from "@/lib/teamPermissions";
import { sortRoles } from "@/lib/teamStats";
import { ModalShell } from "@/components/ui/ModalShell";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { SettingsCallout } from "@/components/settings/sections/security/SettingsCallout";
import { RoleAccessPreview } from "./RoleAccessPreview";
import { plural } from "./teamFormat";

export interface ChangeRoleModalProps {
  member: TeamMember | null;
  roles: TeamRole[];
  onClose: () => void;
  /** Throw to keep the modal open (the caller toasts the error). */
  onSubmit: (member: TeamMember, role: TeamRole) => Promise<unknown>;
}

function ChangeRoleForm({ member, roles, onClose, onSubmit }: ChangeRoleModalProps & { member: TeamMember }) {
  const schema = useMemo(() => changeRoleSchema(member.roleId), [member.roleId]);
  const { control, handleSubmit, formState } = useForm<ChangeRoleValues>({ resolver: zodResolver(schema), defaultValues: { roleId: member.roleId } });
  const roleId = useWatch({ control, name: "roleId" });
  const target = roles.find((r) => r.id === roleId);
  const extrasNow = extraCount(member);
  const kept = target ? (target.isLocked ? null : normalizeExtras(member.extraPermissions, target.permissions)) : member.extraPermissions;
  const dropped = kept ? subtractPermissions(member.extraPermissions, kept) : member.extraPermissions;
  const nDropped = countPermissions(dropped);
  const nKept = kept ? countPermissions(kept) : 0;
  const options = sortRoles(roles)
    .filter((r) => r.id !== SUPER_ADMIN_ROLE_ID || member.status !== "INVITED")
    .map((r) => ({ value: r.id, title: r.name, description: `${countPermissions(r.permissions)} permissions${r.id === member.roleId ? " · current" : ""}` }));

  const submit = async (v: ChangeRoleValues) => {
    const role = roles.find((r) => r.id === v.roleId);
    if (!role) return;
    try {
      await onSubmit(member, role);
      onClose();
    } catch {
      /* toast already shown */
    }
  };

  return (
    <ModalShell
      isOpen
      onClose={formState.isSubmitting ? () => {} : onClose}
      title="Change role"
      subtitle={`Choose what ${member.name || member.email} can access.`}
      maxWidth="lg"
      footer={
        <>
          <SecondaryButton onClick={onClose} disabled={formState.isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form="change-role-form" isLoading={formState.isSubmitting} disabled={formState.isSubmitting} leftIcon={<UserCog className="h-4 w-4" />}>
            {formState.isSubmitting ? "Saving..." : "Change role"}
          </PrimaryButton>
        </>
      }
    >
      <form id="change-role-form" noValidate onSubmit={handleSubmit(submit)} className="space-y-4">
        <Controller
          control={control}
          name="roleId"
          render={({ field }) => <ChoiceCardGroup name="team-role" aria-label="Role" value={field.value} onChange={field.onChange} options={options} columns={2} />}
        />
        {formState.errors.roleId && <p className="body-xsm-regular text-red">{formState.errors.roleId.message}</p>}
        <RoleAccessPreview role={target} />
        {extrasNow > 0 && target && target.id !== member.roleId && (
          <SettingsCallout
            tone={nDropped ? "warning" : "info"}
            title={target.isLocked ? `${target.name} has every permission` : `${plural(nKept, "extra permission")} will be kept`}
          >
            {target.isLocked
              ? `Their ${plural(extrasNow, "extra permission")} will be removed because ${target.name} already includes everything.`
              : nDropped
                ? `${plural(nDropped, "extra permission")} (${listGrants(dropped, 3)}) ${nDropped === 1 ? "is" : "are"} already included in ${target.name}, so ${nDropped === 1 ? "it's" : "they're"} dropped. The rest stay on top of the new role.`
                : `Extras stay on top of ${target.name}. You can change them later from the member's profile.`}
          </SettingsCallout>
        )}
      </form>
    </ModalShell>
  );
}

/** Role picker (radio cards) + live access preview + note on how extra permissions carry over. Remounts per member so defaults are fresh. */
export function ChangeRoleModal(props: ChangeRoleModalProps) {
  if (!props.member) return null;
  return <ChangeRoleForm key={props.member.id} {...props} member={props.member} />;
}

export default ChangeRoleModal;
