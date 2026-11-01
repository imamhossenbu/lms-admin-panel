"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Globe2, Loader2, Lock, RefreshCw, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import type { CustomDomainStatus, Institution } from "@/types/saas";
import { removeCustomDomain, verifyCustomDomain } from "@/lib/saasStorage";
import { ToneBadge, type Tone } from "@/components/ui/ToneBadge";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { CopyButton } from "@/components/ui/CopyButton";
import { errorMessage, formatBillingDate } from "@/components/billing/shared/billingFormat";
import { SettingsCard } from "../../shared/SettingsCard";
import { SettingsBlockRow } from "../../shared/SettingsRow";
import { AddDomainForm } from "./AddDomainForm";
import { DnsRecordsTable } from "./DnsRecordsTable";

const STATUS_META: Record<CustomDomainStatus, { label: string; tone: Tone }> = {
  PENDING_DNS: { label: "Waiting for DNS", tone: "yellow" },
  VERIFIED: { label: "Verified", tone: "green" },
  FAILED: { label: "Verification failed", tone: "red" },
};

/** Add / verify / remove the institution's own domain (Pro and above). */
export function CustomDomainCard({ institution }: { institution: Institution }) {
  const domain = institution.customDomain;
  const [verifying, setVerifying] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const verify = async () => {
    if (!domain) return;
    setVerifying(true);
    const id = toast.loading("Checking DNS records...", { description: domain.domain });
    try {
      await verifyCustomDomain(institution.id);
      toast.success("Domain verified", { id, description: `${domain.domain} is live with a free SSL certificate.` });
    } catch (err) {
      toast.error("Verification failed", { id, description: errorMessage(err) });
    } finally {
      setVerifying(false);
    }
  };

  const remove = async () => {
    if (!domain) return;
    const id = toast.loading("Removing domain...", { description: domain.domain });
    try {
      await removeCustomDomain(institution.id);
      toast.success("Domain removed", { id, description: `Students will use ${institution.slug}.edupro.com again.` });
    } catch (err) {
      toast.error("Couldn't remove domain", { id, description: errorMessage(err) });
      throw err;
    }
  };

  const status = domain ? STATUS_META[domain.status] : null;

  return (
    <>
      <SettingsCard
        icon={<Globe2 className="h-5 w-5" />}
        tone="purple"
        title="Custom domain"
        description="Serve your academy on your own domain, e.g. learn.yourschool.com."
        action={
          status && (
            <ToneBadge tone={status.tone} size="sm" variant="pill" dot>
              {status.label}
            </ToneBadge>
          )
        }
      >
        {!domain ? (
          <SettingsBlockRow>
            <AddDomainForm institutionId={institution.id} />
            <p className="mt-2 body-xsm-regular text-primary-300">Use a subdomain you control. Your edupro.com address keeps working as a fallback.</p>
          </SettingsBlockRow>
        ) : (
          <>
            <SettingsBlockRow>
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <p className="truncate body-md-medium font-semibold! text-primary-500" title={domain.domain}>
                      {domain.domain}
                    </p>
                    <CopyButton value={domain.domain} label="Domain copied" />
                  </div>
                  <p className="body-xsm-regular text-primary-300">
                    Added {formatBillingDate(domain.addedAt)}
                    {domain.lastCheckedAt ? ` · last checked ${formatBillingDate(domain.lastCheckedAt)}` : ""}
                  </p>
                </div>
                {domain.status !== "VERIFIED" && (
                  <PrimaryButton size="sm" onClick={verify} isLoading={verifying} leftIcon={<RefreshCw />}>
                    {verifying ? "Verifying..." : "Verify now"}
                  </PrimaryButton>
                )}
                <CardActionButton icon={<Trash2 />} onClick={() => setRemoveOpen(true)} disabled={verifying}>
                  Remove
                </CardActionButton>
              </div>

              <p className="mt-3 flex items-center gap-2 body-sm-regular text-primary-400">
                {domain.status === "VERIFIED" ? (
                  <>
                    <ShieldCheck className="h-4 w-4 shrink-0 text-green" /> SSL certificate active — issued {formatBillingDate(domain.verifiedAt)}, renews automatically.
                  </>
                ) : domain.status === "FAILED" ? (
                  <>
                    <ShieldAlert className="h-4 w-4 shrink-0 text-red" /> SSL pending — we couldn&apos;t find your DNS records. Check them and verify again.
                  </>
                ) : (
                  <>
                    {verifying ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-yellow" /> : <Lock className="h-4 w-4 shrink-0 text-yellow" />} SSL is issued automatically once the domain is verified.
                  </>
                )}
              </p>
            </SettingsBlockRow>

            <SettingsBlockRow>
              <p className="mb-1 body-sm-medium text-primary-500">DNS records</p>
              <p className="mb-3 body-xsm-regular text-primary-300">Add these at your domain registrar (GoDaddy, Namecheap, Cloudflare…). Changes can take up to 24 hours.</p>
              <DnsRecordsTable domain={domain} />
            </SettingsBlockRow>
          </>
        )}
      </SettingsCard>

      <ConfirmModal
        isOpen={removeOpen}
        title="Remove custom domain?"
        subtitle="You can add it again later."
        message={
          <>
            <strong>{domain?.domain}</strong> will stop working immediately and students will be sent to {institution.slug}.edupro.com instead.
          </>
        }
        confirmLabel="Remove domain"
        pendingLabel="Removing..."
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={() => setRemoveOpen(false)}
        onConfirm={remove}
      />
    </>
  );
}

export default CustomDomainCard;
