"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Copy, FileDown, Send } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { OrderItem } from "@/types/order";
import { canChangeStatus, getAllowedActions } from "@/lib/orderActions";
import { ChangeStatusLink } from "../actions/ChangeStatusLink";
import { OrderStatusBadge, PaymentMethodBadge } from "../OrderBadges";
import { formatCurrency, formatOrderDateTime } from "../orderFormat";
import { OrderTimeline } from "./OrderTimeline";

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

const SmallButton = ({ onClick, icon, children }: { onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-dash bg-white body-xsm-medium text-primary-500 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
  >
    {icon}
    {children}
  </button>
);

interface OrderDetailsContentProps {
  order: OrderItem;
  onCopyTransaction: (order: OrderItem) => void;
  onDownloadInvoice: (order: OrderItem) => void;
  onResendInvoice: (order: OrderItem) => void;
  onChangeStatus?: (order: OrderItem) => void;
}

export function OrderDetailsContent({ order, onCopyTransaction, onDownloadInvoice, onResendInvoice, onChangeStatus }: OrderDetailsContentProps) {
  const allowed = getAllowedActions(order.status);

  return (
    <div>
      <div className="px-6 py-5 border-b border-dash flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} size="lg" />
          {onChangeStatus && canChangeStatus(order, "order") && (
            <ChangeStatusLink onClick={() => onChangeStatus(order)} />
          )}
        </div>
        <div className="text-right">
          <p className="heading-h6 font-bold text-primary-500">{order.orderNumber}</p>
          <p className="body-sm-regular text-primary-300 mt-0.5">{formatOrderDateTime(order.createdAt)}</p>
        </div>
      </div>

      <Section title="Student Information">
        <div className="flex items-center gap-3">
          <Avatar src={order.student.avatarUrl} name={order.student.name} size={48} />
          <div className="flex-1 min-w-0">
            <p className="body-medium font-semibold text-primary-500 truncate">{order.student.name}</p>
            <p className="body-sm-regular text-primary-300 truncate">{order.student.email}</p>
          </div>
          <Link
            href={`/students/${order.student.id}`}
            aria-label={`Open ${order.student.name}'s profile`}
            title="Open student profile"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-primary-400 hover:text-brand-orange hover:bg-slate-100 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </Section>

      <Section title="Course Information">
        <div className="flex items-center gap-3.5">
          <span className="relative w-24 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
            <Image src={order.course.thumbnailUrl} alt="" fill unoptimized className="object-cover" />
          </span>
          <div className="min-w-0">
            <p className="body-sm-medium text-primary-500">{order.course.title}</p>
            <p className="body-xsm-regular text-primary-300 mt-1">Instructor: {order.course.instructor}</p>
          </div>
        </div>
      </Section>

      <Section
        title="Payment Information"
        action={
          allowed.includes("downloadInvoice") && (
            <div className="flex items-center gap-2">
              <SmallButton onClick={() => onDownloadInvoice(order)} icon={<FileDown className="w-3.5 h-3.5" />}>
                Invoice
              </SmallButton>
              {allowed.includes("resendInvoice") && (
                <SmallButton onClick={() => onResendInvoice(order)} icon={<Send className="w-3.5 h-3.5" />}>
                  Resend
                </SmallButton>
              )}
            </div>
          )
        }
      >
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
          <Row label="Transaction ID">
            {order.transactionId ? (
              <button
                type="button"
                onClick={() => onCopyTransaction(order)}
                title="Copy transaction ID"
                className="inline-flex items-center gap-1.5 body-sm-regular text-primary-500 hover:text-brand-orange transition-colors cursor-pointer max-w-full"
              >
                <span className="truncate">{order.transactionId}</span>
                <Copy className="w-3.5 h-3.5 shrink-0" />
              </button>
            ) : (
              <span className="body-sm-regular text-primary-300">Not paid yet</span>
            )}
          </Row>
          <Row label="Payment Date">
            <span className="body-sm-regular">{order.paidAt ? formatOrderDateTime(order.paidAt) : "—"}</span>
          </Row>
          {order.refundedAt && (
            <Row label="Refunded On">
              <span className="body-sm-regular">{formatOrderDateTime(order.refundedAt)}</span>
            </Row>
          )}
          {order.refundReason && (
            <Row label="Refund Reason">
              <span className="body-sm-regular text-purple">{order.refundReason}</span>
            </Row>
          )}
          {order.cancelReason && (
            <Row label="Cancel Reason">
              <span className="body-sm-regular text-primary-400">{order.cancelReason}</span>
            </Row>
          )}
          {order.adminNote && (
            <Row label="Admin Note">
              <span className="body-sm-regular text-primary-400">{order.adminNote}</span>
            </Row>
          )}
        </div>
      </Section>

      <Section title="Order Status">
        <OrderTimeline steps={order.timeline} />
      </Section>
    </div>
  );
}

export default OrderDetailsContent;
