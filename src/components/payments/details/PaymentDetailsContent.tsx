"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, ExternalLink, Download } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { canChangeStatus, getAllowedActions } from "@/lib/orderActions";
import { PaymentRecord, buildPaymentTimeline, invoiceNumber } from "@/lib/paymentData";
import { PaymentMethodBadge } from "@/components/orders/OrderBadges";
import { OrderTimeline } from "@/components/orders/details/OrderTimeline";
import { ChangeStatusLink } from "@/components/orders/actions/ChangeStatusLink";
import { formatCurrency, formatOrderDateTime } from "@/components/orders/orderFormat";
import { PaymentStatusBadge } from "../PaymentStatusBadge";

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="px-6 py-5 border-b border-dash last:border-b-0 space-y-3.5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="title-medium font-bold text-primary-500">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="body-sm-regular text-primary-400 shrink-0">{label}</span>
      <div className="body-sm-medium text-primary-500 text-right min-w-0">{children}</div>
    </div>
  );
}

interface PaymentDetailsContentProps {
  payment: PaymentRecord;
  onCopyReference: (payment: PaymentRecord) => void;
  onDownloadInvoice: (payment: PaymentRecord) => void;
  onChangeStatus?: (payment: PaymentRecord) => void;
}

export function PaymentDetailsContent({ payment, onCopyReference, onDownloadInvoice, onChangeStatus }: PaymentDetailsContentProps) {
  const { order } = payment;
  const hasInvoice = getAllowedActions(order.status).includes("downloadInvoice");

  return (
    <div>
      {/* Status, amount and transaction */}
      <div className="px-6 py-5 border-b border-dash space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PaymentStatusBadge status={payment.status} size="lg" />
            {onChangeStatus && canChangeStatus(order, "payment") && (
              <ChangeStatusLink onClick={() => onChangeStatus(payment)} />
            )}
          </div>
          <span className="body-sm-regular text-primary-300">{formatOrderDateTime(payment.date)}</span>
        </div>
        <p className="heading-h2-bold text-primary-500">{formatCurrency(order.amount)}</p>
        <button
          type="button"
          onClick={() => onCopyReference(payment)}
          title="Copy transaction ID"
          className="inline-flex items-center gap-2 body-sm-regular text-primary-400 hover:text-brand-orange transition-colors cursor-pointer"
        >
          {order.transactionId ? "Transaction ID" : "Session ID"}: {payment.reference}
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <Section
        title="Student Information"
        action={
          <Link href={`/students/${order.student.id}`} className="body-sm-medium text-blue hover:underline">
            View Profile
          </Link>
        }
      >
        <div className="flex items-center gap-3">
          <Avatar src={order.student.avatarUrl} name={order.student.name} size={48} />
          <div className="min-w-0">
            <p className="body-medium font-semibold text-primary-500 truncate">{order.student.name}</p>
            <p className="body-sm-regular text-primary-300 truncate">{order.student.email}</p>
          </div>
        </div>
      </Section>

      <Section title="Course Information">
        <div className="flex items-center gap-3.5">
          <span className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
            <Image src={order.course.thumbnailUrl} alt="" fill unoptimized className="object-cover" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="body-sm-medium text-primary-500">{order.course.title}</p>
            <p className="body-xsm-regular text-primary-300 mt-1">Instructor: {order.course.instructor}</p>
          </div>
          <Link
            href={`/courses?q=${encodeURIComponent(order.course.title)}`}
            aria-label={`Open ${order.course.title}`}
            title="Open course"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-primary-400 hover:text-brand-orange hover:bg-slate-100 transition-colors shrink-0"
          >
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </Section>

      <Section title="Payment Information">
        <div className="space-y-3">
          <Row label="Amount">{formatCurrency(order.amount)}</Row>
          <Row label="Payment Method">
            <span className="inline-flex items-center gap-2">
              <PaymentMethodBadge method={order.paymentMethod} />
              {order.manuallyPaid && (
                <ToneBadge tone="yellow" size="sm">
                  Manual
                </ToneBadge>
              )}
            </span>
          </Row>
          <Row label="Payment Date">
            <span className="body-sm-regular">{order.paidAt ? formatOrderDateTime(order.paidAt) : "—"}</span>
          </Row>
          <Row label="Payment Status">
            <PaymentStatusBadge status={payment.status} size="sm" />
          </Row>
          <Row label="Order">
            <Link href={`/orders?order=${order.id}`} className="body-sm-regular text-blue hover:underline">
              {order.orderNumber}
            </Link>
          </Row>
          <Row label="Invoice">
            {hasInvoice ? (
              <button
                type="button"
                onClick={() => onDownloadInvoice(payment)}
                title="Download invoice"
                className="inline-flex items-center gap-2 body-sm-regular text-primary-500 hover:text-brand-orange transition-colors cursor-pointer"
              >
                {invoiceNumber(order)}
                <Download className="w-4 h-4" />
              </button>
            ) : (
              <span className="body-sm-regular text-primary-300">Not issued</span>
            )}
          </Row>
        </div>
      </Section>

      <Section title="Timeline">
        <OrderTimeline steps={buildPaymentTimeline(order)} />
      </Section>
    </div>
  );
}

export default PaymentDetailsContent;
