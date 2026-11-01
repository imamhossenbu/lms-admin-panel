"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Network, Plus } from "lucide-react";
import type { SecuritySettings } from "@/validations/platformSettingsSchema";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { TagsInput } from "@/components/ui/TagsInput";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsBlockRow } from "@/components/settings/shared/SettingsRow";
import { FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import { SettingsCallout } from "./SettingsCallout";
import { ipEntryError, ipIsAllowed, MOCK_CURRENT_IP } from "./securityUtils";

const MAX_ENTRIES = 50;

/** First error message found in an RHF array-field error (root or per-item). */
function arrayError(err: unknown): string | undefined {
  if (!err || typeof err !== "object") return undefined;
  const e = err as { message?: string; root?: { message?: string } } & Record<number, { message?: string } | undefined>;
  if (e.message) return e.message;
  if (e.root?.message) return e.root.message;
  return Object.values(e).find((v): v is { message: string } => !!v && typeof v === "object" && typeof (v as { message?: unknown }).message === "string")?.message;
}

/** "IP allowlist": restrict the admin panel to known IPv4 addresses / CIDR ranges. */
export function IpAllowlistCard() {
  const {
    control,
    formState: { errors },
  } = useFormContext<SecuritySettings>();
  const [enabled, list] = useWatch({ control, name: ["ipAllowlistEnabled", "ipAllowlist"] });
  const entries = list ?? [];
  const invalid = entries.map((ip) => ({ ip, error: ipEntryError(ip) })).filter((x): x is { ip: string; error: string } => !!x.error);
  const includesMe = ipIsAllowed(MOCK_CURRENT_IP, entries);

  return (
    <SettingsCard
      icon={<Network className="h-5 w-5" />}
      tone="yellow"
      title="IP allowlist"
      description="Only allow admin sign-ins from trusted networks."
      action={
        enabled ? (
          <ToneBadge tone="green" size="sm" variant="pill" dot>
            {entries.length} allowed
          </ToneBadge>
        ) : (
          <ToneBadge tone="gray" size="sm" variant="pill">
            Off
          </ToneBadge>
        )
      }
    >
      <SettingsBlockRow>
        <Controller
          control={control}
          name="ipAllowlistEnabled"
          render={({ field }) => (
            <SettingToggleRow
              title="Restrict admin access by IP"
              description="Sign-ins from any other address are blocked, even with the right password."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </SettingsBlockRow>

      <AnimatePresence initial={false}>
        {enabled && (
          <motion.div key="allowlist" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: "easeOut" }} className="overflow-hidden">
            <div className="space-y-4 pt-4">
              <Controller
                control={control}
                name="ipAllowlist"
                render={({ field }) => (
                  <div>
                    <FieldLabel htmlFor="sec-ip-allowlist" label="Allowed IPs" required count={field.value.length} max={MAX_ENTRIES} />
                    <TagsInput
                      id="sec-ip-allowlist"
                      value={field.value}
                      onChange={(next) => {
                        field.onChange(next);
                        field.onBlur();
                      }}
                      maxTags={MAX_ENTRIES}
                      maxLength={18}
                      placeholder="e.g. 203.0.113.10 or 10.0.0.0/24 — press Enter"
                      error={arrayError(errors.ipAllowlist)}
                      renderTag={(tag) => (
                        <ToneBadge tone={ipEntryError(tag) ? "red" : "navy"} size="sm" className="font-mono">
                          {tag}
                        </ToneBadge>
                      )}
                    />
                    <AnimatePresence initial={false}>
                      {invalid.length > 0 && (
                        <motion.ul key="invalid" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2 space-y-1 overflow-hidden">
                          {invalid.map((x) => (
                            <li key={x.ip} className="body-xsm-regular text-red">
                              <span className="font-semibold">{x.ip}</span> — {x.error}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                    <p className="mt-1.5 body-xsm-regular text-primary-300">One IPv4 address or CIDR range per entry. Press Enter or comma to add.</p>
                  </div>
                )}
              />

              <SettingsCallout
                tone={includesMe ? "success" : "warning"}
                title={includesMe ? "Your current IP is on the list" : "Make sure your current IP is included or you may lock yourself out"}
                action={
                  !includesMe && (
                    <Controller
                      control={control}
                      name="ipAllowlist"
                      render={({ field }) => (
                        <CardActionButton icon={<Plus className="h-4 w-4" />} disabled={field.value.length >= MAX_ENTRIES} onClick={() => field.onChange([...field.value, MOCK_CURRENT_IP])}>
                          Add my IP
                        </CardActionButton>
                      )}
                    />
                  )
                }
              >
                You&apos;re signed in from <span className="font-mono font-semibold text-primary-500">{MOCK_CURRENT_IP}</span>.
              </SettingsCallout>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SettingsCard>
  );
}

export default IpAllowlistCard;
