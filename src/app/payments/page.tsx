"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { PAYMENT_METHODS, type OrderItem, type OrderStatus, type PaymentMethod } from "@/types/order";
import { ordersApi, type OrderListQuery } from "@/lib/api/orders";
import { apiErrorMessage } from "@/lib/apiError";
import { useOrderList } from "@/lib/orders/useOrderList";
import { useUrlParams } from "@/lib/useUrlParams";
import {
  PAYMENT_STATUS_FILTERS,
  paymentStatusView,
  transactionCode,
  transactionHash,
} from "@/lib/orderView";
import { TablePagination } from "@/components/ui/TablePagination";
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
  const query = get("q");
  const status = get("status", "All");
  const method = get("method", "All");
  const from = get("from") || undefined;
  const to = get("to") || undefined;
  const page = getPage();
  const sizeParam = Number(get("size"));
  const pageSize = PAGE_SIZES.includes(sizeParam) ? sizeParam : 10;

  // Debounced search box → URL.
  const [search, setSearch] = useState(query);
  const setRef = useRef(set);
  useEffect(() => {
    setRef.current = set;
  }, [set]);
  useEffect(() => {
    if (search.trim() === query) return;
    const t = setTimeout(() => setRef.current({ q: search.trim(), page: null }), 300);
    return () => clearTimeout(t);
  }, [search, query]);

  const listQuery = useMemo<OrderListQuery>(
    () => ({
      page,
      limit: pageSize,
      q: query.replace(/^#/, "") || undefined,
      status: (PAYMENT_STATUS_FILTERS as string[]).includes(status) ? (status as OrderStatus) : undefined,
      method: (PAYMENT_METHODS as string[]).includes(method) ? (method as PaymentMethod) : undefined,
      from,
      to,
    }),
    [page, pageSize, query, status, method, from, to]
  );
  const { rows, total, stats, isFetching } = useOrderList("payment", listQuery);

  if (rows === null) return <OrdersPageSkeleton variant="payments" />;

  const isFiltered = !!query || status !== "All" || method !== "All" || !!from || !!to;

  const handleExport = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page: _p, limit: _l, ...filters } = listQuery;
    const filtered = await ordersApi.listAll("payment", filters).catch((err) => {
      toast.error("Couldn't export payments", { description: apiErrorMessage(err) });
      return null;
    });
    if (!filtered) return;
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
      <PaymentStatsRow stats={stats} />

      <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-4">
        <ListFilters
          query={search}
          searchPlaceholder="Search by transaction ID, student name, order ID..."
          onQueryChange={setSearch}
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
          onReset={() => {
            setSearch("");
            set({ q: null, status: null, method: null, from: null, to: null, page: null });
          }}
          isFiltered={isFiltered}
        />

        <PaymentsTable
          orders={rows}
          isLoading={isFetching && rows.length === 0}
          onViewDetails={(order) => router.push(`/payments/${order.id}`)}
          getMenuItems={(order) => actions.getMenuItems(order, "payment")}
          footer={
            <TablePagination
              currentPage={page}
              pageSize={pageSize}
              totalCount={total}
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
