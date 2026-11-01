"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface WizardFooterProps {
  /** "cancel" on the first step, "previous" elsewhere. */
  backKind: "cancel" | "previous";
  onBack: () => void;
  primaryLabel: string;
  onPrimary: () => void;
  isBusy?: boolean;
  busyLabel?: string;
  disabled?: boolean;
}

/** Bottom action bar of every step: Cancel / ← Previous on the left, blue primary action on the right. */
export function WizardFooter({ backKind, onBack, primaryLabel, onPrimary, isBusy, busyLabel, disabled }: WizardFooterProps) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-dash pt-5 sm:flex-row sm:items-center sm:justify-between">
      <SecondaryButton
        size="lg"
        onClick={onBack}
        disabled={isBusy}
        leftIcon={backKind === "previous" ? <ArrowLeft /> : undefined}
      >
        {backKind === "previous" ? "Previous" : "Cancel"}
      </SecondaryButton>
      <PrimaryButton
        size="lg"
        onClick={onPrimary}
        isLoading={isBusy}
        disabled={isBusy || disabled}
        rightIcon={isBusy ? undefined : <ArrowRight />}
      >
        {isBusy ? busyLabel ?? "Please wait..." : primaryLabel}
      </PrimaryButton>
    </div>
  );
}

export default WizardFooter;
