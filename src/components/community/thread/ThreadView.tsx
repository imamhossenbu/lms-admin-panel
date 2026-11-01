"use client";

import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { threadViews } from "@/lib/communityStats";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useThreadBundle, type ThreadPageData } from "./hooks/useThreadBundle";
import { useThreadActions } from "./hooks/useThreadActions";
import { useThreadTab } from "./hooks/useThreadTab";
import { DiscussionTab } from "./discussion/DiscussionTab";
import { ReportsTab } from "./reports/ReportsTab";
import { ThreadHeader } from "./ThreadHeader";
import { ThreadNotFound } from "./ThreadNotFound";
import { ThreadSkeleton } from "./ThreadSkeleton";
import { ThreadTabs } from "./ThreadTabs";

export interface ThreadViewProps {
  threadId: string;
}

/** Community thread page: loads the bundle (live-reloads on COMMUNITY_UPDATED_EVENT), then header, URL-synced tabs and the active tab. */
export function ThreadView({ threadId }: ThreadViewProps) {
  const state = useThreadBundle(threadId);
  if (state.kind === "loading") return <ThreadSkeleton />;
  if (state.kind === "notFound") return <ThreadNotFound />;
  return <ThreadContent data={state.data} />;
}

function ThreadContent({ data }: { data: ThreadPageData }) {
  const { thread, replies, reports } = data.bundle;
  const view = useMemo(() => threadViews([thread], replies, reports)[0], [thread, replies, reports]);
  const tabState = useThreadTab(reports.length > 0);
  const actions = useThreadActions(thread);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-6">
      <ThreadHeader view={view} actions={actions} />
      <ThreadTabs
        activeTab={tabState.activeTab}
        onChange={tabState.setActiveTab}
        replyCount={view.replyCount}
        reportCount={reports.length}
        openReports={view.openReports}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tabState.activeTab}
          id={`thread-panel-${tabState.activeTab}`}
          role="tabpanel"
          aria-labelledby={`thread-tab-${tabState.activeTab}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {tabState.activeTab === "reports" ? (
            <ReportsTab bundle={data.bundle} tabState={tabState} />
          ) : (
            <DiscussionTab data={data} view={view} tabState={tabState} threadActions={actions} />
          )}
        </motion.div>
      </AnimatePresence>

      <ConfirmModal
        isOpen={actions.deleteOpen}
        title="Delete Discussion"
        message={
          <>
            Permanently delete <strong>{thread.title}</strong> with its {view.replyCount} {view.replyCount === 1 ? "reply" : "replies"} and{" "}
            {reports.length} {reports.length === 1 ? "report" : "reports"}?
          </>
        }
        confirmLabel="Delete Discussion"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 />}
        onClose={actions.closeDelete}
        onConfirm={actions.confirmDelete}
      />
    </motion.div>
  );
}

export default ThreadView;
