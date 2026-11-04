"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { OrderItem, OrderStats } from "@/types/order";
import { ORDER_CHANGED_EVENT, ordersApi, type OrderListQuery, type OrderScope } from "@/lib/api/orders";
import { apiErrorMessage } from "@/lib/apiError";

const EMPTY_STATS: OrderStats = { total: 0, revenue: 0, currency: "BDT", paid: 0, pending: 0, failed: 0, cancelled: 0, refunded: 0 };

/**
 * One page of orders / payments + the stat cards for the same filters (server-side). Reloads when an action
 * announces a changed order. `rows` is null until the first response.
 */
export function useOrderList(scope: OrderScope, query: OrderListQuery) {
  const key = JSON.stringify(query);
  const [state, setState] = useState<{ key: string; rows: OrderItem[]; total: number; stats: OrderStats } | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    window.addEventListener(ORDER_CHANGED_EVENT, bump);
    return () => window.removeEventListener(ORDER_CHANGED_EVENT, bump);
  }, []);

  useEffect(() => {
    let alive = true;
    const q: OrderListQuery = JSON.parse(key);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, limit, ...filters } = q;
    Promise.all([ordersApi.list(scope, q), ordersApi.stats(scope, { ...filters, status: undefined, view: undefined })])
      .then(([list, stats]) => alive && setState({ key, rows: list.rows, total: list.meta.total, stats }))
      .catch((err) => {
        if (!alive) return;
        setState((s) => ({ key, rows: s?.rows ?? [], total: s?.total ?? 0, stats: s?.stats ?? EMPTY_STATS }));
        toast.error(scope === "order" ? "Couldn't load orders" : "Couldn't load payments", { id: `${scope}-list`, description: apiErrorMessage(err) });
      });
    return () => {
      alive = false;
    };
  }, [scope, key, version]);

  return useMemo(
    () => ({ rows: state?.rows ?? null, total: state?.total ?? 0, stats: state?.stats ?? EMPTY_STATS, isFetching: state?.key !== key }),
    [state, key]
  );
}
