import { BadgeCheck, Download, Mail, RotateCcw, ShieldCheck, ShieldOff, Award, type LucideIcon } from "lucide-react";
import type { CertificateEventKind } from "@/types/certificate";
import type { RevokeCertificateValues } from "@/validations/certificateSchema";

/** Friendly message for a thrown error (never a raw stack / status code). */
export const errorText = (e: unknown) => (e instanceof Error && e.message ? e.message : "Something went wrong. Please try again.");

/** "Oct 20, 2026, 9:41 AM". */
export const exactDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

/** "Oct 20, 2026". */
export const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** "just now" / "5 minutes ago" / "3 hours ago" / "2 days ago" / date. */
export function timeAgo(iso: string, now: Date = new Date()) {
  const diff = Math.max(0, now.getTime() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return shortDate(iso);
}

export const plural = (n: number, word: string, many = `${word}s`) => `${n.toLocaleString()} ${n === 1 ? word : many}`;

export type RevokeReason = RevokeCertificateValues["reason"];

export const REVOKE_REASONS: { value: RevokeReason; title: string; description: string }[] = [
  { value: "ACADEMIC_MISCONDUCT", title: "Academic misconduct", description: "Plagiarism, cheating or a policy breach." },
  { value: "ISSUED_IN_ERROR", title: "Issued in error", description: "Wrong learner, course or details." },
  { value: "REFUND", title: "Refund", description: "The learner's enrollment was refunded." },
  { value: "OTHER", title: "Other", description: "Explain the reason in the details below." },
];

export const REVOKE_REASON_LABEL: Record<RevokeReason, string> = Object.fromEntries(REVOKE_REASONS.map((r) => [r.value, r.title])) as Record<RevokeReason, string>;

/** Human-readable reason stored on the certificate: "Refund — details". */
export function readableRevokeReason(v: Pick<RevokeCertificateValues, "reason" | "details">) {
  const details = v.details.trim();
  return details ? `${REVOKE_REASON_LABEL[v.reason]} — ${details}` : REVOKE_REASON_LABEL[v.reason];
}

export const EVENT_META: Record<CertificateEventKind, { icon: LucideIcon; tile: string; label: string }> = {
  ISSUED: { icon: Award, tile: "bg-brand-orange-light text-brand-orange", label: "Issued" },
  REISSUED: { icon: BadgeCheck, tile: "bg-brand-orange-light text-brand-orange", label: "Reissued" },
  EMAILED: { icon: Mail, tile: "bg-blue-14 text-blue", label: "Emailed" },
  DOWNLOADED: { icon: Download, tile: "bg-purple-14 text-purple", label: "Downloaded" },
  VERIFIED: { icon: ShieldCheck, tile: "bg-green-bg text-green", label: "Verified" },
  REVOKED: { icon: ShieldOff, tile: "bg-red-14 text-red", label: "Revoked" },
  RESTORED: { icon: RotateCcw, tile: "bg-green-bg text-green", label: "Restored" },
};
