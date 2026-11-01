"use client";

import { useEffect, useState } from "react";
import { fetchSettings, getSettingsSnapshot, SETTINGS_UPDATED_EVENT, type SettingsStore } from "@/lib/settingsStorage";

/**
 * Live, read-only view of the settings store for the page shell (status pill, skeleton gate).
 * `ready` flips after the first (simulated) fetch so SSR and the first client render match.
 */
export function useSettingsStore(): { store: SettingsStore | null; ready: boolean } {
  const [store, setStore] = useState<SettingsStore | null>(null);

  useEffect(() => {
    let alive = true;
    fetchSettings().then(
      (s) => alive && setStore(s),
      () => alive && setStore(getSettingsSnapshot())
    );
    const onUpdate = () => setStore(getSettingsSnapshot());
    window.addEventListener(SETTINGS_UPDATED_EVENT, onUpdate);
    // Other browser tabs write the same localStorage key.
    window.addEventListener("storage", onUpdate);
    return () => {
      alive = false;
      window.removeEventListener(SETTINGS_UPDATED_EVENT, onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  return { store, ready: store !== null };
}

export default useSettingsStore;
