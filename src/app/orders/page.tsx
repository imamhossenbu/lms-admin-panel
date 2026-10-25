"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { OrderItem } from "@/types/order";
import { getStoredOrders, ORDERS_UPDATED_EVENT } from "@/lib/orderStorage";
import { useUrlParams } from "@/lib/useUrlParams";
import {
  ORDER_STATUS_FILTERS,
  PAYMENT_STATUS_FILTERS,
  matchesOrderStatus,
  matchesPaymentStatus,
  orderStatusView,
  paymentStatusView,
} from "@/lib/orderView";
import { ORDER_COURSES } from "@/data/mockOrderData";
import { TablePagination } from "@/components/ui/TablePagination";
import { isInDateRange } from "@/components/ui/DateRangeFilter";
import { CommerceFilters } from "@/components/commerce/CommerceFilters";
import { downloadFile, toCsv, todayStamp } from "@/components/commerce/exportFile";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrderStatsRow } from "@/components/orders/OrderStatsRow";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { CreateOrderModal } from "@/components/orders/CreateOrderModal";
import { OrdersPageSkeleton } from "@/components/orders/OrdersPageSkeleton";
import { formatOrderDateTime } from "@/components/orders/orderFormat";
import { useOrderActions } from "@/components/orders/actions/useOrderActions";

const PAGE_SIZES = [10, 20, 50];

function OrdersContent() {
  const router = useRouter();
  const { get, getPage, set } = useUrlParams();
  const actions = useOrderActions();

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const query = get("q");
  const orderStatus = get("status", "All");
  const paymentStatus = get("payment", "All");
  const course = get("course", "All");
  const from = get("from") || undefined;
  const to = get("to") || undefined;
  const page = getPage();
  const sizeParam = Number(get("size"));
  const pageSize = PAGE_SIZES.includes(sizeParam) ? sizeParam : 10;

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

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim().replace(/^#/, "");
    return orders.filter(
      (o) =>
        matchesOrderStatus(o, orderStatus) &&
        matchesPaymentStatus(o, paymentStatus) &&
        (course === "All" || o.courses.some((c) => c.id === course)) &&
        isInDateRange(o.createdAt, { from, to }) &&
        (!q ||
          o.orderNumber.toLowerCase().includes(q) ||
          o.reference.toLowerCase().includes(q) ||
          o.student.name.toLowerCase().includes(q) ||
          o.student.email.toLowerCase().includes(q))
    );
  }, [orders, query, orderStatus, paymentStatus, course, from, to]);

  if (isLoading) return <OrdersPageSkeleton />;

  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const isFiltered = !!query || orderStatus !== "All" || paymentStatus !== "All" || course !== "All" || !!from || !!to;

  const exportCsv = () => {
    const csv = toCsv(
      ["Order ID", "Reference", "Student", "Email", "Course(s)", "Amount", "Payment Status", "Order Status", "Order Date"],
      filtered.map((o) => [
        o.orderNumber,
        o.reference,
        o.student.name,
        o.student.email,
        o.courses.map((c) => c.title).join(" + "),
        o.amount.toFixed(2),
        paymentStatusView(o.status).label,
        orderStatusView(o.status).label,
        formatOrderDateTime(o.createdAt),
      ])
    );
    downloadFile(csv, `orders_${todayStamp()}.csv`, "text/csv");
    toast.success("Export downloaded", { description: `${filtered.length} order(s) exported to CSV.` });
  };

  const exportJson = () => {
    downloadFile(JSON.stringify(filtered, null, 2), `orders_${todayStamp()}.json`, "application/json");
    toast.success("Export downloaded", { description: `${filtered.length} order(s) exported to JSON.` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-5 text-left pb-8"
    >
      <OrdersHeader onExportCsv={exportCsv} onExportJson={exportJson} onCreateOrder={() => setIsCreateOpen(true)} />
      <OrderStatsRow orders={orders} />

      <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-4">
        <CommerceFilters
          query={query}
          searchPlaceholder="Search orders by ID, student name, email..."
          onQueryChange={(q) => set({ q, page: null })}
          selects={[
            {
              key: "status",
              value: orderStatus,
              options: [{ value: "All", label: "All Status" }, ...ORDER_STATUS_FILTERS],
              onChange: (value) => set({ status: value, page: null }),
              className: "xl:w-40",
            },
            {
              key: "payment",
              value: paymentStatus,
              options: [{ value: "All", label: "All Payment Status" }, ...PAYMENT_STATUS_FILTERS],
              onChange: (value) => set({ payment: value, page: null }),
            },
            {
              key: "course",
              value: course,
              options: [{ value: "All", label: "All Courses" }, ...ORDER_COURSES.map((c) => ({ value: c.id, label: c.title }))],
              onChange: (value) => set({ course: value, page: null }),
              className: "xl:w-52",
            },
          ]}
          dateRange={{ from, to }}
          onDateRangeChange={(range) => set({ from: range.from ?? null, to: range.to ?? null, page: null })}
          onReset={() => set({ q: null, status: null, payment: null, course: null, from: null, to: null, page: null })}
          isFiltered={isFiltered}
        />

        <OrdersTable
          orders={rows}
          onViewDetails={(order) => router.push(`/orders/${order.id}`)}
          getMenuItems={(order) => actions.getMenuItems(order, "order")}
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

      <CreateOrderModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={async (input) => {
          const created = await actions.createOrder(input);
          router.push(`/orders/${created.id}`);
        }}
      />
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
