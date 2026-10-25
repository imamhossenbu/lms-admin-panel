import React from "react";
import { ToneBadge, Tone } from "@/components/ui/ToneBadge";
import { PaymentStatus } from "@/lib/paymentData";

const STATUS_TONE: Record<PaymentStatus, Tone> = {
  Completed: "green",
  Pending: "orange",
  Failed: "red",
  Cancelled: "gray",
  Refunded: "purple",
};

export function PaymentStatusBadge({ status, size = "md" }: { status: PaymentStatus; size?: "sm" | "md" | "lg" }) {
  return (
    <ToneBadge tone={STATUS_TONE[status]} size={size}>
      {status}
    </ToneBadge>
  );
}

export default PaymentStatusBadge;
