"use client";

import React, { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InstructorDetailCard } from "../InstructorDetailCard";
import { InstructorFullDetails } from "../instructorDetailsData";
import { InfoRow } from "./InfoRow";

interface AccountAccessCardProps {
  email: string;
  account: InstructorFullDetails["account"];
}

export function AccountAccessCard({ email, account }: AccountAccessCardProps) {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetPassword = async () => {
    setIsResetting(true);
    const toastId = toast.loading("Resetting password...", {
      description: "Generating a new secure password.",
    });
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      toast.success("Password reset", {
        id: toastId,
        description: `A new password has been emailed to ${email}.`,
      });
    } catch {
      toast.error("Could not reset password", {
        id: toastId,
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <InstructorDetailCard icon={<Lock />} title="Account & Access">
      <div className="divide-y divide-dash">
        <InfoRow
          label="Password"
          action={
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={isResetting}
              title="Reset password and email a new one"
              aria-label="Reset password"
              className="h-8 min-w-16 px-3.5 rounded-lg border border-dash bg-white body-xsm-medium text-blue hover:bg-blue-14 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap inline-flex items-center justify-center"
            >
              {isResetting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Reset"}
            </button>
          }
        >
          <span className="block truncate tracking-widest text-primary-500">•••••••••</span>
        </InfoRow>
        <InfoRow label="Two-Factor Auth">
          <span className="inline-flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${account.twoFactorEnabled ? "bg-green" : "bg-primary-300"}`} />
            {account.twoFactorEnabled ? "Enabled" : "Disabled"}
          </span>
        </InfoRow>
        <InfoRow label="Account Created">{account.createdAt}</InfoRow>
        <InfoRow label="Last Login">{account.lastLogin}</InfoRow>
      </div>
    </InstructorDetailCard>
  );
}

export default AccountAccessCard;
