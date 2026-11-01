"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, LogIn, Monitor, ShieldCheck, ShieldOff, Smartphone } from "lucide-react";
import type { TeamMember } from "@/types/team";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { fullDate, timeAgo } from "../shared/teamFormat";
import { memberSessions } from "./memberSessions";

export interface MemberSecurityCardProps {
  member: TeamMember;
  require2fa: boolean;
  busy: boolean;
  onReset2fa: () => void;
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-bg text-primary-400">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="body-xsm-medium text-primary-300">{label}</p>
        <div className="mt-0.5 min-w-0 body-sm-regular text-primary-500">{children}</div>
      </div>
    </div>
  );
}

/** 2FA (+ Reset 2FA), last sign-in, IP and mock sessions. */
export function MemberSecurityCard({ member: m, require2fa, busy, onReset2fa }: MemberSecurityCardProps) {
  const sessions = memberSessions(m);
  return (
    <IconSectionCard icon={<ShieldCheck className="h-5 w-5" />} tone="green" title="Security" description="Sign-in protection and active sessions.">
      <div className="divide-y divide-dash">
        <Row icon={m.twoFactorEnabled ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />} label="Two-factor authentication">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {m.twoFactorEnabled ? (
              <ToneBadge tone="green" size="sm" dot>
                Enabled · authenticator app
              </ToneBadge>
            ) : (
              <ToneBadge tone="red" size="sm" dot>
                {require2fa ? "Not set up · required" : "Not set up"}
              </ToneBadge>
            )}
            {m.twoFactorEnabled && !m.isOwner && (
              <CardActionButton icon={<ShieldOff />} disabled={busy} onClick={onReset2fa}>
                Reset 2FA
              </CardActionButton>
            )}
          </div>
        </Row>
        <Row icon={<LogIn className="h-4 w-4" />} label="Last sign-in">
          <span title={fullDate(m.lastActiveAt)}>{m.lastActiveAt ? `${timeAgo(m.lastActiveAt)} · ${fullDate(m.lastActiveAt)}` : "Never"}</span>
        </Row>
        <Row icon={<Globe className="h-4 w-4" />} label="Last IP address">
          <span className="tabular-nums">{m.lastLoginIp || "—"}</span>
          {m.location && <span className="body-sm-regular text-primary-300"> · {m.location}</span>}
        </Row>
        <div className="pt-3">
          <p className="mb-2 body-xsm-medium font-semibold! text-primary-400">Active sessions · {sessions.length}</p>
          {sessions.length === 0 ? (
            <p className="rounded-lg border border-dashed border-dash bg-gray-bg px-3 py-3 body-xsm-regular text-primary-300">{m.status === "SUSPENDED" ? "Suspended members are signed out everywhere." : "No active sessions."}</p>
          ) : (
            <ul className="divide-y divide-dash overflow-hidden rounded-xl border border-dash">
              <AnimatePresence initial={false}>
                {sessions.map((s) => {
                  const Icon = s.mobile ? Smartphone : Monitor;
                  return (
                    <motion.li key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 bg-white px-3 py-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-primary-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate body-sm-medium text-primary-500">{s.device}</p>
                        <p className="truncate body-xsm-regular text-primary-300">
                          {s.location} · {timeAgo(s.lastSeenAt)}
                        </p>
                      </div>
                      {s.current && (
                        <ToneBadge tone="green" size="sm" variant="pill" dot>
                          Latest
                        </ToneBadge>
                      )}
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </IconSectionCard>
  );
}

export default MemberSecurityCard;
