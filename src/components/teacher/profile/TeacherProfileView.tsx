"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { KeyRound, Mail, Phone, Save, User } from "lucide-react";
import { apiErrorMessage } from "@/lib/apiError";
import { teacherApi } from "@/lib/api/teacher";
import { usePagedList } from "@/lib/usePagedList";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import { PageHeader } from "@/components/ui/PageHeader";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsRow } from "@/components/settings/shared/SettingsRow";
import { PageFade } from "../shared/PageFade";
import { PanelSkeleton } from "../shared/PanelSkeleton";
import { TeacherAvatarCard } from "./TeacherAvatarCard";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z.string().trim().regex(/^$|^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number"),
  headline: z.string().trim().max(100, "Keep it under 100 characters"),
  expertise: z.string().trim().max(300, "Too long"),
  bio: z.string().trim().max(2000, "Keep your bio under 2,000 characters"),
});
const passwordSchema = z
  .object({ currentPassword: z.string().min(1, "Enter your current password"), newPassword: z.string().min(8, "Use at least 8 characters").max(100), confirm: z.string() })
  .refine((v) => v.newPassword === v.confirm, { message: "Passwords don't match", path: ["confirm"] });

/** The teacher's public profile (shown on the academy website) and password. */
export function TeacherProfileView() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const d = usePagedList(() => teacherApi.profile(), "profile");
  const pf = useForm<z.infer<typeof profileSchema>>({ resolver: zodResolver(profileSchema), mode: "onTouched" });
  const pw = useForm<z.infer<typeof passwordSchema>>({ resolver: zodResolver(passwordSchema), mode: "onTouched", defaultValues: { currentPassword: "", newPassword: "", confirm: "" } });
  const data = d.data;
  useEffect(() => {
    if (data) pf.reset({ name: data.name, phone: data.phone ?? "", headline: data.headline ?? "", expertise: data.expertise ?? "", bio: data.bio ?? "" });
  }, [data, pf]);

  if (d.error && !data) return <LoadErrorCard title="Couldn't load your profile" message={d.error} onRetry={d.reload} />;
  if (!data) return <PanelSkeleton />;

  const saveProfile = pf.handleSubmit(async (v) => {
    const id = toast.loading("Saving your profile…");
    try {
      const next = await teacherApi.saveProfile(v);
      pf.reset({ name: next.name, phone: next.phone ?? "", headline: next.headline ?? "", expertise: next.expertise ?? "", bio: next.bio ?? "" });
      if (user) dispatch(setUser({ ...user, name: next.name, phone: next.phone }));
      toast.success("Profile saved", { id, description: "Learners see this on the academy website." });
    } catch (e) {
      toast.error("Couldn't save your profile", { id, description: apiErrorMessage(e) });
    }
  });
  const changePassword = pw.handleSubmit(async (v) => {
    const id = toast.loading("Updating your password…");
    try {
      await teacherApi.changePassword(v.currentPassword, v.newPassword);
      pw.reset();
      toast.success("Password changed", { id, description: "Use the new password next time you sign in." });
    } catch (e) {
      const msg = apiErrorMessage(e);
      toast.error("Couldn't change your password", { id, description: msg });
      pw.setError(/current/i.test(msg) ? "currentPassword" : "newPassword", { message: msg });
    }
  });
  const e = pf.formState.errors;
  const pe = pw.formState.errors;

  return (
    <PageFade>
      <PageHeader title="Profile" description="Your instructor profile on the academy website, and your password." />
      <TeacherAvatarCard name={data.name} avatar={data.avatar} />
      <form onSubmit={saveProfile} noValidate>
        <SettingsCard icon={<User className="h-5 w-5" />} title="Instructor profile" description="Shown on your courses and the Instructors page.">
          <SettingsRow label="Full name" htmlFor="t-name" required>
            <InputField id="t-name" error={e.name?.message} {...pf.register("name")} />
          </SettingsRow>
          <SettingsRow label="Email" description="Your sign-in email — ask an admin to change it.">
            <InputField id="t-email" value={data.email} readOnly disabled leftElement={<Mail className="h-4 w-4" />} />
          </SettingsRow>
          <SettingsRow label="Phone" htmlFor="t-phone">
            <InputField id="t-phone" type="tel" placeholder="+880 1XXX-XXXXXX" leftElement={<Phone className="h-4 w-4" />} error={e.phone?.message} {...pf.register("phone")} />
          </SettingsRow>
          <SettingsRow label="Headline" description='e.g. "Senior Full-stack Engineer"' htmlFor="t-headline">
            <InputField id="t-headline" error={e.headline?.message} {...pf.register("headline")} />
          </SettingsRow>
          <SettingsRow label="Expertise" description="Comma-separated, e.g. React, Node.js, UI Design" htmlFor="t-expertise">
            <InputField id="t-expertise" error={e.expertise?.message} {...pf.register("expertise")} />
          </SettingsRow>
          <SettingsRow label="Bio" htmlFor="t-bio">
            <TextAreaField id="t-bio" rows={5} error={e.bio?.message} {...pf.register("bio")} />
          </SettingsRow>
          <div className="flex justify-end p-5">
            <PrimaryButton type="submit" isLoading={pf.formState.isSubmitting} disabled={!pf.formState.isDirty} leftIcon={<Save className="h-4 w-4" />}>
              Save profile
            </PrimaryButton>
          </div>
        </SettingsCard>
      </form>
      <form onSubmit={changePassword} noValidate>
        <SettingsCard icon={<KeyRound className="h-5 w-5" />} title="Password" description="Use a password you don't use anywhere else." tone="purple">
          <SettingsRow label="Current password" htmlFor="t-pw-current">
            <InputField id="t-pw-current" type="password" autoComplete="current-password" error={pe.currentPassword?.message} {...pw.register("currentPassword")} />
          </SettingsRow>
          <SettingsRow label="New password" htmlFor="t-pw-new">
            <InputField id="t-pw-new" type="password" autoComplete="new-password" error={pe.newPassword?.message} {...pw.register("newPassword")} />
          </SettingsRow>
          <SettingsRow label="Confirm new password" htmlFor="t-pw-confirm">
            <InputField id="t-pw-confirm" type="password" autoComplete="new-password" error={pe.confirm?.message} {...pw.register("confirm")} />
          </SettingsRow>
          <div className="flex justify-end p-5">
            <PrimaryButton type="submit" isLoading={pw.formState.isSubmitting} leftIcon={<KeyRound className="h-4 w-4" />}>
              Change password
            </PrimaryButton>
          </div>
        </SettingsCard>
      </form>
    </PageFade>
  );
}

export default TeacherProfileView;
