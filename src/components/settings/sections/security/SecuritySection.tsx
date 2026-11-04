"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useSettingsSection } from "@/components/settings/useSettingsSection";
import { SettingsSectionLayout } from "@/components/settings/shared/SettingsSectionLayout";
import { SettingsSaveBar } from "@/components/settings/shared/SettingsSaveBar";
import { RecentChangesCard } from "@/components/settings/shared/RecentChangesCard";
import { AdminSignInCard } from "./AdminSignInCard";
import { MyTwoFactorCard } from "./two-factor/MyTwoFactorCard";
import { PasswordPolicyCard } from "./PasswordPolicyCard";
import { SessionsCard } from "./SessionsCard";
import { LoginProtectionCard } from "./LoginProtectionCard";
import { IpAllowlistCard } from "./IpAllowlistCard";
import { SecurityScoreCard } from "./SecurityScoreCard";
import { PasswordStrengthChecker } from "./PasswordStrengthChecker";
import { ipEntryError, SECURITY_LABELS } from "./securityUtils";

/** Settings › Security: admin 2FA, password policy, sessions, lockout, IP allowlist + live score. */
export function SecuritySection() {
  const { form, store, isSaving, save, discard } = useSettingsSection("security", SECURITY_LABELS);

  // The schema only checks the IP shape; also reject impossible octets / prefixes before saving.
  const handleSave = async () => {
    const bad = form.getValues("ipAllowlist").find((ip) => ipEntryError(ip));
    if (bad) {
      form.setError("ipAllowlist", { type: "manual", message: `${bad} is not a valid IPv4 address or CIDR` });
      toast.error("Please fix the highlighted fields", { description: "Remove or correct the invalid IP entries." });
      return false;
    }
    return save();
  };

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void handleSave();
        }}
      >
        <SettingsSectionLayout
          title="Security"
          description="Protect admin accounts, passwords and sign-ins."
          icon={<ShieldCheck className="h-5 w-5" />}
          updatedAt={store.updatedAt.security}
          aside={
            <>
              <SecurityScoreCard />
              <PasswordStrengthChecker />
              <RecentChangesCard store={store} section="security" />
            </>
          }
        >
          <MyTwoFactorCard />
          <AdminSignInCard />
          <PasswordPolicyCard />
          <SessionsCard />
          <LoginProtectionCard />
          <IpAllowlistCard />
          <SettingsSaveBar isDirty={form.formState.isDirty} isSaving={isSaving} onSave={handleSave} onDiscard={discard} />
        </SettingsSectionLayout>
      </form>
    </FormProvider>
  );
}

export default SecuritySection;
