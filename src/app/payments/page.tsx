"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { OrderItem } from "@/types/order";
import { getStoredOrders, ORDERS_UPDATED_EVENT } from "@/lib/orderStorage";
import { useUrlParams } from "@/lib/useUrlParams";
import {
  PAYMENT_STATUS_FILTERS,
  matchesPaymentStatus,
  paymentStatusView,
  transactionCode,
  transactionHash,
} from "@/lib/orderView";
import { PAYMENT_METHODS } from "@/data/mockOrderData";
import { TablePagination } from "@/components/ui/TablePagination";
import { isInDateRange } from "@/components/ui/DateRangeFilter";
import { ListFilters } from "@/components/ui/ListFilters";
import { downloadFile, toCsv, todayStamp } from "@/components/commerce/exportFile";
import { OrdersPageSkeleton } from "@/components/orders/OrdersPageSkeleton";
import { formatOrderDateTime } from "@/components/orders/orderFormat";
import { useOrderActions } from "@/components/orders/actions/useOrderActions";
import { PaymentsHeader } from "@/components/payments/PaymentsHeader";
import { PaymentStatsRow } from "@/components/payments/PaymentStatsRow";
import { PaymentsTable } from "@/components/payments/PaymentsTable";

const PAGE_SIZES = [10, 20, 50];
const paymentDate = (o: OrderItem) => o.paidAt ?? o.createdAt;

function PaymentsContent() {
  const router = useRouter();
  const { get, getPage, set } = useUrlParams();
  const actions = useOrderActions();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const query = get("q");
  const status = get("status", "All");
  const method = get("method", "All");
  const from = get("from") || undefined;
  const to = get("to") || undefined;
  const page = getPage();
  const sizeParam = Number(get("size"));
  const pageSize = PAGE_SIZES.includes(sizeParam) ? sizeParam : 10;

  // Payments are derived from orders, so status changes stay in sync across both pages
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
    return orders
      .filter(
        (o) =>
          matchesPaymentStatus(o, status) &&
          (method === "All" || o.paymentMethod === method) &&
          isInDateRange(paymentDate(o), { from, to }) &&
          (!q ||
            transactionCode(o).toLowerCase().includes(q) ||
            transactionHash(o).includes(q) ||
            o.transactionId.toLowerCase().includes(q) ||
            o.orderNumber.toLowerCase().includes(q) ||
            o.student.name.toLowerCase().includes(q) ||
            o.student.email.toLowerCase().includes(q))
      )
      .sort((a, b) => paymentDate(b).localeCompare(paymentDate(a)));
  }, [orders, query, status, method, from, to]);

  if (isLoading) return <OrdersPageSkeleton variant="payments" />;

  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const isFiltered = !!query || status !== "All" || method !== "All" || !!from || !!to;

  const handleExport = () => {
    const csv = toCsv(
      ["Transaction ID", "Gateway Ref", "Order ID", "Student", "Email", "Course(s)", "Method", "Amount", "Status", "Payment Date"],
      filtered.map((o) => [
        transactionCode(o),
        o.transactionId || transactionHash(o),
        o.orderNumber,
        o.student.name,
        o.student.email,
        o.courses.map((c) => c.title).join(" + "),
        o.paymentMethod,
        o.amount.toFixed(2),
        paymentStatusView(o.status).label,
        formatOrderDateTime(paymentDate(o)),
      ])
    );
    downloadFile(csv, `payments_${todayStamp()}.csv`, "text/csv");
    toast.success("Export downloaded", { description: `${filtered.length} payment(s) exported to CSV.` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-5 text-left pb-8"
    >
      <PaymentsHeader onExport={handleExport} />
      <PaymentStatsRow orders={orders} />

      <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-4">
        <ListFilters
          query={query}
          searchPlaceholder="Search by transaction ID, student name, order ID..."
          onQueryChange={(q) => set({ q, page: null })}
          selects={[
            {
              key: "status",
              value: status,
              options: [{ value: "All", label: "All Status" }, ...PAYMENT_STATUS_FILTERS],
              onChange: (value) => set({ status: value, page: null }),
            },
            {
              key: "method",
              value: method,
              options: [{ value: "All", label: "All Methods" }, ...PAYMENT_METHODS],
              onChange: (value) => set({ method: value, page: null }),
            },
          ]}
          dateRange={{ from, to }}
          onDateRangeChange={(range) => set({ from: range.from ?? null, to: range.to ?? null, page: null })}
          onReset={() => set({ q: null, status: null, method: null, from: null, to: null, page: null })}
          isFiltered={isFiltered}
        />

        <PaymentsTable
          orders={rows}
          onViewDetails={(order) => router.push(`/payments/${order.id}`)}
          getMenuItems={(order) => actions.getMenuItems(order, "payment")}
          footer={
            <TablePagination
              currentPage={page}
              pageSize={pageSize}
              totalCount={filtered.length}
              itemLabel="payments"
              onPageChange={(next) => set({ page: next })}
              onPageSizeChange={(size) => set({ size: size === 10 ? null : size, page: null })}
              pageSizeOptions={PAGE_SIZES}
            />
          }
        />
      </div>

      {actions.modals}
    </motion.div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<OrdersPageSkeleton variant="payments" />}>
      <PaymentsContent />
    </Suspense>
  );
}
