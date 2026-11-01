"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LiveClassBundle } from "@/lib/liveClassStorage";
import type { LiveDisplayStatus } from "@/types/liveClass";
import { useLiveClassBundle } from "./hooks/useLiveClassBundle";
import { useLiveDetailTab } from "./hooks/useLiveDetailTab";
import { useLiveClassActions } from "./hooks/useLiveClassActions";
import { LiveClassDetailsHeader } from "./LiveClassDetailsHeader";
import { LiveClassSummaryCard } from "./LiveClassSummaryCard";
import { LiveDetailTabs } from "./LiveDetailTabs";
import { LiveDetailPanels } from "./LiveDetailPanels";
import { LiveClassConfirmModals } from "./LiveClassConfirmModals";
import { LiveClassDetailsSkeleton } from "./LiveClassDetailsSkeleton";
import { LiveClassNotFound } from "./LiveClassNotFound";

export interface LiveClassDetailsViewProps {
  classId: string;
}

/** Live Class Details page: loads the bundle, then header, summary card, URL-synced tabs and the active tab. */
export function LiveClassDetailsView({ classId }: LiveClassDetailsViewProps) {
  const { state, status, now } = useLiveClassBundle(classId);
  if (state.kind === "loading") return <LiveClassDetailsSkeleton />;
  if (state.kind === "notFound" || !status) return <LiveClassNotFound />;
  return <LiveClassDetailsContent bundle={state.bundle} status={status} now={now} />;
}

function LiveClassDetailsContent({ bundle, status, now }: { bundle: LiveClassBundle; status: LiveDisplayStatus; now: Date }) {
  const { activeTab, setActiveTab } = useLiveDetailTab();
  const actions = useLiveClassActions(bundle.liveClass);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-6">
      <LiveClassDetailsHeader liveClass={bundle.liveClass} status={status} actions={actions} />
      <LiveClassSummaryCard liveClass={bundle.liveClass} enrollments={bundle.enrollments} status={status} now={now} />
      <LiveDetailTabs bundle={bundle} activeTab={activeTab} onChange={setActiveTab} />
      <LiveDetailPanels activeTab={activeTab} bundle={bundle} status={status} onTabChange={setActiveTab} />
      <LiveClassConfirmModals title={bundle.liveClass.title} enrolled={bundle.enrollments.length} actions={actions} />
    </motion.div>
  );
}

export default LiveClassDetailsView;
