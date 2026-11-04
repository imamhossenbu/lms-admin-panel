"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Broadcast, BroadcastDelivery } from "@/types/notification";
import { fetchBroadcast, NOTIFICATIONS_UPDATED_EVENT, type BroadcastDetail } from "@/lib/notificationStorage";
import { apiErrorMessage } from "@/lib/apiError";

export type BroadcastDetailState =
  | { status: "loading" }
  | { status: "notFound" }
  | { status: "ready"; broadcast: Broadcast; detail: BroadcastDetail; deliveries: BroadcastDelivery[] };

/** Loads a broadcast (analytics + deliveries) and reloads it whenever the notifications store changes. */
export function useBroadcastDetail(id: string) {
  const [state, setState] = useState<BroadcastDetailState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchBroadcast(id)
      .then((res) => {
        if (!cancelled) setState(res ? { status: "ready", ...res } : { status: "notFound" });
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error("Couldn't load broadcast", { description: apiErrorMessage(err, "Please refresh the page and try again.") });
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
    return () => {
      cancelled = true;
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
    };
  }, [id]);

  return state;
}

export default useBroadcastDetail;
