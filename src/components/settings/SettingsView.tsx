"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Undo2 } from "lucide-react";
import { useUrlParams } from "@/lib/useUrlParams";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsTabs, parseSettingsSection, type SettingsTabId } from "./SettingsTabs";
import { SettingsSkeleton } from "./SettingsSkeleton";
import { SettingsDirtyContext } from "./shared/SettingsDirtyContext";
import { useSettingsStore } from "./shared/useSettingsStore";
import { GeneralSection } from "./sections/general/GeneralSection";
import { BrandingSection } from "./sections/branding/BrandingSection";
import { LearningSection } from "./sections/learning/LearningSection";
import { PaymentsSection } from "./sections/payments/PaymentsSection";
import { EmailSection } from "./sections/email/EmailSection";
import { SecuritySection } from "./sections/security/SecuritySection";
import { IntegrationsSection } from "./sections/integrations/IntegrationsSection";
import { MaintenanceSection } from "./sections/maintenance/MaintenanceSection";
import { DomainSection } from "./sections/domain/DomainSection";

const SECTION_COMPONENT: Record<SettingsTabId, React.ComponentType> = {
  general: GeneralSection,
  branding: BrandingSection,
  domain: DomainSection,
  learning: LearningSection,
  payments: PaymentsSection,
  email: EmailSection,
  security: SecuritySection,
  integrations: IntegrationsSection,
  maintenance: MaintenanceSection,
};

/**
 * /settings — header + capsule section switcher (`?section=`, survives reloads) + the active
 * section. Switching away from unsaved edits asks first. Render inside <Suspense>.
 */
export function SettingsView() {
  const { get, set } = useUrlParams();
  const { store, ready, loadError, retry } = useSettingsStore();
  const section = parseSettingsSection(get("section"));
  const [isDirty, setIsDirty] = useState(false);
  const [pending, setPending] = useState<SettingsTabId | null>(null);

  if (loadError && !store) return <LoadErrorCard title="Couldn't load settings" message={loadError} onRetry={retry} />;
  if (!ready || !store) return <SettingsSkeleton />;

  const go = (next: SettingsTabId) => {
    setIsDirty(false);
    set({ section: next === "general" ? null : next }, { replaceAll: true });
  };
  const requestSection = (next: SettingsTabId) => {
    if (next === section) return;
    if (isDirty) setPending(next);
    else go(next);
  };

  const Active = SECTION_COMPONENT[section];

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8 text-left">
      <SettingsHeader maintenanceMode={store.settings.maintenance.maintenanceMode} onOpenMaintenance={() => requestSection("maintenance")} />

      <SettingsTabs active={section} onChange={requestSection} />

      <SettingsDirtyContext.Provider value={setIsDirty}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={section}
            role="tabpanel"
            id={`settings-panel-${section}`}
            aria-labelledby={`settings-tab-${section}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Active />
          </motion.div>
        </AnimatePresence>
      </SettingsDirtyContext.Provider>

      <ConfirmModal
        isOpen={pending !== null}
        title="Discard unsaved changes?"
        subtitle="You have edits in this section that haven't been saved."
        message="If you switch sections now, the changes you made here will be lost."
        confirmLabel="Discard Changes"
        pendingLabel="Switching..."
        confirmIcon={<Undo2 className="h-4 w-4" />}
        onClose={() => setPending(null)}
        onConfirm={async () => {
          if (pending) go(pending);
        }}
      />
    </motion.div>
  );
}

export default SettingsView;
