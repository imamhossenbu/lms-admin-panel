"use client";

import React, { Suspense, useMemo, useState } from "react";
import { FolderOpen, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PillTabs } from "@/components/ui/PillTabs";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Skeleton } from "@/components/ui/Skeleton";
import { deleteLiveResource } from "@/lib/liveClassStorage";
import { courseOf, durationMinutes } from "@/lib/liveClassStats";
import type { LiveResource, LiveResourceType } from "@/types/liveClass";
import type { LiveTabProps } from "../../liveTabTypes";
import { LiveTabCard } from "../qa/LiveTabCard";
import { LiveTabColumns } from "../qa/LiveTabColumns";
import { TabEmptyState } from "../qa/TabEmptyState";
import { errorText } from "../qa/liveTabFormat";
import { RecordingPreviewCard } from "./RecordingPreviewCard";
import { ResourceFormModal } from "./ResourceFormModal";
import { ResourceQuickActions } from "./ResourceQuickActions";
import { ResourcesTable } from "./ResourcesTable";
import { RESOURCE_TYPE_META, RESOURCE_TYPES } from "./resourceMeta";
import { RESOURCE_PAGE_SIZE, useResourceFilters, type ResourceFilter } from "./useResourceFilters";

type ModalState = { key: number; resource: LiveResource | null; type: LiveResourceType } | null;

function ResourcesTabBody({ bundle, status }: LiveTabProps) {
  const { liveClass } = bundle;
  const f = useResourceFilters();
  const [modal, setModal] = useState<ModalState>(null);
  const [deleting, setDeleting] = useState<LiveResource | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const resources = useMemo(() => [...bundle.resources].sort((a, b) => a.addedAt.localeCompare(b.addedAt)), [bundle.resources]);
  const counts = useMemo(() => {
    const c = Object.fromEntries(RESOURCE_TYPES.map((t) => [t, 0])) as Record<LiveResourceType, number>;
    resources.forEach((r) => c[r.type]++);
    return c;
  }, [resources]);

  const filtered = f.type === "ALL" ? resources : resources.filter((r) => r.type === f.type);
  const totalPages = Math.max(1, Math.ceil(filtered.length / RESOURCE_PAGE_SIZE));
  const page = Math.min(f.page, totalPages);
  const rows = filtered.slice((page - 1) * RESOURCE_PAGE_SIZE, page * RESOURCE_PAGE_SIZE);
  const recording = [...resources].reverse().find((r) => r.type === "RECORDING") ?? null;
  const happened = status === "COMPLETED" || status === "LIVE";

  const openAdd = (type: LiveResourceType = "DOCUMENT") => setModal({ key: Date.now(), resource: null, type });

  const remove = async () => {
    if (!deleting) return;
    const toastId = toast.loading("Deleting resource...", { description: deleting.title });
    try {
      await deleteLiveResource(deleting.id);
      setSelected((s) => s.filter((id) => id !== deleting.id));
      toast.success("Resource deleted", { id: toastId, description: `${deleting.title} was removed from this class.` });
    } catch (e) {
      toast.error("Couldn't delete the resource", { id: toastId, description: errorText(e) });
      throw e;
    }
  };

  const tabs = [
    { id: "ALL" as ResourceFilter, label: "All", count: resources.length },
    ...RESOURCE_TYPES.map((t) => ({ id: t as ResourceFilter, label: RESOURCE_TYPE_META[t].label, count: counts[t], icon: React.createElement(RESOURCE_TYPE_META[t].icon) })),
  ];

  return (
    <>
      <LiveTabColumns
        main={
          <LiveTabCard
            title={`Class Resources (${resources.length})`}
            subtitle="Share learning materials, recordings, notes and useful links for students."
            action={
              <PrimaryButton leftIcon={<Plus />} onClick={() => openAdd()}>
                Add Resource
              </PrimaryButton>
            }
          >
            {resources.length === 0 ? (
              <TabEmptyState
                icon={<FolderOpen className="h-6 w-6" />}
                title="No resources shared yet"
                description={happened ? "Upload the recording, notes or code examples from this session." : "Add pre-reading or links now — students will see them on the class page."}
              />
            ) : (
              <div className="space-y-4">
                <PillTabs tabs={tabs} activeId={f.type} onChange={f.setType} ariaLabel="Filter resources by type" />
                <ResourcesTable
                  rows={rows}
                  total={filtered.length}
                  page={page}
                  onPageChange={f.setPage}
                  selected={selected}
                  onSelectedChange={setSelected}
                  onOpen={(r) => window.open(r.url, "_blank", "noopener,noreferrer")}
                  onEdit={(r) => setModal({ key: Date.now(), resource: r, type: r.type })}
                  onDelete={setDeleting}
                  emptyMessage={`No ${f.type === "ALL" ? "" : `${RESOURCE_TYPE_META[f.type].label.toLowerCase()} `}resources yet.`}
                />
              </div>
            )}
          </LiveTabCard>
        }
        side={
          <>
            <RecordingPreviewCard
              recording={recording}
              classTitle={liveClass.title}
              course={courseOf(liveClass.courseId)}
              durationMin={durationMinutes(liveClass)}
              canUpload={happened}
              onUpload={() => openAdd("RECORDING")}
            />
            <ResourceQuickActions onAdd={openAdd} />
          </>
        }
      />

      {modal && <ResourceFormModal key={modal.key} classId={liveClass.id} resource={modal.resource} presetType={modal.type} onClose={() => setModal(null)} />}

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Resource"
        message={
          <>
            <strong>{deleting?.title}</strong> will be removed for every student of this class.
          </>
        }
        confirmLabel="Delete Resource"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
      />
    </>
  );
}

/** Skeleton mirroring the resources table + recording preview + quick actions. */
export function ResourcesTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <div className="dashboard-card space-y-4 p-5 xl:col-span-8">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3.5 w-80" />
          </div>
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
        <div className="flex gap-2">
          {[16, 28, 28, 20, 20].map((w, i) => (
            <Skeleton key={i} className="h-9 rounded-xl" style={{ width: `${w * 4}px` }} />
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-dash">
          {Array.from({ length: 5 }).map((_, r) => (
            <div key={r} className="flex items-center divide-x divide-dash border-b border-dash last:border-b-0">
              <div className="px-3.5 py-3"><Skeleton className="h-4 w-4" /></div>
              <div className="flex flex-1 items-center gap-3 px-3.5 py-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-44" />
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>
              <div className="px-3.5 py-3"><Skeleton className="h-6 w-20" /></div>
              <div className="px-3.5 py-3"><Skeleton className="h-3 w-12" /></div>
              <div className="px-3.5 py-3"><Skeleton className="h-6 w-24" /></div>
              <div className="px-3.5 py-3"><Skeleton className="h-7 w-7" /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-5 xl:col-span-4">
        <div className="dashboard-card space-y-3 p-4.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="aspect-video w-full rounded-xl" />
        </div>
        <div className="dashboard-card space-y-2.5 p-4.5">
          <Skeleton className="h-4 w-28" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-dash p-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-44" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Resources tab: type pills + resources table, add/edit modal, recording preview and quick actions. */
export function ResourcesTab(props: LiveTabProps) {
  return (
    <Suspense fallback={<ResourcesTabSkeleton />}>
      <ResourcesTabBody {...props} />
    </Suspense>
  );
}

export default ResourcesTab;
