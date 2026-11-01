"use client";

import React from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";

export interface CertificatesHeaderProps {
  onVerify: () => void;
  onIssue: () => void;
}

/** Breadcrumb (Home › Certificates), title + subtitle, "Verify Certificate" and orange "+ Issue Certificate". */
export function CertificatesHeader({ onVerify, onIssue }: CertificatesHeaderProps) {
  return (
    <PageHeader
      className="mb-0"
      breadcrumbs={[{ label: "Certificates" }]}
      title={<span className="heading-h3 font-bold! text-primary-500">Certificates</span>}
      subtitle="Issue, verify and manage course certificates and the templates they are printed on."
      action={
        <>
          <SecondaryButton size="lg" leftIcon={<ShieldCheck />} onClick={onVerify}>
            Verify Certificate
          </SecondaryButton>
          <PrimaryButton size="lg" leftIcon={<Plus />} onClick={onIssue}>
            Issue Certificate
          </PrimaryButton>
        </>
      }
    />
  );
}

export default CertificatesHeader;
