"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

import type { OrderStatus } from "@/types/order";
import { ordersApi, type OrderListQuery } from "@/lib/api/orders";
import { apiErrorMessage } from "@/lib/apiError";
import { useOrderList } from "@/lib/orders/useOrderList";
import { useCourseOptions } from "@/lib/students/useCourseOptions";
import { useUrlParams } from "@/lib/useUrlParams";
import {
  ORDER_STATUS_FILTERS,
  PAYMENT_STATUS_FILTERS,
  orderStatusView,
  paymentStatusView,
} from "@/lib/orderView";
import { TablePagination } from "@/components/ui/TablePagination";
import { ListFilters } from "@/components/ui/ListFilters";
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

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const courseOptions = useCourseOptions();

  const query = get("q");
  const orderStatus = get("status", "All");
  const paymentStatus = get("payment", "All");
  const course = get("course", "All");
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
      view: (ORDER_STATUS_FILTERS as string[]).includes(orderStatus) ? (orderStatus as OrderListQuery["view"]) : undefined,
      status: (PAYMENT_STATUS_FILTERS as string[]).includes(paymentStatus) ? (paymentStatus as OrderStatus) : undefined,
      courseId: course !== "All" ? course : undefined,
      from,
      to,
    }),
    [page, pageSize, query, orderStatus, paymentStatus, course, from, to]
  );
  const { rows, total, stats, isFetching } = useOrderList("order", listQuery);

  if (rows === null) return <OrdersPageSkeleton />;

  const isFiltered = !!query || orderStatus !== "All" || paymentStatus !== "All" || course !== "All" || !!from || !!to;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { page: _p, limit: _l, ...exportFilters } = listQuery;
  const allMatching = () => ordersApi.listAll("order", exportFilters);

  const exportCsv = async () => {
    const filtered = await allMatching().catch((err) => {
      toast.error("Couldn't export orders", { description: apiErrorMessage(err) });
      return null;
    });
    if (!filtered) return;
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

  const exportJson = async () => {
    const filtered = await allMatching().catch((err) => {
      toast.error("Couldn't export orders", { description: apiErrorMessage(err) });
      return null;
    });
    if (!filtered) return;
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
      <OrderStatsRow stats={stats} />

      <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-4">
        <ListFilters
          query={search}
          searchPlaceholder="Search orders by ID, student name, email..."
          onQueryChange={setSearch}
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
              options: [{ value: "All", label: "All Courses" }, ...(courseOptions ?? []).map((c) => ({ value: c.id, label: c.title }))],
              onChange: (value) => set({ course: value, page: null }),
              className: "xl:w-52",
            },
          ]}
          dateRange={{ from, to }}
          onDateRangeChange={(range) => set({ from: range.from ?? null, to: range.to ?? null, page: null })}
          onReset={() => {
            setSearch("");
            set({ q: null, status: null, payment: null, course: null, from: null, to: null, page: null });
          }}
          isFiltered={isFiltered}
        />

        <OrdersTable
          orders={rows}
          isLoading={isFetching && rows.length === 0}
          onViewDetails={(order) => router.push(`/orders/${order.id}`)}
          getMenuItems={(order) => actions.getMenuItems(order, "order")}
          footer={
            <TablePagination
              currentPage={page}
              pageSize={pageSize}
              totalCount={total}
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
