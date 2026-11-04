"use client";

import { useEffect, useState } from "react";
import type { OrderItem } from "@/types/order";
import { ORDER_CHANGED_EVENT, ordersApi, type OrderScope } from "@/lib/api/orders";
import { parseApiError } from "@/lib/apiError";

/**
 * Loads one order from the API (Orders or Payments endpoint, by `scope`) plus how many orders the student has,
 * and swaps in the updated order whenever an action announces a change.
 */
export function useStoredOrder(orderId: string, scope: OrderScope = "order") {
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [studentOrderCount, setStudentOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{ notFound: boolean; message: string } | null>(null);

  useEffect(() => {
    let alive = true;
    ordersApi
      .get(scope, orderId)
      .then(async (found) => {
        if (!alive) return;
        setOrder(found);
        const res = await ordersApi.list(scope, { q: found.student.email, limit: 1 }).catch(() => null);
        if (alive) setStudentOrderCount(res?.meta.total ?? 1);
      })
      .catch((err) => {
        const info = parseApiError(err, "We couldn't load this order.");
        if (alive) setError({ notFound: info.status === 404, message: info.message });
      })
      .finally(() => alive && setIsLoading(false));

    const onChange = (e: Event) => {
      const updated = (e as CustomEvent<OrderItem>).detail;
      if (updated?.id === orderId) setOrder(updated);
    };
    window.addEventListener(ORDER_CHANGED_EVENT, onChange);
    return () => {
      alive = false;
      window.removeEventListener(ORDER_CHANGED_EVENT, onChange);
    };
  }, [orderId, scope]);

  return { order, studentOrderCount, isLoading, error };
}
