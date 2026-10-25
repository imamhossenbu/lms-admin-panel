"use client";

import React from "react";
import { ChevronDown, FileSpreadsheet, FileJson, Plus } from "lucide-react";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { PrimaryButton } from "@/components/ui/primary-button";

interface OrdersHeaderProps {
  onExportCsv: () => void;
  onExportJson: () => void;
  onCreateOrder: () => void;
}

export function OrdersHeader({ onExportCsv, onExportJson, onCreateOrder }: OrdersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
      <div>
        <h1 className="heading-h3 font-bold text-primary-500 tracking-tight">Orders</h1>
        <p className="body-sm-regular text-primary-400 mt-1">View and manage all course purchases and orders.</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <AppDropdownMenu
          trigger={
            <button
              type="button"
              className="h-11 px-4 rounded-lg border border-dash bg-white body-sm-medium text-primary-500 hover:bg-slate-50 transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              Export
              <ChevronDown className="w-4 h-4" />
            </button>
          }
          items={[
            { key: "csv", label: "Export as CSV", icon: <FileSpreadsheet className="w-3.5 h-3.5 text-primary-400" />, onClick: onExportCsv },
            { key: "json", label: "Export as JSON", icon: <FileJson className="w-3.5 h-3.5 text-primary-400" />, onClick: onExportJson },
          ]}
        />
        <PrimaryButton type="button" size="lg" onClick={onCreateOrder} leftIcon={<Plus className="w-4 h-4" />}>
          Create Order
        </PrimaryButton>
      </div>
    </div>
  );
}

export default OrdersHeader;
