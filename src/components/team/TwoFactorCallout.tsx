"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing } from "lucide-react";
import type { TeamMember } from "@/types/team";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { SettingsCallout } from "@/components/settings/sections/security/SettingsCallout";
import { plural } from "./shared/teamFormat";

export interface TwoFactorCalloutProps {
  members: TeamMember[];
  busy: boolean;
  onRemind: () => void;
}

/** Shown when Settings › Security requires admin 2FA and some active members haven't set it up. */
export function TwoFactorCallout({ members, busy, onRemind }: TwoFactorCalloutProps) {
  return (
    <AnimatePresence initial={false}>
      {members.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
          <SettingsCallout
            tone="danger"
            title={`Two-factor authentication is required, but ${plural(members.length, "member hasn't", "members haven't")} turned it on`}
            action={
              <CardActionButton icon={<BellRing />} onClick={onRemind} disabled={busy}>
                {busy ? "Sending..." : "Send reminder"}
              </CardActionButton>
            }
          >
            <span className="block">
              They&apos;ll be asked to set it up at their next sign-in (
              <Link href="/settings?section=security" className="font-semibold text-primary-500 underline-offset-2 hover:underline">
                Settings › Security
              </Link>
              ).
            </span>
            <span className="mt-2 flex flex-wrap gap-2">
              {members.map((m) => (
                <Link key={m.id} href={`/users/${m.id}`} className="shrink-0 rounded-full transition-opacity hover:opacity-80">
                  <ToneBadge tone="red" variant="pill" size="sm" icon={<Avatar name={m.name} size={18} />}>
                    {m.name}
                  </ToneBadge>
                </Link>
              ))}
            </span>
          </SettingsCallout>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TwoFactorCallout;
