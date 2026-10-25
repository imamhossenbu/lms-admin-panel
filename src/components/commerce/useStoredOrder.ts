"use client";

import { useEffect, useState } from "react";
import { OrderItem } from "@/types/order";
import { getStoredOrders, ORDERS_UPDATED_EVENT } from "@/lib/orderStorage";

/** Loads one order (plus the student's order count) and re-reads it whenever orders change. */
export function useStoredOrder(orderId: string) {
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [studentOrderCount, setStudentOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      const all = getStoredOrders();
      const found = all.find((o) => o.id === orderId) ?? null;
      setOrder(found);
      setStudentOrderCount(found ? all.filter((o) => o.student.id === found.student.id).length : 0);
    };
    const timer = setTimeout(() => {
      load();
      setIsLoading(false);
    }, 300);
    window.addEventListener(ORDERS_UPDATED_EVENT, load);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(ORDERS_UPDATED_EVENT, load);
    };
  }, [orderId]);

  return { order, studentOrderCount, isLoading };
}
