"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, type DefaultValues, type FieldValues, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import { SETTINGS_SCHEMAS, type PlatformSettings, type SettingsSection } from "@/validations/platformSettingsSchema";
import { getSettingsSnapshot, saveSettingsSection, SETTINGS_UPDATED_EVENT, type SettingsStore } from "@/lib/settingsStorage";

/** Human labels for changed-field audit entries: "platformName" → "Platform name". */
const humanize = (key: string) =>
  key
    .replace(/\./g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/\b(Url|Api|Ip|Smtp|Mb|Ai)\b/g, (m) => m.toUpperCase());

/** Top-level (and one nested level) keys whose values differ. */
function changedKeys(a: Record<string, unknown>, b: Record<string, unknown>): string[] {
  return Object.keys(b).flatMap((k) => {
    const x = a[k];
    const y = b[k];
    if (x && y && typeof x === "object" && typeof y === "object" && !Array.isArray(x)) {
      return Object.keys(y as object)
        .filter((n) => JSON.stringify((x as Record<string, unknown>)[n]) !== JSON.stringify((y as Record<string, unknown>)[n]))
        .map((n) => `${k}.${n}`);
    }
    return JSON.stringify(x) === JSON.stringify(y) ? [] : [k];
  });
}

export interface SettingsSectionApi<K extends SettingsSection> {
  form: UseFormReturn<PlatformSettings[K] & FieldValues>;
  /** Live store (secret hints, audit, backups, updatedAt). */
  store: SettingsStore;
  isSaving: boolean;
  /** Validate + save with toasts; returns true on success. */
  save: () => Promise<boolean>;
  /** Reset to the last saved values. */
  discard: () => void;
}

/**
 * One form per settings section: zod-validated, dirty tracking for the sticky save bar,
 * loading → success/error toasts, audit summary of changed fields, live refresh when another
 * section (or tab) saves. Secret inputs should start empty — show `store.secretHints["section.path"]`
 * as the placeholder ("••••1234") and leave them empty to keep the current value.
 */
export function useSettingsSection<K extends SettingsSection>(section: K, labels: Partial<Record<string, string>> = {}): SettingsSectionApi<K> {
  const [store, setStore] = useState<SettingsStore>(() => getSettingsSnapshot());
  const [isSaving, setIsSaving] = useState(false);
  const schema = SETTINGS_SCHEMAS[section] as unknown as z.ZodType<PlatformSettings[K] & FieldValues>;

  const form = useForm<PlatformSettings[K] & FieldValues>({
    resolver: zodResolver(schema as never),
    mode: "onTouched",
    defaultValues: store.settings[section] as DefaultValues<PlatformSettings[K] & FieldValues>,
  });

  // Keep the store live; only reset the form when it has no unsaved edits.
  useEffect(() => {
    const onUpdate = () => {
      const next = getSettingsSnapshot();
      setStore(next);
      if (!form.formState.isDirty) form.reset(next.settings[section] as DefaultValues<PlatformSettings[K] & FieldValues>);
    };
    window.addEventListener(SETTINGS_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(SETTINGS_UPDATED_EVENT, onUpdate);
  }, [form, section]);

  const save = useMemo(
    () => async () => {
      const ok = await form.trigger();
      if (!ok) {
        toast.error("Please fix the highlighted fields", { description: "Some settings are missing or invalid." });
        return false;
      }
      const values = form.getValues();
      const before = store.settings[section] as unknown as Record<string, unknown>;
      const changed = changedKeys(before, values as Record<string, unknown>).map((k) => labels[k] ?? humanize(k));
      setIsSaving(true);
      const id = toast.loading("Saving settings...");
      try {
        const next = await saveSettingsSection(section, values as PlatformSettings[K], changed);
        setStore(next);
        form.reset(next.settings[section] as DefaultValues<PlatformSettings[K] & FieldValues>);
        toast.success("Settings saved", { id, description: changed.length ? `Updated ${changed.slice(0, 3).join(", ")}${changed.length > 3 ? "…" : ""}.` : "No changes." });
        return true;
      } catch (err) {
        toast.error("Couldn't save settings", { id, description: err instanceof Error ? err.message : "Please try again." });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [form, labels, section, store.settings]
  );

  const discard = () => form.reset(store.settings[section] as DefaultValues<PlatformSettings[K] & FieldValues>);

  return { form, store, isSaving, save, discard };
}

export default useSettingsSection;
