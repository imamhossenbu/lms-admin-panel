"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DetailCard } from "@/components/ui/DetailCard";
import { buildPaymentTimeline } from "@/lib/orderView";
import { useStoredOrder } from "@/components/commerce/useStoredOrder";
import { CommerceDetailsSkeleton } from "@/components/commerce/CommerceDetailsSkeleton";
import { CommerceNotFound } from "@/components/commerce/CommerceNotFound";
import { CommerceTimeline } from "@/components/commerce/CommerceTimeline";
import { StudentInfoCard } from "@/components/commerce/StudentInfoCard";
import { PurchasedCoursesCard } from "@/components/commerce/PurchasedCoursesCard";
import { AdditionalInfoCard } from "@/components/commerce/AdditionalInfoCard";
import { AdminNotesCard } from "@/components/commerce/AdminNotesCard";
import { useOrderActions } from "@/components/orders/actions/useOrderActions";
import { PaymentDetailsHeader } from "@/components/payments/details/PaymentDetailsHeader";
import { PaymentSummaryStrip } from "@/components/payments/details/PaymentSummaryStrip";
import { PaymentOrderInfoCard } from "@/components/payments/details/PaymentOrderInfoCard";
import { PaymentDetailsCard } from "@/components/payments/details/PaymentDetailsCard";
import { EditPaymentModal } from "@/components/payments/details/EditPaymentModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PaymentDetailsPage({ params }: PageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const actions = useOrderActions();
  const { order, studentOrderCount, isLoading } = useStoredOrder(id);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isLoading) return <CommerceDetailsSkeleton variant="payment" />;
  if (!order) return <CommerceNotFound entity="Payment" backHref="/payments" backLabel="Back to Payments" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-5 text-left pb-10"
    >
      <PaymentDetailsHeader
        order={order}
        actions={actions}
        onEditPayment={() => setIsEditOpen(true)}
        onViewOrder={() => router.push(`/orders/${order.id}`)}
      />
      <PaymentSummaryStrip order={order} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8 space-y-5">
          <StudentInfoCard student={order.student} totalOrders={studentOrderCount} />
          <PaymentOrderInfoCard order={order} />
          <PurchasedCoursesCard order={order} />
          <PaymentDetailsCard order={order} />
        </div>

        <div className="xl:col-span-4 space-y-5">
          <DetailCard title="Payment Timeline">
            <CommerceTimeline items={buildPaymentTimeline(order)} />
          </DetailCard>
          <AdditionalInfoCard order={order} onSave={actions.saveAdditionalInfo} />
          <AdminNotesCard
            notes={order.paymentNotes}
            onSave={(content, noteId) => actions.saveNote(order, "payment", content, noteId)}
            onDelete={(noteId) => actions.deleteNote(order, "payment", noteId)}
          />
        </div>
      </div>

      <EditPaymentModal order={order} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onSave={actions.editPayment} />
      {actions.modals}
    </motion.div>
  );
}
