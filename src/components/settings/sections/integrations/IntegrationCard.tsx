"use client";

import React, { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Activity, CircleUserRound, KeyRound, Link2, Loader2, Settings2, Unplug } from "lucide-react";
import type { IntegrationsSettings } from "@/validations/platformSettingsSchema";
import { testIntegration } from "@/lib/settingsStorage";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { AppSelect } from "@/components/ui/AppSelect";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { PrimaryButton } from "@/components/ui/primary-button";
import { cn } from "@/lib/cn";
import { INTEGRATION_TILE, optionLabel, type IntegrationMeta } from "./integrationsMeta";

export interface IntegrationCardProps {
  meta: IntegrationMeta;
  secretHint?: string;
  onConnect: () => void;
  onManage: () => void;
  onDisconnect: () => void;
}

/** One integration tile: logo, status, account, quick model switch (AI) and actions. */
export function IntegrationCard({ meta, secretHint, onConnect, onManage, onDisconnect }: IntegrationCardProps) {
  const { control } = useFormContext<IntegrationsSettings>();
  const value = useWatch({ control, name: meta.key });
  const connected = !!value?.connected;
  const [isTesting, setIsTesting] = useState(false);

  const runTest = async () => {
    setIsTesting(true);
    const id = toast.loading(`Testing ${meta.name}...`, { description: "Checking the saved credentials." });
    try {
      const { ok, latencyMs } = await testIntegration(meta.key);
      if (ok) toast.success(`${meta.name} is working`, { id, description: `Responded in ${latencyMs} ms.` });
      else toast.error(`${meta.name} didn't respond`, { id, description: "Reconnect it with a fresh API key and try again." });
    } catch {
      toast.error(`Couldn't test ${meta.name}`, { id, description: "Please try again in a moment." });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <motion.article
      layout
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="dashboard-card shadow-2xs flex h-full flex-col p-5"
    >
      <div className="flex items-start gap-3">
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", INTEGRATION_TILE[meta.tone])}>{meta.icon}</span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate body-md-medium font-semibold! text-primary-500">{meta.name}</h3>
          <p className="truncate body-xsm-regular text-primary-300">{meta.category}</p>
        </div>
        <ToneBadge tone={connected ? "green" : "gray"} size="sm" variant="pill" dot>
          {connected ? "Connected" : "Not connected"}
        </ToneBadge>
      </div>

      <p className="mt-3 body-sm-regular text-primary-400">{meta.description}</p>

      <div className="mt-4 flex-1 space-y-2">
        {connected ? (
          <>
            <p className="flex min-w-0 items-center gap-2 body-xsm-regular text-primary-300">
              <CircleUserRound className="h-4 w-4 shrink-0" />
              <span className="min-w-0 truncate body-xsm-medium text-primary-500">{value.accountLabel || "Connected account"}</span>
            </p>
            {secretHint && (
              <p className="flex items-center gap-2 body-xsm-regular text-primary-300">
                <KeyRound className="h-4 w-4 shrink-0" />
                Key <span className="body-xsm-medium tabular-nums text-primary-400">{secretHint}</span>
              </p>
            )}
            {meta.option?.kind === "select" && (
              <Controller
                control={control}
                name={`${meta.key}.option`}
                render={({ field }) => (
                  <AppSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={meta.option?.choices ?? []}
                    size="sm"
                    fullWidth
                    icon={<span className="body-xsm-regular text-primary-300">{meta.option?.label}</span>}
                  />
                )}
              />
            )}
            {meta.option?.kind === "text" && value.option && (
              <ToneBadge tone="navy" size="sm">
                {meta.option.label}: {optionLabel(meta, value.option)}
              </ToneBadge>
            )}
          </>
        ) : (
          <p className="body-xsm-regular text-primary-300">Not set up yet — connect it to turn these features on.</p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-dash pt-4">
        {connected ? (
          <>
            <CardActionButton icon={<Settings2 />} onClick={onManage}>
              Manage
            </CardActionButton>
            <CardActionButton icon={isTesting ? <Loader2 className="animate-spin" /> : <Activity />} onClick={runTest} disabled={isTesting}>
              {isTesting ? "Testing..." : "Test"}
            </CardActionButton>
            <CardActionButton icon={<Unplug />} onClick={onDisconnect} className="ml-auto" aria-label={`Disconnect ${meta.name}`}>
              Disconnect
            </CardActionButton>
          </>
        ) : (
          <PrimaryButton size="sm" leftIcon={<Link2 />} onClick={onConnect}>
            Connect
          </PrimaryButton>
        )}
      </div>
    </motion.article>
  );
}

export default IntegrationCard;
