import React from "react";
import { Home } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export function OrdersHeader() {
  return (
    <div className="text-left">
      <Breadcrumb
        items={[{ label: "Home", href: "/", icon: <Home className="w-4 h-4" /> }, { label: "Orders" }]}
        className="mb-1.5"
      />
      <h1 className="heading-h3 font-bold text-primary-500 tracking-tight">Orders</h1>
      <p className="body-sm-regular text-primary-400 mt-1">
        Manage course purchases, view payment status and track revenue.
      </p>
    </div>
  );
}

export default OrdersHeader;
