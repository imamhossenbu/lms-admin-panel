"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useCurrentInstitution, useSaasReady } from "@/lib/planAccess";
import { ProTipCard } from "@/components/ui/ProTipCard";
import { PlanGate } from "@/components/plan-gate/PlanGate";
import { SettingsSectionLayout } from "../../shared/SettingsSectionLayout";
import { DefaultAddressCard } from "./DefaultAddressCard";
import { CustomDomainCard } from "./CustomDomainCard";
import { DomainSkeleton } from "./DomainSkeleton";

/** Settings → Domain: default edupro.com address + custom domain (reads/writes the SaaS store, not settingsStorage). */
export function DomainSection() {
  const ready = useSaasReady();
  const institution = useCurrentInstitution();

  if (!ready || !institution) return <DomainSkeleton />;

  return (
    <SettingsSectionLayout
      title="Domain"
      description="Where students and staff reach your academy."
      icon={<Globe className="h-5 w-5" />}
      updatedAt={institution.customDomain?.lastCheckedAt ?? institution.customDomain?.addedAt ?? undefined}
      aside={
        <>
          <ProTipCard title="Use a subdomain">
            Point a subdomain such as <strong>learn.</strong>yourschool.com at EduPro and keep your main website where it is. Remove any old A or CNAME record for the same host first.
          </ProTipCard>
          <ProTipCard title="Free SSL">We issue and renew the HTTPS certificate for your domain automatically once DNS is verified.</ProTipCard>
        </>
      }
    >
      <DefaultAddressCard institution={institution} />
      <PlanGate feature="customDomain" compact>
        <CustomDomainCard institution={institution} />
      </PlanGate>
    </SettingsSectionLayout>
  );
}

export default DomainSection;
