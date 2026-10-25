"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, UserRound, FileText, Copy, FileDown, ShieldCheck, RotateCcw } from "lucide-react";

import { OrderItem } from "@/types/order";
import { getStoredOrders, ORDERS_UPDATED_EVENT } from "@/lib/orderStorage";
import { getAllowedActions } from "@/lib/orderActions";
import { PAYMENT_STATUSES, PaymentRecord, PaymentStatus, toPayment } from "@/lib/paymentData";
import { useUrlParams } from "@/lib/useUrlParams";
import { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { TablePagination } from "@/components/ui/TablePagination";
import { OrdersToolbar } from "@/components/orders/OrdersToolbar";
import { OrdersPageSkeleton } from "@/components/orders/OrdersPageSkeleton";
import { useOrderActions } from "@/components/orders/actions/useOrderActions";
import { formatOrderDateTime } from "@/components/orders/orderFormat";
import { PaymentsHeader } from "@/components/payments/PaymentsHeader";
import { PaymentStatsRow } from "@/components/payments/PaymentStatsRow";
import { PaymentsTable } from "@/components/payments/PaymentsTable";
import { PaymentDetailsDrawer } from "@/components/payments/details/PaymentDetailsDrawer";

const PAGE_SIZES = [10, 20, 50];
const ICON = "w-3.5 h-3.5 text-primary-400";

function PaymentsContent() {
  const router = useRouter();
  const { get, getPage, set } = useUrlParams();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusParam = get("status") as PaymentStatus;
  const status = PAYMENT_STATUSES.includes(statusParam) ? statusParam : "All";
  const query = get("q");
  const method = get("method", "All");
  const course = get("course", "All");
  const page = getPage();
  const sizeParam = Number(get("size"));
  const pageSize = PAGE_SIZES.includes(sizeParam) ? sizeParam : 10;
  const activePaymentId = get("payment");

  // Payments are derived from orders, so order actions (refund, verify...) update both pages
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

  const payments = useMemo(
    () => orders.map(toPayment).sort((a, b) => b.date.localeCompare(a.date)),
    [orders]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return payments.filter(
      (p) =>
        (status === "All" || p.status === status) &&
        (method === "All" || p.order.paymentMethod === method) &&
        (course === "All" || p.order.course.id === course) &&
        (!q ||
          p.reference.toLowerCase().includes(q) ||
          p.order.orderNumber.toLowerCase().includes(q.replace(/^#/, "")) ||
          p.order.student.name.toLowerCase().includes(q) ||
          p.order.student.email.toLowerCase().includes(q))
    );
  }, [payments, status, method, course, query]);

  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const activePayment = payments.find((p) => p.id === activePaymentId) ?? null;

  const openPayment = (payment: PaymentRecord) => set({ payment: payment.id });
  const actions = useOrderActions({ onOpenDetails: (order) => set({ payment: order.id }) });

  if (isLoading) return <OrdersPageSkeleton statCards={6} showTabs={false} />;

  const getMenuItems = (payment: PaymentRecord): DropdownActionItem[] => {
    const { order } = payment;
    const allowed = getAllowedActions(order.status);
    const items: DropdownActionItem[] = [
      { key: "view", label: "View Details", icon: <Eye className={ICON} />, onClick: () => openPayment(payment) },
      { key: "student", label: "View Student", icon: <UserRound className={ICON} />, onClick: () => actions.viewStudent(order) },
      {
        key: "order",
        label: "View Order",
        icon: <FileText className={ICON} />,
        onClick: () => router.push(`/orders?order=${order.id}`),
      },
      {
        key: "copy",
        label: "Copy Transaction ID",
        icon: <Copy className={ICON} />,
        onClick: () => actions.copyText(payment.reference, "Transaction ID copied"),
      },
    ];
    if (allowed.includes("downloadInvoice")) {
      items.push({ key: "invoice", label: "Download Invoice", icon: <FileDown className={ICON} />, onClick: () => actions.downloadInvoice(order) });
    }
    if (allowed.includes("verify")) {
      items.push({
        key: "verify",
        label: "Verify Payment",
        icon: <ShieldCheck className={ICON} />,
        separatorBefore: true,
        disabled: actions.verifyingId === order.id,
        onClick: () => actions.verifyPayment(order),
      });
    }
    if (allowed.includes("refund")) {
      items.push({
        key: "refund",
        label: "Refund Payment",
        icon: <RotateCcw className="w-3.5 h-3.5" />,
        danger: true,
        separatorBefore: true,
        onClick: () => actions.openRefund(order),
      });
    }
    return items;
  };

  const handleExport = () => {
    const csv = [
      "Transaction ID,Order ID,Student,Email,Course,Amount,Payment Method,Status,Date",
      ...filtered.map(
        (p) =>
          `${p.reference},${p.order.orderNumber},"${p.order.student.name}",${p.order.student.email},"${p.order.course.title}",${p.order.amount.toFixed(2)},${p.order.paymentMethod},${p.status},"${formatOrderDateTime(p.date)}"`
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `payments_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export downloaded", { description: `${filtered.length} payment(s) exported to CSV.` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-5 text-left pb-8"
    >
      <PaymentsHeader />
      <PaymentStatsRow payments={payments} />

      <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 space-y-4">
        <OrdersToolbar
          query={query}
          method={method}
          course={course}
          status={status}
          searchPlaceholder="Search payments by ID, student name, email..."
          statusOptions={PAYMENT_STATUSES}
          onQueryChange={(q) => set({ q, page: null })}
          onMethodChange={(value) => set({ method: value, page: null })}
          onCourseChange={(value) => set({ course: value, page: null })}
          onStatusChange={(value) => set({ status: value, page: null })}
          onExport={handleExport}
        />

        <PaymentsTable
          payments={rows}
          activePaymentId={activePayment?.id}
          onViewDetails={openPayment}
          getMenuItems={getMenuItems}
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

      <PaymentDetailsDrawer payment={activePayment} actions={actions} onClose={() => set({ payment: null })} />
      {actions.modals}
    </motion.div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<OrdersPageSkeleton statCards={6} showTabs={false} />}>
      <PaymentsContent />
    </Suspense>
  );
}
