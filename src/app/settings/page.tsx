"use client";

import React, { Suspense } from "react";
import { SettingsView } from "@/components/settings/SettingsView";
import { SettingsSkeleton } from "@/components/settings/SettingsSkeleton";

/** Platform settings (`?section=` survives reloads). */
export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsView />
    </Suspense>
  );
}
