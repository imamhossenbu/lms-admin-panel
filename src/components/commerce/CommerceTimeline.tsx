import React from "react";
import { cn } from "@/lib/cn";
import { CommerceTimelineItem, TimelineTone } from "@/lib/orderView";
import { formatOrderDate, formatOrderTime } from "@/components/orders/orderFormat";

const DOT: Record<TimelineTone, string> = {
  green: "bg-green",
  blue: "bg-blue",
  purple: "bg-purple",
  orange: "bg-brand-orange",
  gray: "bg-primary-300",
  red: "bg-red",
};

/** Vertical timeline with coloured dots and the date/time on the right (Order / Payment Timeline). */
export function CommerceTimeline({ items }: { items: CommerceTimelineItem[] }) {
  return (
    <ol className="relative">
      {items.map((item, idx) => {
        const done = !!item.at;
        const isLast = idx === items.length - 1;
        return (
          <li key={item.id} className="relative flex gap-4 pb-5 last:pb-0">
            {!isLast && <span aria-hidden className="absolute left-1.5 top-5 bottom-0 w-px bg-dash" />}
            <span
              className={cn(
                "relative w-3 h-3 rounded-full shrink-0 mt-1.5 ring-4 ring-white",
                done ? DOT[item.tone] : "bg-slate-200"
              )}
            />
            <div className="flex-1 min-w-0">
              <p className={cn("body-sm-medium", done ? "text-primary-500" : "text-primary-300")}>{item.title}</p>
              {item.description && (
                <p className={cn("body-xsm-regular mt-0.5", done ? "text-primary-400" : "text-primary-300")}>
                  {item.description}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              {done ? (
                <>
                  <p className="body-xsm-regular text-primary-400 whitespace-nowrap">{formatOrderDate(item.at!)}</p>
                  <p className="body-xsm-regular text-primary-300 whitespace-nowrap">{formatOrderTime(item.at!)}</p>
                </>
              ) : (
                <p className="body-xsm-regular text-primary-300 whitespace-nowrap">Pending</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default CommerceTimeline;
