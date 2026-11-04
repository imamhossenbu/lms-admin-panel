"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import type { CertificateEvent, CertificateTemplate, IssuedCertificate } from "@/types/certificate";
import { certificateStatus } from "@/lib/certificateStats";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { IssueCertificateModal } from "../shared/IssueCertificateModal";
import { CertificateDetailHeader } from "./CertificateDetailHeader";
import { CertificatePreviewCard } from "./CertificatePreviewCard";
import { CertificateVerificationCard } from "./CertificateVerificationCard";
import { CertificateInfoCard } from "./CertificateInfoCard";
import { CertificateActivityCard } from "./CertificateActivityCard";
import { CertificateDangerCard } from "./CertificateDangerCard";
import { CertificateDetailSkeleton } from "./CertificateDetailSkeleton";
import { CertificateNotFound } from "./CertificateNotFound";
import { RevokeCertificateModal } from "./RevokeCertificateModal";
import { useCertificateDetail } from "./useCertificateDetail";
import { useCertificateActions } from "./useCertificateActions";
import { useCertificateDownload } from "./useCertificateDownload";

export interface CertificateDetailViewProps {
  certificateId: string;
}

interface LoadedProps {
  certificate: IssuedCertificate;
  template: CertificateTemplate | null;
  events: CertificateEvent[];
}

function CertificateDetailLoaded({ certificate, template, events }: LoadedProps) {
  const router = useRouter();
  const status = certificateStatus(certificate);
  const download = useCertificateDownload(certificate, template, certificate.courseTitle);
  const act = useCertificateActions(certificate, download);
  const lastVerifiedAt = events.filter((e) => e.kind === "VERIFIED").sort((a, b) => b.at.localeCompare(a.at))[0]?.at ?? null;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-6">
        <CertificateDetailHeader
          certificate={certificate}
          courseTitle={certificate.courseTitle}
          status={status}
          busy={act.busy}
          onDownload={() => void act.download()}
          onEmail={() => void act.email()}
          onCopyLink={() => void act.copyLink()}
          onOpenVerification={act.openVerification}
          onReissue={() => act.open("reissue")}
          onRevoke={() => act.open("revoke")}
          onRestore={() => act.open("restore")}
        />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="min-w-0 space-y-5 xl:col-span-8">
            <CertificatePreviewCard certificate={certificate} template={template} courseTitle={certificate.courseTitle} status={status} />
            <CertificateVerificationCard certificate={certificate} link={act.link} lastVerifiedAt={lastVerifiedAt} onOpen={act.openVerification} />
          </div>
          <div className="min-w-0 space-y-5 xl:col-span-4">
            <CertificateInfoCard certificate={certificate} template={template} />
            <CertificateActivityCard events={events} />
            <CertificateDangerCard status={status} onRevoke={() => act.open("revoke")} onRestore={() => act.open("restore")} />
          </div>
        </div>
      </motion.div>

      <RevokeCertificateModal
        isOpen={act.dialog === "revoke"}
        onClose={act.close}
        recipientName={certificate.recipient.name}
        code={certificate.code}
        onSubmit={act.revoke}
      />
      <ConfirmModal
        isOpen={act.dialog === "restore"}
        title="Restore this certificate?"
        subtitle="It becomes valid again on the verification page."
        message={
          <>
            <strong>{certificate.code}</strong> for {certificate.recipient.name} will be marked as valid
            {certificate.revokedReason ? <> (revoked for “{certificate.revokedReason}”)</> : null}.
          </>
        }
        confirmLabel="Restore Certificate"
        pendingLabel="Restoring..."
        confirmIcon={<RotateCcw className="h-4 w-4" />}
        onClose={act.close}
        onConfirm={act.restore}
      />
      <IssueCertificateModal
        isOpen={act.dialog === "reissue"}
        onClose={act.close}
        defaultCourseId={certificate.courseId}
        defaultRecipientId={certificate.recipient.id}
        defaultGrade={certificate.grade}
        defaultCompletedAt={certificate.completedAt.slice(0, 10)}
        onIssued={(next) => router.push(`/certificates/${next.id}`)}
      />
    </>
  );
}

/** Certificate detail page: header actions, rendered certificate + verification, details / activity / revoke sidebar. */
export function CertificateDetailView({ certificateId }: CertificateDetailViewProps) {
  const state = useCertificateDetail(certificateId);
  if (state.status === "loading") return <CertificateDetailSkeleton />;
  if (state.status === "notFound") return <CertificateNotFound />;
  return <CertificateDetailLoaded certificate={state.certificate} template={state.template} events={state.events} />;
}

export default CertificateDetailView;
