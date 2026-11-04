"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import { toast } from "sonner";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsBlockRow } from "@/components/settings/shared/SettingsRow";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { twoFactorApi } from "@/lib/api/twoFactor";
import { teamAccessApi } from "@/lib/api/team";
import { apiErrorMessage } from "@/lib/apiError";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAccess } from "@/store/slices/authSlice";
import { SettingsCallout } from "../SettingsCallout";
import { TwoFactorDisableModal } from "./TwoFactorDisableModal";
import { TwoFactorSetupModal } from "./TwoFactorSetupModal";

/** "Your two-factor authentication": the signed-in admin's own authenticator app (separate from the workspace rule). */
export function MyTwoFactorCard() {
  const dispatch = useAppDispatch();
  const setupRequired = useAppSelector((s) => s.auth.access?.twoFactorSetupRequired ?? false);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [modal, setModal] = useState<"setup" | "disable" | null>(null);

  useEffect(() => {
    twoFactorApi
      .status()
      .then((s) => setEnabled(s.enabled))
      .catch((err) => {
        setEnabled(false);
        toast.error("Couldn't load your 2FA status", { description: apiErrorMessage(err) });
      });
  }, []);

  // Sent here because the workspace requires 2FA: the setup opens right away (until dismissed once).
  const [autoDismissed, setAutoDismissed] = useState(false);
  const setupOpen = modal === "setup" || (setupRequired && enabled === false && !autoDismissed);
  const closeModal = () => {
    setModal(null);
    setAutoDismissed(true);
  };

  /** Team access carries `twoFactorSetupRequired`, which unlocks the rest of the panel once 2FA is on. */
  const refreshAccess = useCallback(async (on: boolean) => {
    setEnabled(on);
    try {
      dispatch(setAccess(await teamAccessApi.me()));
    } catch {
      /* not a team member — nothing to refresh */
    }
  }, [dispatch]);

  return (
    <SettingsCard
      icon={<Smartphone className="h-5 w-5" />}
      tone="blue"
      title="Your two-factor authentication"
      description="Protect your own admin account with a code from an authenticator app."
      action={
        enabled === null ? (
          <span className="h-6 w-24 animate-pulse rounded-full bg-slate-100" aria-hidden />
        ) : (
          <ToneBadge tone={enabled ? "green" : "gray"} size="sm" variant="pill" dot>
            {enabled ? "On" : "Off"}
          </ToneBadge>
        )
      }
    >
      <SettingsBlockRow className="space-y-4">
        {setupRequired && !enabled && (
          <SettingsCallout tone="warning" title="Your workspace requires two-factor authentication">
            Set it up to keep using the admin panel — other pages stay locked until you do.
          </SettingsCallout>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="body-sm-regular text-primary-400">
            {enabled ? "You enter a 6-digit code from your app after your password." : "Anyone with your password can currently sign in as you."}
          </p>
          {enabled === null ? (
            <span className="h-10 w-32 animate-pulse rounded-xl bg-slate-100" aria-hidden />
          ) : (
            <motion.div whileTap={{ scale: 0.96 }}>
              {enabled ? (
                <PrimaryButton type="button" variant="outline" size="sm" onClick={() => setModal("disable")}>
                  Turn off
                </PrimaryButton>
              ) : (
                <PrimaryButton type="button" size="sm" onClick={() => setModal("setup")}>
                  Set up 2FA
                </PrimaryButton>
              )}
            </motion.div>
          )}
        </div>
      </SettingsBlockRow>
      <TwoFactorSetupModal isOpen={setupOpen} onClose={closeModal} onEnabled={() => void refreshAccess(true)} />
      <TwoFactorDisableModal isOpen={modal === "disable"} onClose={closeModal} onDisabled={() => void refreshAccess(false)} />
    </SettingsCard>
  );
}

export default MyTwoFactorCard;
