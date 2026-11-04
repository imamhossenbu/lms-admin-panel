"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import type { Broadcast, BroadcastDelivery } from "@/types/notification";
import type { BroadcastDetail } from "@/lib/notificationStorage";
import { BroadcastDetailHeader } from "./BroadcastDetailHeader";
import { BroadcastStatCards } from "./BroadcastStatCards";
import { BroadcastStatTile } from "./BroadcastStatTile";
import { BroadcastStatusCallout } from "./BroadcastStatusCallout";
import { DeliveryFunnelCard } from "./DeliveryFunnelCard";
import { ChannelBreakdownCard } from "./ChannelBreakdownCard";
import { OpensTimelineCard } from "./OpensTimelineCard";
import { RecipientsCard } from "./RecipientsCard";
import { MessagePreviewCard } from "./MessagePreviewCard";
import { BroadcastDetailsCard } from "./BroadcastDetailsCard";
import { BroadcastConfirmDialogs } from "./BroadcastConfirmDialogs";
import { BroadcastDetailSkeleton } from "./BroadcastSkeletons";
import { BroadcastNotFound, BROADCASTS_LIST_HREF } from "./BroadcastNotFound";
import { useBroadcastDetail } from "./useBroadcastDetail";
import { useBroadcastActions } from "./useBroadcastActions";

export interface BroadcastDetailViewProps {
  broadcastId: string;
}

/** Sent: stat cards, funnel, by-channel, opens chart, recipients. */
function SentAnalytics({ broadcast, detail, deliveries, retrying, onRetry }: { broadcast: Broadcast; detail: BroadcastDetail; deliveries: BroadcastDelivery[]; retrying: boolean; onRetry: () => void }) {
  const { stats, byChannel: channels, opensTimeline: timeline } = detail;
  return (
    <>
      <BroadcastStatCards stats={stats} channelCount={channels.length} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="min-w-0 space-y-5 xl:col-span-8">
          <DeliveryFunnelCard stats={stats} />
          {channels.length > 0 && <ChannelBreakdownCard channels={channels} />}
          <OpensTimelineCard data={timeline} />
        </div>
        <div className="min-w-0 space-y-5 xl:col-span-4">
          <MessagePreviewCard broadcast={broadcast} />
          <BroadcastDetailsCard broadcast={broadcast} />
        </div>
      </div>
      <RecipientsCard deliveries={deliveries} retrying={retrying} onRetryFailed={onRetry} />
    </>
  );
}

function BroadcastDetailLoaded({ broadcast: b, detail, deliveries }: { broadcast: Broadcast; detail: BroadcastDetail; deliveries: BroadcastDelivery[] }) {
  const router = useRouter();
  const actions = useBroadcastActions({ onDeleted: () => router.push(BROADCASTS_LIST_HREF) });
  const busy = actions.busyId === b.id;
  const edit = () => router.push(`/notifications/broadcasts/${b.id}/edit`);
  const estimate = detail.recipients;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-6 pb-8 text-left">
        <BroadcastDetailHeader
          broadcast={b}
          busy={busy}
          onDuplicate={() => void actions.duplicate(b)}
          onEdit={edit}
          onCancel={() => actions.openCancel(b)}
          onDelete={() => actions.openDelete(b)}
        />

        {b.status === "SENT" ? (
          <SentAnalytics broadcast={b} detail={detail} deliveries={deliveries} retrying={busy} onRetry={() => void actions.retryFailed(b)} />
        ) : (
          <>
            <BroadcastStatusCallout broadcast={b} busy={busy} onCancel={() => actions.openCancel(b)} onEdit={edit} onDuplicate={() => void actions.duplicate(b)} />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="min-w-0 xl:col-span-8">
                <MessagePreviewCard broadcast={b} />
              </div>
              <div className="min-w-0 space-y-5 xl:col-span-4">
                <BroadcastStatTile
                  icon={<Users className="h-5 w-5" />}
                  iconClassName="bg-blue-14 text-blue"
                  label="Estimated recipients"
                  value={estimate.toLocaleString()}
                  caption={`${(estimate * b.channels.length).toLocaleString()} messages across ${b.channels.length} ${b.channels.length === 1 ? "channel" : "channels"}`}
                />
                <BroadcastDetailsCard broadcast={b} />
              </div>
            </div>
          </>
        )}
      </motion.div>
      <BroadcastConfirmDialogs actions={actions} />
    </>
  );
}

/** /notifications/broadcasts/[id] — delivery analytics for sent broadcasts, preview + status callout otherwise. */
export function BroadcastDetailView({ broadcastId }: BroadcastDetailViewProps) {
  const state = useBroadcastDetail(broadcastId);
  if (state.status === "loading") return <BroadcastDetailSkeleton />;
  if (state.status === "notFound") return <BroadcastNotFound />;
  return <BroadcastDetailLoaded broadcast={state.broadcast} detail={state.detail} deliveries={state.deliveries} />;
}

export default BroadcastDetailView;
