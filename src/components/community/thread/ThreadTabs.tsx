"use client";

import React from "react";
import { Flag, MessagesSquare } from "lucide-react";
import { PillTabs, type PillTabItem } from "@/components/ui/PillTabs";
import type { ThreadTab } from "./hooks/useThreadTab";

export interface ThreadTabsProps {
  activeTab: ThreadTab;
  onChange: (tab: ThreadTab) => void;
  replyCount: number;
  /** Total reports; the Reports tab is hidden when 0. */
  reportCount: number;
  openReports: number;
}

/** Discussion (N replies) / Reports (N open reports) — shared capsule PillTabs. */
export function ThreadTabs({ activeTab, onChange, replyCount, reportCount, openReports }: ThreadTabsProps) {
  const tabs: PillTabItem<ThreadTab>[] = [{ id: "discussion", label: "Discussion", icon: <MessagesSquare />, count: replyCount }];
  if (reportCount > 0) tabs.push({ id: "reports", label: "Reports", icon: <Flag />, count: openReports });
  return <PillTabs ariaLabel="Discussion sections" idPrefix="thread" activeId={activeTab} onChange={onChange} tabs={tabs} />;
}

export default ThreadTabs;
