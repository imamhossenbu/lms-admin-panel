"use client";

import React, { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { toast } from "sonner";
import type { TeamRole, TeamSeed } from "@/types/team";
import { INVITE_EXPIRY_DAYS, INVITE_MAX_EMAILS, INVITE_MESSAGE_MAX, inviteFormSchema, isValidEmail, type InviteFormValues } from "@/validations/teamSchema";
import { inviteMembers, teamEmails } from "@/lib/teamStorage";
import { sortRoles } from "@/lib/teamStats";
import { SUPER_ADMIN_ROLE_ID } from "@/data/mockTeamData";
import { ModalShell } from "@/components/ui/ModalShell";
import { TagsInput } from "@/components/ui/TagsInput";
import { AppSelect } from "@/components/ui/AppSelect";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { CharCounter } from "@/components/ui/CharCounter";
import { FieldLabel } from "@/components/ui/SelectField";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { SettingsCallout } from "@/components/settings/sections/security/SettingsCallout";
import { RoleAccessPreview } from "../shared/RoleAccessPreview";
import { errorText, plural } from "../shared/teamFormat";

export interface InviteMemberModalProps {
  isOpen: boolean;
  data: TeamSeed;
  onClose: () => void;
  /** Called with the number of invitations sent. */
  onInvited?: (count: number) => void;
}

const DEFAULT_ROLE = "role-support";
/** Splits pasted lists ("a@x.com, b@y.com") and drops repeats (TagsInput keys chips by text). */
const splitEmails = (tags: string[]) => Array.from(new Set(tags.flatMap((t) => t.split(/[\s,;]+/)).map((t) => t.trim().toLowerCase()).filter(Boolean)));

function InviteForm({ data, onClose, onInvited }: Omit<InviteMemberModalProps, "isOpen">) {
  const roles = useMemo(() => sortRoles(data.roles).filter((r) => r.id !== SUPER_ADMIN_ROLE_ID), [data.roles]);
  const taken = useMemo(() => teamEmails(data), [data]);
  const schema = useMemo(() => inviteFormSchema(taken, roles.map((r) => r.id)), [taken, roles]);
  const { control, register, handleSubmit, formState } = useForm<InviteFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { emails: [], roleId: roles.some((r) => r.id === DEFAULT_ROLE) ? DEFAULT_ROLE : (roles[0]?.id ?? ""), message: "" },
  });
  const [emails, roleId, message] = useWatch({ control, name: ["emails", "roleId", "message"] });
  const role: TeamRole | undefined = roles.find((r) => r.id === roleId);
  const { errors, isSubmitting } = formState;

  const tagTone = (tag: string) => {
    const e = tag.toLowerCase();
    if (!isValidEmail(e)) return { tone: "red" as const, hint: "Invalid email" };
    if (taken.includes(e)) return { tone: "red" as const, hint: "Already on the team or invited" };
    return { tone: "gray" as const, hint: "" };
  };

  const submit = async (v: InviteFormValues) => {
    const target = roles.find((r) => r.id === v.roleId);
    const toastId = toast.loading(`Sending ${plural(v.emails.length, "invitation")}...`, { description: target ? `As ${target.name}` : undefined });
    try {
      const created = await inviteMembers(v.emails, v.roleId, v.message);
      toast.success(created.length === 1 ? "Invitation sent" : "Invitations sent", {
        id: toastId,
        description: `${created.length === 1 ? created[0].email : plural(created.length, "person", "people")} will get an email to join as ${target?.name}. Links expire in ${INVITE_EXPIRY_DAYS} days.`,
      });
      onInvited?.(created.length);
      onClose();
    } catch (err) {
      toast.error("Couldn't send invitations", { id: toastId, description: errorText(err) });
    }
  };

  const count = emails.length;
  return (
    <ModalShell
      isOpen
      onClose={isSubmitting ? () => {} : onClose}
      title="Invite team members"
      subtitle="They'll get an email with a link to join the admin panel."
      maxWidth="lg"
      footer={
        <>
          <SecondaryButton onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form="invite-member-form" isLoading={isSubmitting} disabled={isSubmitting} leftIcon={<Send className="h-4 w-4" />}>
            {isSubmitting ? "Sending..." : count > 1 ? `Send ${count} invitations` : "Send invitation"}
          </PrimaryButton>
        </>
      }
    >
      <form id="invite-member-form" noValidate onSubmit={handleSubmit(submit)} className="space-y-5">
        <div>
          <FieldLabel htmlFor="invite-emails">
            Email addresses <span className="text-red">*</span>
          </FieldLabel>
          <Controller
            control={control}
            name="emails"
            render={({ field }) => (
              <TagsInput
                id="invite-emails"
                value={field.value}
                onChange={(tags) => field.onChange(splitEmails(tags))}
                placeholder="name@company.com — press Enter or comma to add"
                maxTags={INVITE_MAX_EMAILS}
                maxLength={254}
                error={errors.emails?.message}
                renderTag={(tag) => {
                  const t = tagTone(tag);
                  return (
                    <span title={t.hint || tag}>
                      <ToneBadge tone={t.tone} size="sm">
                        {tag}
                      </ToneBadge>
                    </span>
                  );
                }}
              />
            )}
          />
          {!errors.emails && (
            <p className="mt-1 body-xsm-regular text-primary-300">
              Up to {INVITE_MAX_EMAILS} people at once. You can paste a comma-separated list.
            </p>
          )}
        </div>

        <div>
          <FieldLabel>
            Role <span className="text-red">*</span>
          </FieldLabel>
          <Controller
            control={control}
            name="roleId"
            render={({ field }) => (
              <AppSelect value={field.value} onValueChange={field.onChange} options={roles.map((r) => ({ value: r.id, label: r.name }))} placeholder="Choose a role" fullWidth />
            )}
          />
          {errors.roleId && <p className="mt-1.5 body-xsm-regular text-red">{errors.roleId.message}</p>}
          <div className="mt-3">
            <RoleAccessPreview role={role} />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="invite-message">Personal message (optional)</FieldLabel>
          <TextAreaField id="invite-message" rows={3} placeholder="Add a short note to the invitation email..." error={errors.message?.message} {...register("message")} />
          <CharCounter count={message.length} max={INVITE_MESSAGE_MAX} className="mt-1" />
        </div>

        <SettingsCallout tone="info" title={`Invitations expire after ${INVITE_EXPIRY_DAYS} days`}>
          You can resend or revoke pending invitations from the Invitations tab. Super Admin can&apos;t be granted by invitation.
        </SettingsCallout>
      </form>
    </ModalShell>
  );
}

/** Invite modal: multiple emails (per-email validation), role + live access preview, optional message. */
export function InviteMemberModal({ isOpen, ...rest }: InviteMemberModalProps) {
  if (!isOpen) return null;
  return <InviteForm {...rest} />;
}

export default InviteMemberModal;
