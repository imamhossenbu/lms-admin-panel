"use client";

import React, { useId, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, SearchX, ShieldCheck, ShieldX } from "lucide-react";
import type { CertificateTemplate, IssuedCertificate } from "@/types/certificate";
import { verifyCertificateCode } from "@/lib/certificateStorage";
import { certificateStatus, formatCertDate } from "@/lib/certificateStats";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { Avatar } from "@/components/ui/Avatar";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { cn } from "@/lib/cn";
import { CertificateStatusBadge } from "../shared/CertificateStatusBadge";
import { courseTitleOf } from "./certificateListUtils";

const schema = z.object({
  code: z
    .string()
    .trim()
    .min(6, "Enter the full certificate code")
    .max(40, "Codes are 40 characters or less")
    .regex(/^[A-Za-z0-9-]+$/, "Use letters, numbers and dashes only"),
});
type Values = z.infer<typeof schema>;

type Result = { kind: "found"; certificate: IssuedCertificate } | { kind: "missing"; code: string } | null;

/** Code → verifyCertificateCode → status card ("Valid / Revoked / Expired") or "not found". */
export function VerifyCertificateModal({ isOpen, onClose, templates }: { isOpen: boolean; onClose: () => void; templates: CertificateTemplate[] }) {
  const formId = useId();
  const [result, setResult] = useState<Result>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: "onTouched", defaultValues: { code: "" } });

  const close = () => {
    if (isSubmitting) return;
    reset({ code: "" });
    setResult(null);
    onClose();
  };

  const submit = async ({ code }: Values) => {
    const toastId = toast.loading("Verifying certificate...", { description: code.toUpperCase() });
    try {
      const certificate = await verifyCertificateCode(code);
      if (certificate) {
        const status = certificateStatus(certificate);
        setResult({ kind: "found", certificate });
        const title = status === "VALID" ? "Certificate is valid" : status === "REVOKED" ? "Certificate was revoked" : "Certificate has expired";
        (status === "VALID" ? toast.success : toast.warning)(title, { id: toastId, description: `${certificate.code} · ${certificate.recipient.name}` });
      } else {
        setResult({ kind: "missing", code: code.toUpperCase() });
        toast.error("Certificate not found", { id: toastId, description: "No certificate matches that code." });
      }
    } catch {
      toast.error("Couldn't verify the certificate", { id: toastId, description: "Please try again." });
    }
  };

  const cert = result?.kind === "found" ? result.certificate : null;
  const status = cert ? certificateStatus(cert) : null;
  const template = cert ? templates.find((t) => t.id === cert.templateId) : undefined;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={close}
      title="Verify Certificate"
      subtitle="Check any certificate code exactly as an employer would."
      maxWidth="md"
      footer={
        <>
          <SecondaryButton type="button" onClick={close} disabled={isSubmitting}>
            Close
          </SecondaryButton>
          <PrimaryButton type="submit" form={formId} isLoading={isSubmitting} disabled={isSubmitting} leftIcon={<ShieldCheck className="h-4 w-4" />}>
            {isSubmitting ? "Verifying..." : "Verify"}
          </PrimaryButton>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit(submit)} noValidate className="space-y-4 text-left">
        <InputField
          id={`${formId}-code`}
          label={<span className="body-sm-medium text-primary-500">Certificate Code</span>}
          required
          placeholder="e.g. EDU-HF-2026-00042"
          autoComplete="off"
          className="uppercase"
          error={errors.code?.message}
          {...register("code")}
        />

        <AnimatePresence mode="wait">
          {cert && status && (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={cn("rounded-xl border p-4", status === "VALID" ? "border-green bg-green-bg" : status === "REVOKED" ? "border-red bg-red-14" : "border-dash bg-gray-bg")}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 body-sm-medium font-semibold! text-primary-500">
                  {status === "VALID" ? <ShieldCheck className="h-5 w-5 text-green" /> : <ShieldX className={cn("h-5 w-5", status === "REVOKED" ? "text-red" : "text-primary-300")} />}
                  {status === "VALID" ? "Authentic and valid" : status === "REVOKED" ? "This certificate was revoked" : "This certificate has expired"}
                </span>
                <CertificateStatusBadge status={status} />
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-lg bg-white p-3">
                <Avatar name={cert.recipient.name} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate body-sm-medium font-semibold! text-primary-500">{cert.recipient.name}</p>
                  <p className="truncate body-xsm-regular text-primary-300">{courseTitleOf(cert.courseId)}</p>
                </div>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  ["Code", cert.code],
                  ["Template", template?.name ?? "Deleted template"],
                  ["Issued", formatCertDate(cert.issuedAt)],
                  ["Expires", cert.expiresAt ? formatCertDate(cert.expiresAt) : "Never"],
                ].map(([k, v]) => (
                  <div key={k} className="min-w-0">
                    <dt className="body-2xsm-regular text-primary-300">{k}</dt>
                    <dd className="truncate body-xsm-medium text-primary-500" title={v}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
              {status === "REVOKED" && cert.revokedReason && <p className="mt-2 body-xsm-regular text-red-dark">Reason: {cert.revokedReason}</p>}
              <Link href={`/certificates/${cert.id}`} className="mt-3 inline-flex items-center gap-1 body-sm-medium text-blue hover:underline">
                Open certificate <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          )}
          {result?.kind === "missing" && (
            <motion.div
              key="missing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-dash bg-gray-bg p-6 text-center"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-14 text-red">
                <SearchX className="h-5 w-5" />
              </span>
              <p className="body-sm-medium font-semibold! text-primary-500">Certificate not found</p>
              <p className="body-xsm-regular text-primary-300">No certificate matches “{result.code}”. Check the code for typos and try again.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </ModalShell>
  );
}

export default VerifyCertificateModal;
