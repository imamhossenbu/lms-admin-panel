import React from "react";
import { Home } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export function PaymentsHeader() {
  return (
    <div className="text-left">
      <Breadcrumb
        items={[{ label: "Home", href: "/", icon: <Home className="w-4 h-4" /> }, { label: "Payments" }]}
        className="mb-1.5"
      />
      <h1 className="heading-h3 font-bold text-primary-500 tracking-tight">Payments</h1>
      <p className="body-sm-regular text-primary-400 mt-1">
        Track all payments, manage transactions and monitor revenue.
      </p>
    </div>
  );
}

export default PaymentsHeader;
