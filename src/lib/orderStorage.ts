import { OrderItem } from "@/types/order";
import { buildMockOrders } from "@/data/mockOrderData";

// v2: statuses aligned with the backend (Paid / Pending / Failed / Cancelled / Refunded)
const STORAGE_KEY = "edupro_orders_list_v2";
export const ORDERS_UPDATED_EVENT = "edupro_orders_updated";

export const getStoredOrders = (): OrderItem[] => {
  if (typeof window === "undefined") return buildMockOrders();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  const seeded = buildMockOrders();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  } catch {}
  return seeded;
};

export const updateStoredOrder = (orderId: string, updates: Partial<OrderItem>): void => {
  if (typeof window === "undefined") return;
  try {
    const next = getStoredOrders().map((o) => (o.id === orderId ? { ...o, ...updates } : o));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(ORDERS_UPDATED_EVENT));
  } catch {}
};
