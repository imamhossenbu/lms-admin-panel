import React from "react";
import { Check, X, RotateCcw, Ban, Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import { OrderTimelineLabel, OrderTimelineStep } from "@/types/order";
import { formatOrderDateTime } from "../orderFormat";

/** Negative / terminal steps get their own icon and colour; everything else is a green check. */
const STEP_STYLE: Partial<Record<OrderTimelineLabel, { icon: React.ReactNode; dot: string; line: string }>> = {
  "Payment Failed": { icon: <X className="w-3 h-3" />, dot: "bg-red text-white", line: "bg-red" },
  "Order Cancelled": { icon: <Ban className="w-3 h-3" />, dot: "bg-primary-300 text-white", line: "bg-slate-200" },
  "Refund Issued": { icon: <RotateCcw className="w-3 h-3" />, dot: "bg-purple text-white", line: "bg-purple" },
  "Course Access Revoked": { icon: <Lock className="w-3 h-3" />, dot: "bg-purple text-white", line: "bg-purple" },
};

export function OrderTimeline({ steps }: { steps: OrderTimelineStep[] }) {
  return (
    <ol className="relative">
      {steps.map((step, idx) => {
        const done = !!step.at;
        const custom = STEP_STYLE[step.label];
        const isLast = idx === steps.length - 1;
        return (
          <li key={`${step.label}-${idx}`} className="relative flex gap-4 pb-5 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-2.5 top-6 bottom-0 w-0.5 -translate-x-1/2",
                  done ? custom?.line ?? "bg-green" : "bg-slate-200"
                )}
              />
            )}
            <span
              className={cn(
                "relative w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                done ? custom?.dot ?? "bg-green text-white" : "bg-slate-200"
              )}
            >
              {done && (custom?.icon ?? <Check className="w-3 h-3 stroke-3" />)}
            </span>
            <div className="min-w-0">
              <p className={cn("body-sm-medium", done ? "text-primary-500" : "text-primary-300")}>
                {step.label}
                {step.by && <span className="body-xsm-regular text-primary-300"> · by {step.by}</span>}
              </p>
              <p className="body-xsm-regular text-primary-300 mt-0.5">
                {step.at ? formatOrderDateTime(step.at) : "Waiting for payment confirmation"}
              </p>
              {step.note && <p className="body-xsm-regular text-primary-400 mt-0.5">{step.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default OrderTimeline;
