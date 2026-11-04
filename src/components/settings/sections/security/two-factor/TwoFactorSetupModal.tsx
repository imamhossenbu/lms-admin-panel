"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ModalShell } from "@/components/ui/ModalShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { twoFactorApi, type TwoFactorSetup } from "@/lib/api/twoFactor";
import { apiErrorMessage } from "@/lib/apiError";
import { TwoFactorCodeForm } from "./TwoFactorCodeForm";

export interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnabled: () => void;
}

/** Scan the QR code (or type the key), then confirm with a code from the app. */
export function TwoFactorSetupModal({ isOpen, onClose, onEnabled }: TwoFactorSetupModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <ModalShell isOpen={isOpen} onClose={isSubmitting ? () => {} : onClose} title="Set up two-factor authentication" subtitle="Use Google Authenticator, 1Password, Authy or any TOTP app." maxWidth="md">
      {/* Mounted fresh on every open → a new secret each time, no stale state. */}
      {isOpen && <SetupBody onClose={onClose} onEnabled={onEnabled} isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} />}
    </ModalShell>
  );
}

function SetupBody({ onClose, onEnabled, isSubmitting, setIsSubmitting }: { onClose: () => void; onEnabled: () => void; isSubmitting: boolean; setIsSubmitting: (v: boolean) => void }) {
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    twoFactorApi
      .setup()
      .then((s) => !cancelled && setSetup(s))
      .catch((err) => !cancelled && setLoadError(apiErrorMessage(err, "Couldn't start the setup. Please try again.")));
    return () => {
      cancelled = true;
    };
  }, []);

  const enable = async (code: string) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Turning on two-factor authentication...", { description: "Checking your code" });
    try {
      await twoFactorApi.enable(code);
      toast.success("Two-factor authentication is on", { id: toastId, description: "You'll enter a code from your app each time you sign in." });
      onEnabled();
      onClose();
    } catch (err) {
      toast.error("That code didn't work", { id: toastId, description: apiErrorMessage(err, "Check your authenticator app and try the newest code.") });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadError) return <p className="body-sm-regular text-red">{loadError}</p>;
  if (!setup)
    return (
      <div className="animate-pulse space-y-4" aria-hidden>
        <div className="mx-auto h-44 w-44 rounded-xl bg-slate-100" />
        <div className="h-10 rounded-xl bg-slate-100" />
        <div className="flex justify-between gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 flex-1 rounded-xl border border-dash bg-slate-100" />
          ))}
        </div>
        <div className="h-11 rounded-xl bg-slate-200" />
      </div>
    );
  return (
    <div className="space-y-5">
      <ol className="space-y-1 body-sm-regular text-primary-400">
        <li>1. Scan this QR code with your authenticator app.</li>
        <li>2. Enter the 6-digit code it shows to confirm.</li>
      </ol>
      {/* eslint-disable-next-line @next/next/no-img-element -- data URL from the API */}
      <img src={setup.qrCodeDataUrl} alt="QR code for your authenticator app" className="mx-auto h-44 w-44 rounded-xl border border-dash p-2" />
      <div className="flex items-center justify-between gap-3 rounded-xl border border-dash bg-slate-50 px-4 py-3">
        <div className="min-w-0">
          <p className="body-xsm-regular text-primary-300">Can&apos;t scan? Enter this key</p>
          <p className="truncate font-mono body-sm-medium text-primary-500 tracking-wider">{setup.secret}</p>
        </div>
        <CopyButton value={setup.secret} label="Setup key copied" />
      </div>
      <TwoFactorCodeForm submitLabel="Turn on 2FA" isSubmitting={isSubmitting} onSubmit={enable} />
    </div>
  );
}

export default TwoFactorSetupModal;
