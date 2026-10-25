"use client";

import React from "react";
import Image from "next/image";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { Avatar } from "@/components/ui/Avatar";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { PaymentRecord } from "@/lib/paymentData";
import { PaymentMethodBadge } from "@/components/orders/OrderBadges";
import { formatCurrency, formatOrderDate, formatOrderTime } from "@/components/orders/orderFormat";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface PaymentsTableProps {
  payments: PaymentRecord[];
  activePaymentId?: string;
  onViewDetails: (payment: PaymentRecord) => void;
  getMenuItems: (payment: PaymentRecord) => DropdownActionItem[];
  /** Rendered inside the table card, under the rows (pagination). */
  footer?: React.ReactNode;
}

export function PaymentsTable({ payments, activePaymentId, onViewDetails, getMenuItems, footer }: PaymentsTableProps) {
  const columns: ColumnDef<PaymentRecord>[] = [
    {
      key: "reference",
      header: "Transaction ID",
      render: (row) => (
        <span className={`body-sm-regular whitespace-nowrap ${row.id === activePaymentId ? "text-brand-orange" : "text-primary-500"}`}>
          {row.reference}
        </span>
      ),
    },
    {
      key: "student",
      header: "Student",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-48">
          <Avatar src={row.order.student.avatarUrl} name={row.order.student.name} size={36} />
          <div className="min-w-0">
            <p className="body-sm-medium text-primary-500 truncate">{row.order.student.name}</p>
            <p className="body-xsm-regular text-primary-300 truncate">{row.order.student.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "course",
      header: "Course",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-52">
          <span className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
            <Image src={row.order.course.thumbnailUrl} alt="" fill unoptimized className="object-cover" />
          </span>
          <span className="body-sm-regular text-primary-500 line-clamp-2">{row.order.course.title}</span>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => <span className="body-sm-medium text-primary-500">{formatCurrency(row.order.amount)}</span>,
    },
    {
      key: "method",
      header: "Payment Method",
      render: (row) => <PaymentMethodBadge method={row.order.paymentMethod} />,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <PaymentStatusBadge status={row.status} />,
    },
    {
      key: "date",
      header: "Date",
      render: (row) => (
        <div className="whitespace-nowrap">
          <p className="body-sm-regular text-primary-500">{formatOrderDate(row.date)}</p>
          <p className="body-xsm-regular text-primary-300">{formatOrderTime(row.date)}</p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      width: "76px",
      render: (row) => <RowMoreMenu label={`Actions for ${row.reference}`} items={getMenuItems(row)} />,
    },
  ];

  return (
    <div className="rounded-lg border border-dash overflow-hidden">
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={payments}
          rowKey={(row) => row.id}
          onRowClick={onViewDetails}
          verticalBorders
          containerClassName="border-0 rounded-none"
          headerClassName="bg-slate-50 border-b border-dash"
          thClassName="px-3.5 py-3 body-xsm-medium text-primary-400 font-semibold normal-case"
          cellClassName="px-3.5 py-3"
          emptyMessage="No payments match your filters."
        />
      </div>
      {footer}
    </div>
  );
}

export default PaymentsTable;
