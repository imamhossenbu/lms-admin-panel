import type { CertificateAccent } from "@/types/certificate";
import type { Tone } from "@/components/ui/ToneBadge";

export interface AccentClasses {
  /** Accent text colour. */
  text: string;
  /** Solid accent fill. */
  solid: string;
  /** Tinted accent fill. */
  soft: string;
  /** Strong accent border (frames). */
  border: string;
  /** Faint accent border (inner frames, rules). */
  borderSoft: string;
  /** ToneBadge tone for pills on the certificate. */
  tone: Tone;
  /** Human label (designer pickers, captions). */
  label: string;
}

/** Certificate accent → globals.css colour tokens (the only colours a certificate may use). */
export const CERT_ACCENT: Record<CertificateAccent, AccentClasses> = {
  orange: {
    text: "text-brand-orange",
    solid: "bg-brand-orange",
    soft: "bg-brand-orange-light",
    border: "border-brand-orange",
    borderSoft: "border-brand-orange/30",
    tone: "orange",
    label: "Orange",
  },
  blue: { text: "text-blue", solid: "bg-blue", soft: "bg-blue-14", border: "border-blue/100", borderSoft: "border-blue/30", tone: "blue", label: "Blue" },
  green: { text: "text-green", solid: "bg-green", soft: "bg-green-bg", border: "border-green/100", borderSoft: "border-green/30", tone: "green", label: "Green" },
  purple: { text: "text-purple", solid: "bg-purple", soft: "bg-purple-14", border: "border-purple/100", borderSoft: "border-purple/30", tone: "purple", label: "Purple" },
  navy: { text: "text-brand-navy", solid: "bg-brand-navy", soft: "bg-slate-100", border: "border-brand-navy", borderSoft: "border-dash", tone: "navy", label: "Navy" },
};

export default CERT_ACCENT;
