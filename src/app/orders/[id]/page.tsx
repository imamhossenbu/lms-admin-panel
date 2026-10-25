"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DetailCard } from "@/components/ui/DetailCard";
import { buildOrderTimeline } from "@/lib/orderView";
import { useStoredOrder } from "@/components/commerce/useStoredOrder";
import { CommerceDetailsSkeleton } from "@/components/commerce/CommerceDetailsSkeleton";
import { CommerceNotFound } from "@/components/commerce/CommerceNotFound";
import { CommerceTimeline } from "@/components/commerce/CommerceTimeline";
import { StudentInfoCard } from "@/components/commerce/StudentInfoCard";
import { PurchasedCoursesCard } from "@/components/commerce/PurchasedCoursesCard";
import { AmountBreakdown } from "@/components/commerce/AmountBreakdown";
import { AdditionalInfoCard } from "@/components/commerce/AdditionalInfoCard";
import { AdminNotesCard } from "@/components/commerce/AdminNotesCard";
import { OrderDetailsHeader } from "@/components/orders/details/OrderDetailsHeader";
import { OrderSummaryStrip } from "@/components/orders/details/OrderSummaryStrip";
import { OrderPaymentInfoCard } from "@/components/orders/details/OrderPaymentInfoCard";
import { useOrderActions } from "@/components/orders/actions/useOrderActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: PageProps) {
  const { id } = React.use(params);
  const router = useRouter();
  const actions = useOrderActions();
  const { order, studentOrderCount, isLoading } = useStoredOrder(id);
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  if (isLoading) return <CommerceDetailsSkeleton variant="order" />;
  if (!order) return <CommerceNotFound entity="Order" backHref="/orders" backLabel="Back to Orders" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-5 text-left pb-10"
    >
      <OrderDetailsHeader
        order={order}
        actions={actions}
        onEditOrder={() => setIsEditingInfo(true)}
        onViewTransaction={() => router.push(`/payments/${order.id}`)}
      />
      <OrderSummaryStrip order={order} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8 space-y-5">
          <PurchasedCoursesCard order={order} />
          <StudentInfoCard student={order.student} totalOrders={studentOrderCount} />
          <OrderPaymentInfoCard order={order} />
          <DetailCard title="Order Summary">
            <AmountBreakdown order={order} />
          </DetailCard>
        </div>

        <div className="xl:col-span-4 space-y-5">
          <DetailCard title="Order Timeline">
            <CommerceTimeline items={buildOrderTimeline(order)} />
          </DetailCard>
          <AdditionalInfoCard
            order={order}
            onSave={actions.saveAdditionalInfo}
            isEditing={isEditingInfo}
            onEditingChange={setIsEditingInfo}
          />
          <AdminNotesCard
            notes={order.adminNotes}
            onSave={(content, noteId) => actions.saveNote(order, "order", content, noteId)}
            onDelete={(noteId) => actions.deleteNote(order, "order", noteId)}
          />
        </div>
      </div>

      {actions.modals}
    </motion.div>
  );
}
