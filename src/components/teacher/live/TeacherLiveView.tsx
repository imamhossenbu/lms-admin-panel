"use client";

import React, { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Ban, CalendarPlus, Radio } from "lucide-react";
import { apiErrorMessage } from "@/lib/apiError";
import { teacherApi } from "@/lib/api/teacher";
import { usePagedList } from "@/lib/usePagedList";
import { useUrlParams } from "@/lib/useUrlParams";
import type { TeacherLive } from "@/types/teacher";
import { PageHeader } from "@/components/ui/PageHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { PageFade } from "../shared/PageFade";
import { EmptyRow } from "../shared/EmptyRow";
import { LiveClassRow } from "./LiveClassRow";
import { LiveClassModal } from "./LiveClassModal";
import { RecordingModal } from "./RecordingModal";

/** The teacher's live classes — schedule, edit or cancel upcoming ones (start link), add recordings to past ones. */
export function TeacherLiveView() {
  const { get, set } = useUrlParams();
  const when = get("when") === "past" ? "past" : "upcoming";
  const list = usePagedList(() => teacherApi.live(when), when);
  const [modal, setModal] = useState<"new" | string | null>(null);
  const [cancelling, setCancelling] = useState<TeacherLive | null>(null);
  const [recording, setRecording] = useState<TeacherLive | null>(null);
  const closeModal = useCallback(() => setModal(null), []);

  const cancel = async () => {
    if (!cancelling) return;
    const id = toast.loading("Cancelling the class…");
    try {
      await teacherApi.cancelLive(cancelling.id);
      toast.success("Class cancelled", { id, description: `${cancelling.title} is no longer on learners' schedules.` });
      list.reload();
    } catch (e) {
      toast.error("Couldn't cancel the class", { id, description: apiErrorMessage(e) });
      throw e;
    }
  };

  return (
    <PageFade>
      <PageHeader
        title="Live Classes"
        description="Schedule classes for your courses and start them from here."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <SegmentedControl options={[{ value: "upcoming", label: "Upcoming" }, { value: "past", label: "Past" }]} value={when} onChange={(v) => set({ when: v === "upcoming" ? null : v })} />
            <PrimaryButton leftIcon={<CalendarPlus className="h-4 w-4" />} onClick={() => setModal("new")}>
              Schedule class
            </PrimaryButton>
          </div>
        }
      />
      {list.error && !list.data ? (
        <LoadErrorCard title="Couldn't load live classes" message={list.error} onRetry={list.reload} />
      ) : !list.data ? (
        <div className="animate-pulse space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-dash bg-white p-4">
              <span className="h-12 w-12 rounded-lg bg-slate-200" />
              <div className="flex-1 space-y-2">
                <span className="block h-4 w-1/2 rounded bg-slate-200" />
                <span className="block h-3 w-1/3 rounded bg-slate-100" />
              </div>
              <span className="h-9 w-24 rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
      ) : list.data.length === 0 ? (
        <div className="dashboard-card">
          <EmptyRow icon={<Radio className="h-6 w-6" />} title={when === "upcoming" ? "No upcoming classes" : "No past classes"} text={when === "upcoming" ? "Schedule a class and it appears here." : "Finished classes appear here."} />
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
          {list.data.map((l) => (
            <LiveClassRow key={l.id} l={l} mine={l.mine} onEdit={() => setModal(l.id)} onCancel={() => setCancelling(l)} onRecording={() => setRecording(l)} />
          ))}
          </AnimatePresence>
        </div>
      )}
      <LiveClassModal target={modal} onClose={closeModal} onSaved={list.reload} />
      <RecordingModal live={recording} onClose={() => setRecording(null)} onSaved={list.reload} />
      <ConfirmModal
        isOpen={!!cancelling}
        title="Cancel this class?"
        message={cancelling ? `"${cancelling.title}" will be removed from enrolled learners' schedules.` : ""}
        confirmLabel="Cancel class"
        pendingLabel="Cancelling…"
        confirmIcon={<Ban className="h-4 w-4" />}
        onClose={() => setCancelling(null)}
        onConfirm={cancel}
      />
    </PageFade>
  );
}

export default TeacherLiveView;
