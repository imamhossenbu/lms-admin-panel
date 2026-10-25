import React from "react";
import { Download } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";

export function PaymentsHeader({ onExport }: { onExport: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
      <div>
        <Breadcrumb items={[{ label: "Commerce", href: "/orders" }, { label: "Payments" }]} className="mb-1.5" />
        <h1 className="heading-h3 font-bold text-primary-500 tracking-tight">Payments</h1>
        <p className="body-sm-regular text-primary-400 mt-1">Track and manage all payment transactions.</p>
      </div>
      <PrimaryButton type="button" size="lg" onClick={onExport} leftIcon={<Download className="w-4 h-4" />}>
        Export
      </PrimaryButton>
    </div>
  );
}

export default PaymentsHeader;
