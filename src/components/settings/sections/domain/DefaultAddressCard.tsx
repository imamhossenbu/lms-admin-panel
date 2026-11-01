"use client";

import React from "react";
import { ExternalLink, Link2 } from "lucide-react";
import type { Institution } from "@/types/saas";
import { SAAS_ROOT_DOMAIN } from "@/types/saas";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CopyButton } from "@/components/ui/CopyButton";
import { SettingsCard } from "../../shared/SettingsCard";
import { SettingsBlockRow } from "../../shared/SettingsRow";

/** The always-on `<slug>.edupro.com` address (Primary unless a verified custom domain takes over). */
export function DefaultAddressCard({ institution }: { institution: Institution }) {
  const host = `${institution.slug}.${SAAS_ROOT_DOMAIN}`;
  const customPrimary = institution.customDomain?.status === "VERIFIED";

  return (
    <SettingsCard icon={<Link2 className="h-5 w-5" />} tone="blue" title="Default address" description="Included with every plan and always available.">
      <SettingsBlockRow>
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dash bg-gray-bg p-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue">
            <ExternalLink className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate body-md-medium font-semibold! text-primary-500" title={`https://${host}`}>
              https://{host}
            </p>
            <p className="body-xsm-regular text-primary-300">SSL secured · managed by EduPro</p>
          </div>
          <ToneBadge tone={customPrimary ? "gray" : "green"} size="sm" variant="pill" dot>
            {customPrimary ? "Redirects to custom domain" : "Primary"}
          </ToneBadge>
          <CopyButton value={`https://${host}`} label="Address copied" />
        </div>
      </SettingsBlockRow>
    </SettingsCard>
  );
}

export default DefaultAddressCard;
