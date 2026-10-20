import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { QuickActionGrid } from "@/components/dashboard/QuickActionGrid";
import { SectionCard } from "@/components/ui/SectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Cpu, ShieldCheck, Zap } from "lucide-react";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Control Center"
        description="Comprehensive monitoring of active courses, student registrations, and financial telemetry."
        badge={<ToneBadge tone="primary">System v2.4 Live</ToneBadge>}
      />

      <OverviewStats />

      <QuickActionGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="space-y-4">
          <SectionCard title="AI Cluster Telemetry" description="Active AI models status">
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-dash">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-brand-primary" />
                  <span className="body-sm-medium">Gemini 3.8 Flash</span>
                </div>
                <ToneBadge tone="success" size="sm">Primary Online</ToneBadge>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-dash">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-accent" />
                  <span className="body-sm-medium">Groq Multi-Model</span>
                </div>
                <ToneBadge tone="ice" size="sm">Standby Fallback</ToneBadge>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-dash">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="body-sm-medium">SSLCommerz IPN</span>
                </div>
                <ToneBadge tone="success" size="sm">Healthy</ToneBadge>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <RecentOrdersTable />
    </div>
  );
}
