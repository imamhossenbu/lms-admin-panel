"use client";

import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import { motion } from "framer-motion";
import { Puzzle, Unplug } from "lucide-react";
import type { IntegrationKey } from "@/validations/platformSettingsSchema";
import { clearSecret } from "@/lib/settingsStorage";
import { useSettingsSection } from "@/components/settings/useSettingsSection";
import { SettingsSectionLayout } from "@/components/settings/shared/SettingsSectionLayout";
import { SettingsSaveBar } from "@/components/settings/shared/SettingsSaveBar";
import { RecentChangesCard } from "@/components/settings/shared/RecentChangesCard";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ProTipCard } from "@/components/ui/ProTipCard";
import { PlanGate } from "@/components/plan-gate/PlanGate";
import { INTEGRATIONS, INTEGRATION_BY_KEY, INTEGRATION_LABELS } from "./integrationsMeta";
import { IntegrationCard } from "./IntegrationCard";
import { IntegrationConnectModal, type ConnectFormValues } from "./IntegrationConnectModal";
import { ConnectedServicesCard } from "./ConnectedServicesCard";

type ModalState = { key: IntegrationKey; mode: "connect" | "manage" } | null;

/** Settings → Integrations: connect / manage / test / disconnect third-party services. */
export function IntegrationsSection() {
  const { form, store, isSaving, save, discard } = useSettingsSection("integrations", INTEGRATION_LABELS);
  const [modal, setModal] = useState<ModalState>(null);
  const [disconnectKey, setDisconnectKey] = useState<IntegrationKey | null>(null);
  const hint = (key: IntegrationKey) => store.secretHints[`integrations.${key}.apiKey`];

  const applyConnection = async (key: IntegrationKey, values: ConnectFormValues) => {
    const opts = { shouldDirty: true } as const;
    form.setValue(`${key}.connected`, true, opts);
    form.setValue(`${key}.accountLabel`, values.accountLabel.trim(), opts);
    form.setValue(`${key}.apiKey`, values.apiKey.trim(), opts);
    form.setValue(`${key}.option`, values.option.trim(), opts);
    return save();
  };

  const disconnect = async () => {
    if (!disconnectKey) return;
    const key = disconnectKey;
    const opts = { shouldDirty: true } as const;
    form.setValue(`${key}.connected`, false, opts);
    form.setValue(`${key}.accountLabel`, "", opts);
    form.setValue(`${key}.apiKey`, "", opts);
    const ok = await save();
    if (!ok) throw new Error("save failed");
    await clearSecret(`integrations.${key}.apiKey`);
  };

  const modalMeta = modal ? INTEGRATION_BY_KEY[modal.key] : null;
  const disconnectMeta = disconnectKey ? INTEGRATION_BY_KEY[disconnectKey] : null;

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <SettingsSectionLayout
          title="Integrations"
          description="Connect video, media, AI and analytics services."
          icon={<Puzzle className="h-5 w-5" />}
          updatedAt={store.updatedAt.integrations}
          aside={
            <>
              <ConnectedServicesCard />
              <ProTipCard title="Use restricted keys">
                Create a dedicated API key for {store.settings.general.platformName} with only the permissions it needs. If a key leaks, disconnect here and rotate it in the provider&apos;s dashboard.
              </ProTipCard>
              <RecentChangesCard store={store} section="integrations" />
            </>
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {INTEGRATIONS.map((meta, i) => (
              <motion.div key={meta.key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut", delay: i * 0.04 }} className="h-full">
                {/* The AI card needs the plan's aiAssistant feature; other integrations are always available. */}
                <PlanGate feature={meta.key === "ai" ? "aiAssistant" : null} compact>
                  <IntegrationCard
                    meta={meta}
                    secretHint={hint(meta.key)}
                    onConnect={() => setModal({ key: meta.key, mode: "connect" })}
                    onManage={() => setModal({ key: meta.key, mode: "manage" })}
                    onDisconnect={() => setDisconnectKey(meta.key)}
                  />
                </PlanGate>
              </motion.div>
            ))}
          </div>
          <SettingsSaveBar isDirty={form.formState.isDirty} isSaving={isSaving} onSave={save} onDiscard={discard} />
        </SettingsSectionLayout>
      </form>

      {modal && modalMeta && (
        <IntegrationConnectModal
          isOpen
          meta={modalMeta}
          mode={modal.mode}
          current={form.getValues(modal.key)}
          secretHint={hint(modal.key)}
          onClose={() => setModal(null)}
          onSubmit={(values) => applyConnection(modal.key, values)}
        />
      )}

      <ConfirmModal
        isOpen={!!disconnectMeta}
        title={disconnectMeta ? `Disconnect ${disconnectMeta.name}?` : "Disconnect"}
        subtitle="You can reconnect it at any time."
        message={
          disconnectMeta ? (
            <>
              The stored API key will be deleted and features that rely on <strong>{disconnectMeta.name}</strong> stop working until it&apos;s connected again.
            </>
          ) : null
        }
        confirmLabel="Disconnect"
        pendingLabel="Disconnecting..."
        confirmIcon={<Unplug />}
        onClose={() => setDisconnectKey(null)}
        onConfirm={disconnect}
      />
    </FormProvider>
  );
}

export default IntegrationsSection;
