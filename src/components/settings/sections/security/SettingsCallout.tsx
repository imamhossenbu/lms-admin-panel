import React from "react";
import { AlertTriangle, Info, ShieldAlert, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type CalloutTone = "info" | "warning" | "danger" | "success";

const TONE: Record<CalloutTone, { box: string; icon: string; Icon: React.ElementType }> = {
  info: { box: "bg-blue-14 border-blue/30", icon: "text-blue", Icon: Info },
  warning: { box: "bg-yellow-bg border-yellow/30", icon: "text-yellow", Icon: AlertTriangle },
  danger: { box: "bg-red-14 border-red/30", icon: "text-red", Icon: ShieldAlert },
  success: { box: "bg-green-bg border-green/30", icon: "text-green", Icon: CheckCircle2 },
};

export interface SettingsCalloutProps {
  tone?: CalloutTone;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Right side (e.g. a CardActionButton). */
  action?: React.ReactNode;
  className?: string;
}

/** Tinted inline notice used inside settings cards (info / warning / danger / success). */
export function SettingsCallout({ tone = "info", title, children, action, className }: SettingsCalloutProps) {
  const t = TONE[tone];
  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border p-3.5 sm:flex-row sm:items-center", t.box, className)}>
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <t.Icon className={cn("mt-0.5 h-4.5 w-4.5 shrink-0", t.icon)} />
        <div className="min-w-0">
          {title && <p className="body-sm-medium font-semibold! text-primary-500">{title}</p>}
          {children && <div className={cn("body-xsm-regular text-primary-400", title && "mt-0.5")}>{children}</div>}
        </div>
      </div>
      {action && <div className="shrink-0 self-end sm:self-center">{action}</div>}
    </div>
  );
}

export default SettingsCallout;
