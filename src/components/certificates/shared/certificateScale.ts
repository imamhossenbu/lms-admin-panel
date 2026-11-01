/** Typography / spacing per render scale — globals.css tokens only (sm = thumbnails, md = previews, lg = detail page). */

export type CertificateScale = "sm" | "md" | "lg";

export interface CertScaleClasses {
  /** Gap between the outer frame and the inner frame. */
  frame: string;
  /** Inner content padding. */
  pad: string;
  /** Vertical rhythm between blocks. */
  gap: string;
  eyebrow: string;
  heading: string;
  name: string;
  body: string;
  signature: string;
  signerName: string;
  signerTitle: string;
  /** Code / date captions ("hidden" at thumbnail size). */
  meta: string;
  logo: "sm" | "md";
  logoText: boolean;
  qr: string;
  seal: string;
  sealIcon: string;
  badge: "sm" | "md" | "lg";
  signerWidth: string;
  rule: string;
  /** Thumbnail mode: drops ornaments that don't fit (flourish, duplicate signer name, eyebrows). */
  compact: boolean;
  /** MODERN side band width (landscape) / height (portrait). */
  band: string;
  bandPortrait: string;
}

export const CERT_SCALE: Record<CertificateScale, CertScaleClasses> = {
  sm: {
    frame: "p-1",
    pad: "px-4 py-3",
    gap: "gap-1",
    eyebrow: "hidden",
    heading: "body-xsm-medium font-semibold!",
    name: "title-sm",
    body: "body-2xsm-regular line-clamp-2",
    signature: "body-xsm-regular",
    signerName: "hidden",
    signerTitle: "hidden",
    meta: "hidden",
    logo: "sm",
    logoText: false,
    qr: "w-7",
    seal: "h-7 w-7",
    sealIcon: "h-3.5 w-3.5",
    badge: "sm",
    signerWidth: "w-16",
    rule: "w-8",
    compact: true,
    band: "w-1/5 p-2",
    bandPortrait: "h-1/6 px-3",
  },
  md: {
    frame: "p-2",
    pad: "px-8 py-6",
    gap: "gap-2",
    eyebrow: "body-xsm-regular",
    heading: "heading-h5 font-semibold!",
    name: "heading-h3",
    body: "body-sm-regular line-clamp-3",
    signature: "body-l-regular",
    signerName: "body-xsm-medium",
    signerTitle: "body-2xsm-regular",
    meta: "body-2xsm-regular",
    logo: "sm",
    logoText: true,
    qr: "w-12",
    seal: "h-12 w-12",
    sealIcon: "h-6 w-6",
    badge: "md",
    signerWidth: "w-32",
    rule: "w-16",
    compact: false,
    band: "w-1/4 p-4",
    bandPortrait: "h-1/6 px-6",
  },
  lg: {
    frame: "p-3",
    pad: "px-14 py-10",
    gap: "gap-3",
    eyebrow: "body-sm-regular",
    heading: "heading-h4",
    name: "heading-h1-bold",
    body: "body-regular line-clamp-4",
    signature: "title-regular",
    signerName: "body-sm-medium",
    signerTitle: "body-xsm-regular",
    meta: "body-xsm-regular",
    logo: "md",
    logoText: true,
    qr: "w-16",
    seal: "h-16 w-16",
    sealIcon: "h-8 w-8",
    badge: "lg",
    signerWidth: "w-44",
    rule: "w-24",
    compact: false,
    band: "w-1/4 p-6",
    bandPortrait: "h-1/6 px-8",
  },
};

export default CERT_SCALE;
