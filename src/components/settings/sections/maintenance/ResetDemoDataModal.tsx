"use client";

import React, { useId, useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { resetAllMockData } from "@/lib/settingsStorage";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { wait } from "./maintenanceUtils";

const PHRASE = "RESET";

export interface ResetDemoDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Type-to-confirm wipe of every edupro_* mock key, then reload. */
export function ResetDemoDataModal({ isOpen, onClose }: ResetDemoDataModalProps) {
  const [typed, setTyped] = useState("");
  const [pending, setPending] = useState(false);
  const [touched, setTouched] = useState(false);
  const id = useId();
  const matches = typed.trim() === PHRASE;

  const close = () => {
    if (pending) return;
    setTyped("");
    setTouched(false);
    onClose();
  };

  const confirm = async () => {
    setTouched(true);
    if (!matches) return;
    setPending(true);
    const toastId = toast.loading("Resetting demo data...", { description: "Clearing everything stored in this browser." });
    try {
      await wait(800);
      resetAllMockData();
      toast.success("Demo data reset", { id: toastId, description: "Reloading with fresh sample data..." });
      await wait(700);
      window.location.reload();
    } catch {
      toast.error("Couldn't reset demo data", { id: toastId, description: "Please try again." });
      setPending(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={close}
      title="Reset all demo data?"
      subtitle="This action cannot be undone."
      maxWidth="sm"
      footer={
        <>
          <SecondaryButton onClick={close} disabled={pending}>
            Cancel
          </SecondaryButton>
          <PrimaryButton variant="danger" onClick={confirm} isLoading={pending} disabled={pending || !matches} leftIcon={<RotateCcw className="h-4 w-4" />}>
            {pending ? "Resetting..." : "Reset demo data"}
          </PrimaryButton>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-red/30 bg-red-14 p-3.5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red" />
          <p className="body-sm-regular text-red-dark">
            Every course, student, payment, notification and setting saved in this browser will be wiped and replaced with the original sample data.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // The modal is portalled, but React events still bubble to the section's <form>.
            e.stopPropagation();
            void confirm();
          }}
        >
          <label htmlFor={id} className="mb-2 block body-sm-medium text-primary-500">
            Type <span className="body-sm-medium font-semibold! text-red">{PHRASE}</span> to confirm
          </label>
          <InputField
            id={id}
            autoComplete="off"
            autoFocus
            placeholder={PHRASE}
            value={typed}
            disabled={pending}
            onChange={(e) => setTyped(e.target.value.toUpperCase())}
            onBlur={() => setTouched(true)}
            aria-invalid={touched && !matches}
            error={touched && typed && !matches ? `Type ${PHRASE} exactly` : undefined}
          />
        </form>
      </div>
    </ModalShell>
  );
}

export default ResetDemoDataModal;
