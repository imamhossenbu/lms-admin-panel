"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Broadcast, BroadcastDelivery } from "@/types/notification";
import { fetchBroadcast, NOTIFICATIONS_UPDATED_EVENT } from "@/lib/notificationStorage";

export type BroadcastDetailState =
  | { status: "loading" }
  | { status: "notFound" }
  | { status: "ready"; broadcast: Broadcast; deliveries: BroadcastDelivery[] };

/** Loads a broadcast + its deliveries and reloads whenever notification storage changes (this tab or others). */
export function useBroadcastDetail(id: string) {
  const [state, setState] = useState<BroadcastDetailState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchBroadcast(id)
      .then((res) => {
        if (!cancelled) setState(res ? { status: "ready", ...res } : { status: "notFound" });
      })
      .catch(() => {
        if (cancelled) return;
        toast.error("Couldn't load broadcast", { description: "Please refresh the page and try again." });
        setState({ status: "notFound" });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    // A deleted broadcast becomes "not found"; read errors keep the last data on screen.
    const refresh = () => {
      fetchBroadcast(id)
        .then((res) => {
          if (!cancelled) setState(res ? { status: "ready", ...res } : { status: "notFound" });
        })
        .catch(() => {});
    };
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [id]);

  return state;
}

export default useBroadcastDetail;
