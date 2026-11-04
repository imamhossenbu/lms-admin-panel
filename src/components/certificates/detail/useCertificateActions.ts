"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { IssuedCertificate } from "@/types/certificate";
import type { RevokeCertificateValues } from "@/validations/certificateSchema";
import { emailCertificate, restoreCertificate, revokeCertificate } from "@/lib/certificateStorage";
import { verifyUrl } from "@/lib/certificateStats";
import { errorText } from "./certificateDetailFormat";

export type CertificateBusy = "download" | "email" | null;
export type CertificateDialog = "revoke" | "restore" | "reissue" | null;

/**
 * Page actions for one certificate (email, revoke, restore, copy/open verification link) with the
 * toast.loading → success / error lifecycle. Storage writes fire CERTIFICATES_UPDATED_EVENT, so the
 * page reloads itself afterwards.
 */
export function useCertificateActions(certificate: IssuedCertificate, download: () => Promise<void>) {
  const [busy, setBusy] = useState<CertificateBusy>(null);
  const [dialog, setDialog] = useState<CertificateDialog>(null);
  const link = verifyUrl(certificate.code);
  const name = certificate.recipient.name;

  const runDownload = async () => {
    setBusy("download");
    const toastId = toast.loading("Preparing PDF...", { description: `Certificate ${certificate.code}` });
    try {
      await download();
      toast.success("Certificate ready", { id: toastId, description: "Use “Save as PDF” in the print dialog to download it." });
    } catch (e) {
      toast.error("Couldn't prepare the PDF", { id: toastId, description: errorText(e) });
    } finally {
      setBusy(null);
    }
  };

  const email = async () => {
    setBusy("email");
    const toastId = toast.loading("Sending certificate...", { description: `Emailing ${certificate.recipient.email}` });
    try {
      await emailCertificate(certificate.id);
      toast.success("Certificate emailed", { id: toastId, description: `${name} will receive it shortly.` });
    } catch (e) {
      toast.error("Couldn't send the email", { id: toastId, description: errorText(e) });
    } finally {
      setBusy(null);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Verification link copied", { description: link });
    } catch {
      toast.error("Could not copy", { description: "Your browser blocked clipboard access." });
    }
  };

  const openVerification = () => window.open(link, "_blank", "noopener,noreferrer");

  /** Throws on failure so the modal stays open. */
  const revoke = async (values: RevokeCertificateValues) => {
    const toastId = toast.loading("Revoking certificate...", { description: `${name} · ${certificate.code}` });
    try {
      await revokeCertificate(certificate.id, values);
      toast.success("Certificate revoked", {
        id: toastId,
        description: values.notifyLearner ? `${name} has been notified by email.` : "The verification page now shows it as revoked.",
      });
    } catch (e) {
      toast.error("Couldn't revoke the certificate", { id: toastId, description: errorText(e) });
      throw e;
    }
  };

  /** Throws on failure so the ConfirmModal stays open. */
  const restore = async () => {
    const toastId = toast.loading("Restoring certificate...", { description: `${name} · ${certificate.code}` });
    try {
      await restoreCertificate(certificate.id);
      toast.success("Certificate restored", { id: toastId, description: "It shows as valid on the verification page again." });
    } catch (e) {
      toast.error("Couldn't restore the certificate", { id: toastId, description: errorText(e) });
      throw e;
    }
  };

  return {
    busy,
    dialog,
    link,
    open: setDialog,
    close: () => setDialog(null),
    download: runDownload,
    email,
    copyLink,
    openVerification,
    revoke,
    restore,
  };
}

export default useCertificateActions;
