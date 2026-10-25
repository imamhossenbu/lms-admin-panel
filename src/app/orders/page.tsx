"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { OrderItem, OrderStatus } from "@/types/order";
import { getStoredOrders, ORDERS_UPDATED_EVENT } from "@/lib/orderStorage";
import { useUrlParams } from "@/lib/useUrlParams";
import { PillTabs } from "@/components/ui/PillTabs";
import { TablePagination } from "@/components/ui/TablePagination";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrderStatsRow } from "@/components/orders/OrderStatsRow";
import { OrdersToolbar } from "@/components/orders/OrdersToolbar";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrderDetailsDrawer } from "@/components/orders/details/OrderDetailsDrawer";
import { OrdersPageSkeleton } from "@/components/orders/OrdersPageSkeleton";
import { formatOrderDateTime } from "@/components/orders/orderFormat";
import { useOrderActions } from "@/components/orders/actions/useOrderActions";

const STATUSES: OrderStatus[] = ["Paid", "Pending", "Failed", "Cancelled", "Refunded"];
const PAGE_SIZES = [10, 20, 50];

function OrdersContent() {
  const { get, getPage, set } = useUrlParams();

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusParam = get("status") as OrderStatus;
  const status = STATUSES.includes(statusParam) ? statusParam : "All";
  const query = get("q");
  const method = get("method", "All");
  const course = get("course", "All");
  const page = getPage();
  const sizeParam = Number(get("size"));
  const pageSize = PAGE_SIZES.includes(sizeParam) ? sizeParam : 10;
  const activeOrderId = get("order");

  useEffect(() => {
    const load = () => setOrders(getStoredOrders());
    const timer = setTimeout(() => {
      load();
      setIsLoading(false);
    }, 350);
    window.addEventListener(ORDERS_UPDATED_EVENT, load);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(ORDERS_UPDATED_EVENT, load);
    };
  }, []);

  const statusCounts = useMemo(
    () =>
      STATUSES.reduce(
        (acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }),
        {} as Record<OrderStatus, number>
      ),
    [orders]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim().replace(/^#/, "");
    return orders.filter(
      (o) =>
        (status === "All" || o.status === status) &&
        (method === "All" || o.paymentMethod === method) &&
        (course === "All" || o.course.id === course) &&
        (!q ||
          o.orderNumber.toLowerCase().includes(q) ||
          o.student.name.toLowerCase().includes(q) ||
          o.student.email.toLowerCase().includes(q))
    );
  }, [orders, status, method, course, query]);

  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const activeOrder = orders.find((o) => o.id === activeOrderId) ?? null;

  const openOrder = (order: OrderItem) => set({ order: order.id });
  const actions = useOrderActions({ onOpenDetails: openOrder });

  if (isLoading) return <OrdersPageSkeleton />;

  const handleExport = () => {
    const source = filtered;
    const csv = [
      "Order ID,Student,Email,Course,Amount,Payment Method,Transaction ID,Status,Date",
      ...source.map(
        (o) =>
          `${o.orderNumber},"${o.student.name}",${o.student.email},"${o.course.title}",${o.amount.toFixed(2)},${o.paymentMethod},${o.transactionId},${o.status},"${formatOrderDateTime(o.createdAt)}"`
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export downloaded", { description: `${source.length} order(s) exported to CSV.` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-5 text-left pb-8"
    >
      <OrdersHeader />
      <OrderStatsRow orders={orders} />

      <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-4">
        <PillTabs<OrderStatus | "All">
          activeId={status}
          onChange={(next) => set({ status: next, page: null })}
          tabs={[
            { id: "All", label: "All Orders", count: orders.length },
            ...STATUSES.map((s) => ({ id: s, label: s, count: statusCounts[s] })),
          ]}
        />

        <OrdersToolbar
          query={query}
          method={method}
          course={course}
          status={status}
          onQueryChange={(q) => set({ q, page: null })}
          onMethodChange={(value) => set({ method: value, page: null })}
          onCourseChange={(value) => set({ course: value, page: null })}
          onStatusChange={(value) => set({ status: value, page: null })}
          onExport={handleExport}
        />

        <OrdersTable
          orders={rows}
          activeOrderId={activeOrder?.id}
          onViewDetails={openOrder}
          getMenuItems={actions.getMenuItems}
          footer={
            <TablePagination
              currentPage={page}
              pageSize={pageSize}
              totalCount={filtered.length}
              itemLabel="orders"
              onPageChange={(next) => set({ page: next })}
              onPageSizeChange={(size) => set({ size: size === 10 ? null : size, page: null })}
              pageSizeOptions={PAGE_SIZES}
            />
          }
        />

      </div>

      <OrderDetailsDrawer order={activeOrder} actions={actions} onClose={() => set({ order: null })} />
      {actions.modals}
    </motion.div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<OrdersPageSkeleton />}>
      <OrdersContent />
    </Suspense>
  );
}
