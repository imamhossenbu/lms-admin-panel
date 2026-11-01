"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { ModalShell } from "@/components/ui/ModalShell";
import { useUrlParams } from "@/lib/useUrlParams";
import { cn } from "@/lib/cn";
import {
  EMPTY_LESSON_FORM,
  LESSON_FIELD_TAB,
  LESSON_TABS,
  lessonFormSchema,
  lessonPublishIssues,
  type LessonFormValues,
  type LessonTab,
} from "@/validations/lessonFormSchema";
import type { AiOutlineLesson } from "../aiOutline";
import { formValuesToLesson, lessonToFormValues } from "./lessonFormMapping";
import { LessonEditorTabs } from "./LessonEditorTabs";
import { LessonEditorFooter } from "./LessonEditorFooter";
import { LessonBasicInfoTab } from "./basic/LessonBasicInfoTab";
import { LessonContentTab } from "./content/LessonContentTab";
import { LessonResourcesTab } from "./resources/LessonResourcesTab";
import { LessonSettingsTab } from "./settings/LessonSettingsTab";
import { LessonPreviewPanel } from "./preview/LessonPreviewPanel";

export interface LessonEditorModalProps {
  isOpen: boolean;
  moduleTitle?: string;
  /** Lesson being edited; omit when adding. */
  initialLesson?: AiOutlineLesson;
  /** Other lessons of the outline that can be a prerequisite. */
  prerequisiteOptions: { value: string; label: string }[];
  onClose: () => void;
  onSubmit: (lesson: Omit<AiOutlineLesson, "id">) => void;
}

type UploadSource = "basic" | "content" | "resources";
type Busy = "draft" | "publish" | "next" | null;

const TAB_PARAM = "lessonTab";
const FIELD_KEYS = Object.keys(LESSON_FIELD_TAB) as (keyof LessonFormValues)[];
const SETTINGS_FIELDS = FIELD_KEYS.filter((key) => LESSON_FIELD_TAB[key] === "settings");
const isLessonTab = (value: string): value is LessonTab => (LESSON_TABS as readonly string[]).includes(value);

/** First tab (in tab order) that owns one of the given top-level field names. */
const firstTabOf = (fields: string[]): LessonTab | undefined =>
  LESSON_TABS.find((tab) => fields.some((f) => LESSON_FIELD_TAB[f as keyof LessonFormValues] === tab));

/** Add / Edit Lesson: four tabs sharing one form, with a live preview side panel. */
export function LessonEditorModal({
  isOpen,
  moduleTitle,
  initialLesson,
  prerequisiteOptions,
  onClose,
  onSubmit,
}: LessonEditorModalProps) {
  const isEdit = Boolean(initialLesson);
  const { get, set } = useUrlParams();
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    mode: "onTouched",
    defaultValues: EMPTY_LESSON_FORM,
  });

  const [tab, setTab] = useState<LessonTab>("basic");
  const [visited, setVisited] = useState<Set<LessonTab>>(() => new Set(["basic"]));
  const [uploading, setUploading] = useState<Record<UploadSource, boolean>>({ basic: false, content: false, resources: false });
  const [busy, setBusy] = useState<Busy>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const urlTab = get(TAB_PARAM);

  // Reset form + tab whenever the modal opens (restoring a valid `?lessonTab=` from the URL).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      const startTab = isLessonTab(urlTab) ? urlTab : "basic";
      form.reset(lessonToFormValues(initialLesson));
      setTab(startTab);
      setVisited(new Set(["basic", startTab]));
      setUploading({ basic: false, content: false, resources: false });
      setBusy(null);
      if (urlTab !== startTab) set({ [TAB_PARAM]: startTab });
    }
    wasOpen.current = isOpen;
  }, [isOpen, initialLesson, form, urlTab, set]);

  // Drop the tab param once the modal is closed (also cleans a stale param after a reload).
  useEffect(() => {
    if (!isOpen && urlTab) set({ [TAB_PARAM]: null });
  }, [isOpen, urlTab, set]);

  const goTo = useCallback(
    (next: LessonTab) => {
      setTab(next);
      setVisited((prev) => (prev.has(next) ? prev : new Set(prev).add(next)));
      set({ [TAB_PARAM]: next });
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    },
    [set]
  );

  const uploadHandlers = useMemo(
    () => ({
      basic: (v: boolean) => setUploading((prev) => ({ ...prev, basic: v })),
      content: (v: boolean) => setUploading((prev) => ({ ...prev, content: v })),
      resources: (v: boolean) => setUploading((prev) => ({ ...prev, resources: v })),
    }),
    []
  );
  const isUploading = uploading.basic || uploading.content || uploading.resources;

  const { dirtyFields } = form.formState;
  const settingsDone =
    isEdit && !!initialLesson?.details
      ? true
      : visited.has("settings") || SETTINGS_FIELDS.some((key) => Boolean(dirtyFields[key]));

  const tabIndex = LESSON_TABS.indexOf(tab);

  const handleNext = async () => {
    setBusy("next");
    const fields = FIELD_KEYS.filter((key) => LESSON_FIELD_TAB[key] === tab) as FieldPath<LessonFormValues>[];
    const ok = await form.trigger(fields, { shouldFocus: true });
    setBusy(null);
    if (!ok) {
      toast.error("Please fix the highlighted fields", { description: "Complete this step before moving on." });
      return;
    }
    goTo(LESSON_TABS[Math.min(tabIndex + 1, LESSON_TABS.length - 1)]);
  };

  const submit = async (mode: "draft" | "publish") => {
    if (isUploading) {
      toast.error("Upload in progress", { description: "Please wait for your files to finish uploading before saving." });
      return;
    }
    setBusy(mode);
    try {
      const raw = form.getValues();
      const candidate: LessonFormValues = mode === "draft" ? { ...raw, visibility: "DRAFT" } : raw;
      const parsed = lessonFormSchema.safeParse(candidate);

      if (!parsed.success) {
        await form.trigger();
        const badTab = firstTabOf(parsed.error.issues.map((issue) => String(issue.path[0] ?? ""))) ?? tab;
        goTo(badTab);
        toast.error("Please fix the highlighted fields", {
          description: parsed.error.issues[0]?.message ?? "Some lesson details are missing or invalid.",
        });
        return;
      }

      if (mode === "publish") {
        const issues = lessonPublishIssues(parsed.data);
        if (issues.length) {
          issues.forEach((issue) =>
            form.setError(issue.path as FieldPath<LessonFormValues>, { type: "manual", message: issue.message })
          );
          goTo(LESSON_TABS.find((t) => issues.some((i) => i.tab === t)) ?? issues[0].tab);
          toast.error("This lesson isn't ready yet", { description: issues[0].message });
          return;
        }
      }

      const toastId = toast.loading(mode === "draft" ? "Saving draft..." : isEdit ? "Updating lesson..." : "Adding lesson...", {
        description: parsed.data.title,
      });
      try {
        onSubmit(formValuesToLesson(parsed.data));
        toast.success(mode === "draft" ? "Lesson saved as draft" : isEdit ? "Lesson updated" : "Lesson added", {
          id: toastId,
          description: parsed.data.title,
        });
      } catch {
        toast.error("Couldn't save the lesson", { id: toastId, description: "Something went wrong. Please try again." });
      }
    } finally {
      setBusy(null);
    }
  };

  const handleClose = () => {
    if (busy) return;
    onClose();
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={handleClose}
      headerVariant="hero"
      title={isEdit ? "Edit Lesson" : "Add Lesson"}
      titleIcon={isEdit ? <Pencil className="text-brand-orange" /> : <Plus className="text-brand-orange" />}
      subtitle={
        isEdit
          ? `Update this lesson${moduleTitle ? ` in "${moduleTitle}"` : ""}. Change its details, content, resources and settings.`
          : "Create a new lesson for this module. Choose the lesson type and add your content."
      }
      maxWidth="2xl"
      className="max-w-7xl"
      bodyClassName="flex flex-col p-0 overflow-y-auto lg:flex-row lg:overflow-hidden"
      footerClassName="px-8"
      footer={
        <LessonEditorFooter
          tab={tab}
          isFirst={tabIndex === 0}
          isLast={tabIndex === LESSON_TABS.length - 1}
          isEdit={isEdit}
          busy={busy}
          onCancel={handleClose}
          onBack={() => goTo(LESSON_TABS[Math.max(0, tabIndex - 1)])}
          onNext={handleNext}
          onSaveDraft={() => void submit("draft")}
          onSubmit={() => void submit("publish")}
        />
      }
    >
      <FormProvider {...form}>
        <form
          noValidate
          onSubmit={(e) => e.preventDefault()}
          className="flex min-h-0 flex-col lg:w-2/3 lg:flex-1 lg:border-r lg:border-dash"
        >
          <div className="shrink-0 px-8 pt-4">
            <LessonEditorTabs active={tab} onChange={goTo} />
          </div>
          <div ref={scrollRef} className="min-h-0 flex-1 px-8 py-5 lg:overflow-y-auto">
            {/* All tabs stay mounted so in-flight uploads and editor state survive tab switches. */}
            {LESSON_TABS.map((t) => (
              <motion.div
                key={t}
                id={`lesson-panel-${t}`}
                role="tabpanel"
                aria-labelledby={`lesson-tab-${t}`}
                hidden={t !== tab}
                initial={false}
                animate={t === tab ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className={cn(t !== tab && "hidden")}
              >
                {t === "basic" && (
                  <LessonBasicInfoTab prerequisiteOptions={prerequisiteOptions} onUploadingChange={uploadHandlers.basic} />
                )}
                {t === "content" && <LessonContentTab onUploadingChange={uploadHandlers.content} />}
                {t === "resources" && <LessonResourcesTab onUploadingChange={uploadHandlers.resources} />}
                {t === "settings" && <LessonSettingsTab />}
              </motion.div>
            ))}
          </div>
        </form>
        <aside className="shrink-0 px-6 py-5 lg:w-1/3 lg:max-w-md lg:overflow-y-auto">
          <LessonPreviewPanel tab={tab} settingsDone={settingsDone} />
        </aside>
      </FormProvider>
    </ModalShell>
  );
}

export default LessonEditorModal;
