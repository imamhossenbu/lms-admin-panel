import React from "react";
import { SectionCard } from "@/components/ui/SectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Cpu, Zap, Database, ShieldCheck, Activity } from "lucide-react";

export function AiClusterTelemetry() {
  const telemetryNodes = [
    {
      title: "Gemini 3.8 Flash",
      subtitle: "Primary Syllabus & Evaluation Core",
      icon: Cpu,
      iconColor: "text-blue-600 bg-blue-50 border-blue-200/60",
      status: "Online • 118ms",
      badgeTone: "success" as const,
      latency: "118ms",
    },
    {
      title: "Groq LPU Acceleration",
      subtitle: "Sub-second Quiz Compilation",
      icon: Zap,
      iconColor: "text-sky-600 bg-sky-50 border-sky-200/60",
      status: "Standby • 38ms",
      badgeTone: "ice" as const,
      latency: "38ms",
    },
    {
      title: "Neon Postgres Pool",
      subtitle: "pg-pool Resilient • Zero-Stale Socket",
      icon: Database,
      iconColor: "text-indigo-600 bg-indigo-50 border-indigo-200/60",
      status: "Active (sgp1)",
      badgeTone: "success" as const,
      latency: "12ms",
    },
    {
      title: "SSLCommerz Webhook IPN",
      subtitle: "Automated Order Settlement Gateway",
      icon: ShieldCheck,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200/60",
      status: "TLS 1.3 Healthy",
      badgeTone: "success" as const,
      latency: "45ms",
    },
  ];

  return (
    <SectionCard
      title="AI Cluster & Node Telemetry"
      description="Real-time status of generative models and gateways"
      action={
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 body-xsm-medium font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          All Nodes Healthy
        </span>
      }
    >
      <div className="space-y-3 pt-1">
        {telemetryNodes.map((node, idx) => {
          const Icon = node.icon;
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-[10px] bg-[#F8F9FA] hover:bg-[#F3F4F6] border border-[#EDEDED] transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${node.iconColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="body-sm-medium text-primary-500 font-semibold block truncate">
                    {node.title}
                  </span>
                  <span className="body-xsm-regular subtext-500 truncate block">
                    {node.subtitle}
                  </span>
                </div>
              </div>
              <ToneBadge tone={node.badgeTone} size="sm" className="shrink-0 font-semibold body-xsm-medium">
                {node.status}
              </ToneBadge>
            </div>
          );
        })}

        {/* Global Cluster Summary Footer */}
        <div className="pt-2 flex items-center justify-between body-xsm-regular subtext-500 border-t border-[#F0F0F0]">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#1C4D8D]" />
            <span>Avg Global Latency: 53ms</span>
          </div>
          <span>Uptime: 99.98%</span>
        </div>
      </div>
    </SectionCard>
  );
}
