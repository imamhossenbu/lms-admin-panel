"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface QuizFooterAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  /** Icon placement (default: right for "Save & Continue →", left otherwise). */
  iconSide?: "left" | "right";
  isLoading?: boolean;
  loadingLabel?: string;
}

export interface QuizWizardFooterProps {
  /** "cancel" on the first step, "previous" elsewhere. */
  backKind: "cancel" | "previous";
  onBack: () => void;
  primary: QuizFooterAction;
  /** Optional secondary action next to the primary one (Review: "Save as Draft"). */
  secondary?: QuizFooterAction;
  /** Disables every button (a save is in flight). */
  busy?: boolean;
}

/** Full-width action bar under each step: Cancel / ← Previous left, (secondary +) orange primary right. */
export function QuizWizardFooter({ backKind, onBack, primary, secondary, busy }: QuizWizardFooterProps) {
  const iconProps = (a: QuizFooterAction) =>
    a.isLoading ? {} : (a.iconSide ?? "left") === "right" ? { rightIcon: a.icon } : { leftIcon: a.icon };
  return (
    <div className="mt-5 flex flex-col-reverse gap-3 border-t border-dash pt-5 sm:flex-row sm:items-center sm:justify-between">
      <SecondaryButton size="lg" onClick={onBack} disabled={busy} leftIcon={<ArrowLeft />}>
        {backKind === "previous" ? "Previous" : "Cancel"}
      </SecondaryButton>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        {secondary && (
          <SecondaryButton size="lg" onClick={secondary.onClick} disabled={busy} isLoading={secondary.isLoading} {...iconProps(secondary)}>
            {secondary.isLoading ? secondary.loadingLabel ?? "Please wait..." : secondary.label}
          </SecondaryButton>
        )}
        <PrimaryButton size="lg" onClick={primary.onClick} disabled={busy} isLoading={primary.isLoading} {...iconProps(primary)}>
          {primary.isLoading ? primary.loadingLabel ?? "Please wait..." : primary.label}
        </PrimaryButton>
      </div>
    </div>
  );
}

/** "Save & Continue →" primary action. */
export const continueAction = (onClick: () => void): QuizFooterAction => ({
  label: "Save & Continue",
  onClick,
  icon: <ArrowRight />,
  iconSide: "right",
});

export default QuizWizardFooter;
