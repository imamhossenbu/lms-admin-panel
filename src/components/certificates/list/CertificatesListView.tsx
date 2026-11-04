"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Award, LayoutTemplate, UserCheck } from "lucide-react";
import { useUrlParams } from "@/lib/useUrlParams";
import { useCourseCatalog } from "@/lib/courseCatalog";
import { PillTabs } from "@/components/ui/PillTabs";
import { IssueCertificateModal } from "../shared/IssueCertificateModal";
import { CertificatesHeader } from "./CertificatesHeader";
import { CertificateStatsRow } from "./CertificateStatsRow";
import { CertificateInsightStrip } from "./CertificateInsightStrip";
import { CertificatesListSkeleton } from "./CertificatesListSkeleton";
import { CertificatesLoadError } from "./CertificatesLoadError";
import { IssuedTab } from "./IssuedTab";
import { TemplatesTab } from "./TemplatesTab";
import { EligibleTab, type IssuePrefill } from "./EligibleTab";
import { VerifyCertificateModal } from "./VerifyCertificateModal";
import { parseTab, type CertificatesTab } from "./certificateListUtils";
import { useCertificatesData } from "./useCertificatesData";
import { useCertificateListActions } from "./useCertificateListActions";

/** Certificates list: header, stats, Issued / Templates / Eligible tabs (all state in the URL), issue + verify modals. */
export function CertificatesListView() {
  const { get, set } = useUrlParams();
  const { data, isLoading, loadError, retry } = useCertificatesData();
  // Loads the workspace courses (titles for templates / eligible rows) and re-renders once they arrive.
  useCourseCatalog();
  const actions = useCertificateListActions();
  const [issue, setIssue] = useState<{ open: boolean; prefill?: IssuePrefill }>({ open: false });
  const [verifyOpen, setVerifyOpen] = useState(false);

  const tab = parseTab(get("tab"));

  if (isLoading && !data) return <CertificatesListSkeleton tab={tab} />;
  if (loadError || !data) return <CertificatesLoadError message={loadError ?? "We couldn't read the certificates."} onRetry={retry} />;

  const openIssue = (prefill?: IssuePrefill) => setIssue({ open: true, prefill });
  const changeTab = (next: CertificatesTab) => set({ tab: next === "issued" ? null : next, page: null, perPage: null });

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8 text-left">
      <CertificatesHeader onVerify={() => setVerifyOpen(true)} onIssue={() => openIssue()} />
      <CertificateStatsRow certificates={data.certificates} />
      <CertificateInsightStrip certificates={data.certificates} />

      <PillTabs<CertificatesTab>
        ariaLabel="Certificate sections"
        idPrefix="certificates"
        activeId={tab}
        onChange={changeTab}
        tabs={[
          { id: "issued", label: "Issued", icon: <Award />, count: data.certificates.length },
          { id: "templates", label: "Templates", icon: <LayoutTemplate />, count: data.templates.length },
          { id: "eligible", label: "Eligible", icon: <UserCheck />, count: data.eligible.length },
        ]}
      />

      <motion.div key={tab} id={`certificates-panel-${tab}`} role="tabpanel" aria-labelledby={`certificates-tab-${tab}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}>
        {tab === "issued" && <IssuedTab data={data} actions={actions} onIssue={() => openIssue()} />}
        {tab === "templates" && <TemplatesTab data={data} actions={actions} />}
        {tab === "eligible" && <EligibleTab data={data} actions={actions} onIssue={openIssue} />}
      </motion.div>

      <IssueCertificateModal
        isOpen={issue.open}
        onClose={() => setIssue({ open: false })}
        defaultCourseId={issue.prefill?.courseId}
        defaultRecipientId={issue.prefill?.recipientId}
        defaultGrade={issue.prefill?.grade ?? null}
        defaultCompletedAt={issue.prefill?.completedAt}
      />
      <VerifyCertificateModal isOpen={verifyOpen} onClose={() => setVerifyOpen(false)} templates={data.templates} />
    </motion.div>
  );
}

export default CertificatesListView;
