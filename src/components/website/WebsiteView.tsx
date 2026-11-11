"use client";

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Inbox, Users } from "lucide-react";
import { useCan } from "@/lib/usePermission";
import { useUrlParams } from "@/lib/useUrlParams";
import { PillTabs } from "@/components/ui/PillTabs";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { WebsiteHeader } from "./WebsiteHeader";
import { WebsiteSkeleton } from "./WebsiteSkeleton";
import { WebsiteContentTab } from "./content/WebsiteContentTab";
import { MessagesTab } from "./messages/MessagesTab";
import { SubscribersTab } from "./subscribers/SubscribersTab";
import { useWebsite } from "./shared/useWebsite";

type Tab = "content" | "messages" | "subscribers";
const parseTab = (v: string): Tab => (v === "messages" || v === "subscribers" ? v : "content");

/** /website — Content / Messages / Subscribers (`?tab=` survives reloads). Leaving unsaved content asks first. Render inside <Suspense>. */
export function WebsiteView() {
  const canView = useCan("settings", "view");
  const { get, set } = useUrlParams();
  const tab = parseTab(get("tab"));
  const site = useWebsite();
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState<Tab | null>(null);
  const [unread, setUnread] = useState<number | undefined>(undefined);
  const onUnread = useCallback((n: number) => setUnread(n), []);

  if (!canView) return <LoadErrorCard title="No access" message="You need the Settings permission to manage the website. Ask the workspace owner." onRetry={() => window.location.reload()} />;
  if (site.error && !site.data) return <LoadErrorCard title="Couldn't load the website" message={site.error} onRetry={site.retry} />;
  if (!site.data) return <WebsiteSkeleton />;

  const go = (next: Tab) => {
    setDirty(false);
    set({ tab: next === "content" ? null : next }, { replaceAll: true });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8 text-left">
      <WebsiteHeader siteUrl={site.data.siteUrl} />
      <PillTabs<Tab>
        ariaLabel="Website sections"
        idPrefix="website"
        tabs={[
          { id: "content", label: "Content", icon: <FileText className="h-4 w-4" /> },
          { id: "messages", label: "Messages", icon: <Inbox className="h-4 w-4" />, count: unread || undefined },
          { id: "subscribers", label: "Subscribers", icon: <Users className="h-4 w-4" /> },
        ]}
        activeId={tab}
        onChange={(next) => (next === tab ? undefined : dirty ? setPending(next) : go(next))}
      />
      <motion.div key={tab} role="tabpanel" id={`website-panel-${tab}`} aria-labelledby={`website-tab-${tab}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}>
        {tab === "content" && <WebsiteContentTab data={site.data} onSaved={site.setData} onDirtyChange={setDirty} />}
        {tab === "messages" && <MessagesTab onUnread={onUnread} />}
        {tab === "subscribers" && <SubscribersTab />}
      </motion.div>
      <ConfirmModal
        isOpen={!!pending}
        title="Discard unsaved changes?"
        message="You have unsaved website changes. Leave this tab and lose them?"
        confirmLabel="Discard changes"
        onClose={() => setPending(null)}
        onConfirm={async () => {
          if (pending) go(pending);
          setPending(null);
        }}
      />
    </motion.div>
  );
}

export default WebsiteView;
