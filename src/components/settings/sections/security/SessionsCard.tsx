"use client";

import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Monitor, Smartphone, Timer } from "lucide-react";
import { toast } from "sonner";
import type { SecuritySettings } from "@/validations/platformSettingsSchema";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { SettingsCard } from "@/components/settings/shared/SettingsCard";
import { SettingsRow } from "@/components/settings/shared/SettingsRow";
import { NumberStepper } from "./NumberStepper";
import { formatMinutes, SESSION_PRESETS } from "./securityUtils";

interface MockSession {
  id: string;
  device: string;
  meta: string;
  mobile?: boolean;
  current?: boolean;
}

const INITIAL_SESSIONS: MockSession[] = [
  { id: "s1", device: "Chrome on macOS", meta: "Dhaka, BD · Active now", current: true },
  { id: "s2", device: "Safari on iPhone", meta: "Dhaka, BD · 2h ago", mobile: true },
  { id: "s3", device: "Edge on Windows", meta: "Chattogram, BD · 1d ago" },
];

const PRESET_OPTIONS = SESSION_PRESETS.map((p) => ({ value: String(p.minutes), label: p.label }));

/** "Sessions": idle timeout (+ presets) and sign out everywhere else (mock). */
export function SessionsCard() {
  const {
    control,
    formState: { errors },
  } = useFormContext<SecuritySettings>();
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [confirming, setConfirming] = useState(false);
  const others = sessions.filter((s) => !s.current).length;

  const signOutOthers = async () => {
    const id = toast.loading("Signing out other sessions...");
    await new Promise((r) => setTimeout(r, 900));
    setSessions((list) => list.filter((s) => s.current));
    toast.success("Signed out everywhere else", { id, description: `${others} other session${others === 1 ? "" : "s"} ended. You're still signed in here.` });
  };

  return (
    <SettingsCard icon={<Timer className="h-5 w-5" />} tone="purple" title="Sessions" description="How long admins stay signed in while idle.">
      <SettingsRow label="Session timeout" description="Signed out after this much inactivity (5 min – 24 h)." htmlFor="sec-timeout" required>
        <Controller
          control={control}
          name="sessionTimeoutMinutes"
          render={({ field }) => (
            <div className="space-y-3">
              <div className="flex flex-wrap items-start gap-3">
                <NumberStepper id="sec-timeout" value={field.value} onChange={field.onChange} onBlur={field.onBlur} min={5} max={1440} step={5} unit="min" error={errors.sessionTimeoutMinutes?.message} />
                <SegmentedControl options={PRESET_OPTIONS} value={String(field.value)} onChange={(v) => field.onChange(Number(v))} className="flex-wrap" />
              </div>
              {Number.isFinite(field.value) && field.value >= 5 && (
                <p className="body-xsm-regular text-primary-300">
                  Idle admins are signed out after <span className="body-xsm-medium font-semibold! text-primary-500">{formatMinutes(field.value)}</span>.
                </p>
              )}
            </div>
          )}
        />
      </SettingsRow>

      <SettingsRow label="Active sessions" description="Devices currently signed in to your admin account.">
        <div className="space-y-3">
          <ul className="divide-y divide-dash overflow-hidden rounded-xl border border-dash">
            <AnimatePresence initial={false}>
              {sessions.map((s) => {
                const Icon = s.mobile ? Smartphone : Monitor;
                return (
                  <motion.li
                    key={s.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 bg-white px-3.5 py-2.5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-bg text-primary-400">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate body-sm-medium text-primary-500">{s.device}</p>
                      <p className="truncate body-xsm-regular text-primary-300">{s.meta}</p>
                    </div>
                    {s.current && (
                      <ToneBadge tone="green" size="sm" variant="pill" dot>
                        This device
                      </ToneBadge>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
          <SecondaryButton size="sm" leftIcon={<LogOut className="h-4 w-4" />} disabled={others === 0} onClick={() => setConfirming(true)}>
            Sign out all other sessions
          </SecondaryButton>
        </div>
      </SettingsRow>

      <ConfirmModal
        isOpen={confirming}
        onClose={() => setConfirming(false)}
        title="Sign out all other sessions?"
        subtitle="You'll stay signed in on this device."
        message={`${others} other device${others === 1 ? "" : "s"} will be signed out immediately and need to sign in again.`}
        confirmLabel="Sign out others"
        pendingLabel="Signing out..."
        confirmIcon={<LogOut className="h-4 w-4" />}
        onConfirm={signOutOthers}
      />
    </SettingsCard>
  );
}

export default SessionsCard;
