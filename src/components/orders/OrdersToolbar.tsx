"use client";

import React from "react";
import { Search, Download } from "lucide-react";
import { AppSelect } from "@/components/ui/AppSelect";
import { ORDER_COURSES, PAYMENT_METHODS } from "@/data/mockOrderData";

interface OrdersToolbarProps {
  query: string;
  method: string;
  course: string;
  status: string;
  onQueryChange: (value: string) => void;
  onMethodChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onExport: () => void;
}

export function OrdersToolbar({
  query,
  method,
  course,
  status,
  onQueryChange,
  onMethodChange,
  onCourseChange,
  onStatusChange,
  onExport,
}: OrdersToolbarProps) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center gap-3">
      <div className="relative flex-1 min-w-0">
        <Search className="w-4 h-4 text-primary-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search orders by ID, student name or email..."
          className="w-full h-10 pl-10 pr-3.5 rounded-lg border border-dash bg-white body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-brand-orange transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 xl:flex items-center gap-3">
        <AppSelect
          value={method}
          onValueChange={onMethodChange}
          options={[{ value: "All", label: "All Payment Methods" }, ...PAYMENT_METHODS]}
          className="w-full xl:w-48"
          triggerClassName="w-full bg-white"
        />
        <AppSelect
          value={course}
          onValueChange={onCourseChange}
          options={[{ value: "All", label: "All Courses" }, ...ORDER_COURSES.map((c) => ({ value: c.id, label: c.title }))]}
          className="w-full xl:w-44"
          triggerClassName="w-full bg-white"
        />
        <AppSelect
          value={status}
          onValueChange={onStatusChange}
          options={[{ value: "All", label: "All Status" }, "Paid", "Pending", "Failed", "Cancelled", "Refunded"]}
          className="w-full xl:w-40"
          triggerClassName="w-full bg-white"
        />
      </div>

      <button
        type="button"
        onClick={onExport}
        className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-dash bg-white body-sm-medium text-primary-500 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        <Download className="w-4 h-4" />
        Export
      </button>
    </div>
  );
}

export default OrdersToolbar;
