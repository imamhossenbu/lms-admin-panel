"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { CertificateTemplate, TemplateStatus } from "@/types/certificate";
import type { RevokeCertificateValues } from "@/validations/certificateSchema";
import { apiErrorMessage } from "@/lib/apiError";
import {
  bulkEmailCertificates,
  bulkRevokeCertificates,
  deleteTemplate,
  duplicateTemplate,
  emailCertificate,
  issueToEligible,
  restoreCertificate,
  revokeCertificate,
  updateTemplate,
} from "@/lib/certificateStorage";
import { verifyUrl } from "@/lib/certificateStats";
import { downloadCertificatePdf } from "../shared/downloadCertificate";
import { downloadCertificatesCsv, type IssuedRow } from "./certificateListUtils";

const errorText = (err: unknown) => apiErrorMessage(err, "Something went wrong. Please try again.");
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** Every list mutation with the loading → success / error toast lifecycle. Mutations re-throw so modals stay open. */
export function useCertificateListActions() {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isBulkBusy, setIsBulkBusy] = useState(false);

  const run = async <T,>(id: string | null, loading: string, fn: () => Promise<T>, success: (r: T) => { title: string; description?: string }, failTitle: string) => {
    const toastId = toast.loading(loading);
    if (id) setBusyId(id);
    try {
      const result = await fn();
      const msg = success(result);
      toast.success(msg.title, { id: toastId, description: msg.description });
      return result;
    } catch (err) {
      toast.error(failTitle, { id: toastId, description: errorText(err) });
      throw err;
    } finally {
      if (id) setBusyId(null);
    }
  };
  const quiet = (p: Promise<unknown>) => void p.catch(() => undefined);

  // -------------------------------------------------------------- issued
  const download = (row: IssuedRow) => {
    if (!row.template) {
      toast.error("Couldn't download the certificate", { description: "Its template was deleted, so the certificate can't be rendered." });
      return;
    }
    const template = row.template;
    quiet(
      run(row.id, "Preparing certificate...", () => downloadCertificatePdf({ certificate: row.cert, template, courseTitle: row.courseTitle }), () => ({
        title: "Certificate ready",
        description: `Choose “Save as PDF” in the print dialog to keep ${row.cert.code}.`,
      }), "Couldn't download the certificate")
    );
  };

  const email = (row: IssuedRow) =>
    quiet(run(row.id, "Sending certificate email...", () => emailCertificate(row.id), () => ({ title: "Certificate emailed", description: `Sent to ${row.cert.recipient.email}.` }), "Couldn't send the email"));

  const copyLink = (row: IssuedRow) =>
    quiet(
      run(null, "Copying verification link...", () => navigator.clipboard.writeText(verifyUrl(row.cert.code)), () => ({ title: "Verification link copied", description: verifyUrl(row.cert.code) }), "Couldn't copy the link")
    );

  const revoke = (rows: IssuedRow[], values: RevokeCertificateValues, notify = values.notifyLearner) =>
    run(
      rows.length === 1 ? rows[0].id : null,
      rows.length === 1 ? "Revoking certificate..." : `Revoking ${plural(rows.length, "certificate")}...`,
      async () => {
        if (rows.length === 1) {
          await revokeCertificate(rows[0].id, values);
          return 1;
        }
        return bulkRevokeCertificates(rows.map((r) => r.id), values);
      },
      (n) => ({
        title: n === 1 ? "Certificate revoked" : `${plural(n, "certificate")} revoked`,
        description: `${n === 1 ? rows[0].cert.code : "They"} will show as revoked on verification${notify ? " — learners were notified" : ""}.`,
      }),
      "Couldn't revoke"
    );

  const restore = (row: IssuedRow) =>
    quiet(run(row.id, "Restoring certificate...", () => restoreCertificate(row.id), () => ({ title: "Certificate restored", description: `${row.cert.code} is valid again.` }), "Couldn't restore the certificate"));

  const bulkEmail = async (rows: IssuedRow[]) => {
    setIsBulkBusy(true);
    try {
      await run(
        null,
        `Emailing ${plural(rows.length, "certificate")}...`,
        () => bulkEmailCertificates(rows.map((r) => r.id)),
        ({ emailed, skipped }) => ({
          title: `${plural(emailed, "certificate")} emailed`,
          description: skipped ? `${plural(skipped, "revoked certificate")} skipped.` : "Each learner received a download link.",
        }),
        "Couldn't send the emails"
      );
    } catch {
      /* toast shown */
    } finally {
      setIsBulkBusy(false);
    }
  };

  const exportCsv = (rows: IssuedRow[]) =>
    quiet(run(null, "Preparing CSV...", async () => downloadCertificatesCsv(rows), (file) => ({ title: "CSV downloaded", description: `${plural(rows.length, "certificate")} exported to ${file}.` }), "Couldn't export the CSV"));

  // -------------------------------------------------------------- templates
  const duplicate = (t: CertificateTemplate) =>
    quiet(run(t.id, "Duplicating template...", () => duplicateTemplate(t.id), (copy) => ({ title: "Template duplicated", description: `“${copy.name}” was saved as a draft.` }), "Couldn't duplicate the template"));

  const setTemplateStatus = (t: CertificateTemplate, status: TemplateStatus) => {
    if (status === "ACTIVE" && t.courseIds.length === 0) {
      toast.error("Couldn't activate the template", { description: "Assign at least one course in the template editor first." });
      return;
    }
    const verb = status === "ACTIVE" ? "Activating" : status === "ARCHIVED" ? "Archiving" : "Moving to draft";
    quiet(
      run(t.id, `${verb} template...`, () => updateTemplate(t.id, { status }), () => ({
        title: status === "ACTIVE" ? "Template activated" : status === "ARCHIVED" ? "Template archived" : "Template moved to draft",
        description: status === "ACTIVE" ? `“${t.name}” now issues certificates for its courses.` : `“${t.name}” no longer issues new certificates.`,
      }), "Couldn't update the template")
    );
  };

  const removeTemplate = (t: CertificateTemplate) =>
    run(t.id, "Deleting template...", () => deleteTemplate(t.id), () => ({ title: "Template deleted", description: `“${t.name}” was removed.` }), "Couldn't delete the template");

  // -------------------------------------------------------------- eligible
  const issueAll = (courseId: string, courseTitle: string, count: number, sendEmail: boolean) =>
    run(courseId, `Issuing ${plural(count, "certificate")}...`, () => issueToEligible(courseId, sendEmail), (n) => ({
      title: `${plural(n, "certificate")} issued`,
      description: `Everyone eligible in ${courseTitle} now has a certificate${sendEmail ? " — emails sent" : ""}.`,
    }), "Couldn't issue the certificates");

  return { busyId, isBulkBusy, download, email, copyLink, revoke, restore, bulkEmail, exportCsv, duplicate, setTemplateStatus, removeTemplate, issueAll };
}

export type CertificateListActions = ReturnType<typeof useCertificateListActions>;
export default useCertificateListActions;
