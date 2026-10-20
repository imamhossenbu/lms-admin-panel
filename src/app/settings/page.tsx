import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SettingsFormClient } from "@/components/settings/SettingsFormClient";
import { ToneBadge } from "@/components/ui/ToneBadge";

export default function PlatformSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform & White-Label Configuration"
        description="Manage system-wide environment variables, branding palettes, and security rules."
        badge={<ToneBadge tone="navy">Admin Only</ToneBadge>}
      />
      <SettingsFormClient />
    </div>
  );
}
