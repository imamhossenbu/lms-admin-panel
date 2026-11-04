"use client";

import React, { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { FlaskConical, Loader2, PlugZap, Radio, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { PaymentSettings } from "@/validations/platformSettingsSchema";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsBlockRow, SettingsRow } from "@/components/settings/shared/SettingsRow";
import { SecretField } from "@/components/settings/shared/SecretField";
import { InputField } from "@/components/ui/InputField";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { missingGatewayText, type GatewayMeta } from "./paymentsMeta";
import { testGateway } from "@/lib/settingsStorage";
import { apiErrorMessage } from "@/lib/apiError";
import { GatewayStatusBadge, gatewayStatus } from "./GatewayStatusBadge";

export interface GatewayCardProps {
  gateway: GatewayMeta;
  /** Masked stored secret, e.g. "••••4e19" (empty when none saved). */
  secretHint?: string;
}

const MODE_OPTIONS = [
  { value: "LIVE" as const, label: "Live", icon: <Radio /> },
  { value: "TEST" as const, label: "Test", icon: <FlaskConical /> },
];

/** One payment gateway: enable toggle, Live/Test mode, keys, connection test and status. */
export function GatewayCard({ gateway, secretHint }: GatewayCardProps) {
  const { control, register, trigger, formState } = useFormContext<PaymentSettings>();
  const { key } = gateway;
  const [enabled, mode, publicKey, secretKey] = useWatch({ control, name: [`${key}.enabled`, `${key}.mode`, `${key}.publicKey`, `${key}.secretKey`] });
  const [isTesting, setIsTesting] = useState(false);
  const [lastLatency, setLastLatency] = useState<number | null>(null);

  const status = gatewayStatus(!!enabled, !!publicKey?.trim(), !!secretHint || !!secretKey?.trim());
  const publicKeyId = `payments-${key}-public-key`;

  const runTest = async () => {
    setIsTesting(true);
    const id = toast.loading(`Testing ${gateway.name}...`, { description: "Checking the saved setup." });
    try {
      const { ok, latencyMs, missing } = await testGateway(key);
      if (ok) {
        setLastLatency(latencyMs);
        toast.success(`${gateway.name} is set up`, { id, description: `Saved keys checked in ${latencyMs} ms (${mode === "LIVE" ? "live" : "test"} mode).` });
      } else {
        setLastLatency(null);
        toast.error(`${gateway.name} isn't ready`, { id, description: missingGatewayText(missing, gateway.secretLabel) });
      }
    } catch (err) {
      setLastLatency(null);
      toast.error(`Couldn't test ${gateway.name}`, { id, description: apiErrorMessage(err, "Check the keys and try again.") });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <SettingsCard
      title={gateway.name}
      description={gateway.description}
      icon={gateway.icon}
      tone={gateway.tone}
      action={
        <div className="flex items-center gap-3">
          <GatewayStatusBadge status={status} />
          <Controller
            control={control}
            name={`${key}.enabled`}
            render={({ field }) => (
              <ToggleSwitch
                id={`payments-${key}-enabled`}
                tone="orange"
                checked={!!field.value}
                onChange={(next) => {
                  field.onChange(next);
                  // Keep the cross-gateway rules fresh once they have been shown.
                  if (formState.errors.sslcommerz?.enabled || formState.errors[key]?.publicKey) void trigger(["sslcommerz.enabled", `${key}.publicKey`]);
                }}
                label={<span className="sr-only">Enable {gateway.name}</span>}
              />
            )}
          />
        </div>
      }
    >
      <SettingsRow label="Mode" description="Test mode uses sandbox keys and never charges students.">
        <div className="flex flex-wrap items-center gap-3">
          <Controller
            control={control}
            name={`${key}.mode`}
            render={({ field }) => <SegmentedControl options={MODE_OPTIONS} value={field.value} onChange={field.onChange} />}
          />
          <AnimatePresence initial={false} mode="popLayout">
            {mode === "TEST" ? (
              <motion.span key="test" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.18 }}>
                <ToneBadge tone="yellow" size="sm" icon={<FlaskConical className="h-3 w-3" />}>
                  Test mode — no real charges
                </ToneBadge>
              </motion.span>
            ) : (
              <motion.span key="tag" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.18 }}>
                <ToneBadge tone="gray" size="sm">
                  {gateway.tag}
                </ToneBadge>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </SettingsRow>

      <SettingsRow label={gateway.publicKeyLabel} description="Public identifier — safe to show." htmlFor={publicKeyId} required={!!enabled}>
        <InputField
          id={publicKeyId}
          placeholder={gateway.publicKeyPlaceholder}
          autoComplete="off"
          spellCheck={false}
          className="font-mono"
          error={formState.errors[key]?.publicKey?.message}
          {...register(`${key}.publicKey`)}
        />
      </SettingsRow>

      <SettingsRow label={gateway.secretLabel} description="Write-only. Leave empty to keep the saved one." htmlFor={`payments-${key}-secret`}>
        <SecretField
          id={`payments-${key}-secret`}
          name={`${key}.secretKey`}
          label={gateway.secretLabel}
          hideLabel
          hint={secretHint}
          placeholder={secretHint ? undefined : `Paste the ${gateway.secretLabel.toLowerCase()}`}
        />
      </SettingsRow>

      <SettingsBlockRow>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dash bg-slate-50 px-4 py-3">
          <p className="flex items-center gap-2 body-xsm-regular text-primary-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-green" />
            {lastLatency !== null ? (
              <span>
                Saved setup checked in <span className="body-xsm-medium text-primary-500">{lastLatency} ms</span>
              </span>
            ) : (
              <span>Save your changes, then test to confirm the gateway is fully set up.</span>
            )}
          </p>
          <CardActionButton icon={isTesting ? <Loader2 className="animate-spin" /> : <PlugZap />} onClick={runTest} disabled={isTesting}>
            {isTesting ? "Testing..." : "Test connection"}
          </CardActionButton>
        </div>
      </SettingsBlockRow>
    </SettingsCard>
  );
}

export default GatewayCard;
