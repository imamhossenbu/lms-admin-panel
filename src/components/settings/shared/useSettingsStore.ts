"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchSettings, getSettingsSnapshot, SETTINGS_UPDATED_EVENT, type SettingsStore } from "@/lib/settingsStorage";
import { apiErrorMessage } from "@/lib/apiError";

/**
 * Live, read-only view of the settings store for the page shell (status pill, skeleton gate).
 * Loads `/admin/settings` once; every save re-broadcasts SETTINGS_UPDATED_EVENT with the fresh store.
 */
export function useSettingsStore(): { store: SettingsStore | null; ready: boolean; loadError: string | null; retry: () => void } {
  const [store, setStore] = useState<SettingsStore | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    fetchSettings().then(
      (s) => {
        if (!alive) return;
        setLoadError(null);
        setStore(s);
      },
      (err) => alive && setLoadError(apiErrorMessage(err, "We couldn't load the settings. Please try again."))
    );
    return () => {
      alive = false;
    };
  }, [attempt]);

  useEffect(() => {
    const onUpdate = () => setStore(getSettingsSnapshot());
    window.addEventListener(SETTINGS_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(SETTINGS_UPDATED_EVENT, onUpdate);
  }, []);

  const retry = useCallback(() => {
    setLoadError(null);
    setAttempt((n) => n + 1);
  }, []);

  return { store, ready: store !== null, loadError, retry };
}

export default useSettingsStore;
