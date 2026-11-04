"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { ModalShell } from "@/components/ui/ModalShell";
import { twoFactorApi } from "@/lib/api/twoFactor";
import { apiErrorMessage } from "@/lib/apiError";
import { TwoFactorCodeForm } from "./TwoFactorCodeForm";

export interface TwoFactorDisableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDisabled: () => void;
}

/** Turning 2FA off needs a current code, so a stolen session alone can't do it. */
export function TwoFactorDisableModal({ isOpen, onClose, onDisabled }: TwoFactorDisableModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const disable = async (code: string) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Turning off two-factor authentication...", { description: "Checking your code" });
    try {
      await twoFactorApi.disable(code);
      toast.success("Two-factor authentication is off", { id: toastId, description: "Your account is protected by your password only." });
      onDisabled();
      onClose();
    } catch (err) {
      toast.error("Couldn't turn off 2FA", { id: toastId, description: apiErrorMessage(err, "Check your authenticator app and try the newest code.") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell isOpen={isOpen} onClose={isSubmitting ? () => {} : onClose} title="Turn off two-factor authentication" subtitle="Enter a code from your authenticator app to confirm." maxWidth="sm">
      <TwoFactorCodeForm submitLabel="Turn off 2FA" variant="danger" isSubmitting={isSubmitting} onSubmit={disable} />
    </ModalShell>
  );
}

export default TwoFactorDisableModal;
