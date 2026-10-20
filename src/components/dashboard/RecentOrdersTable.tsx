"use client";

import React from "react";
import Link from "next/link";
import { Datatable, Column } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Avatar } from "@/components/ui/Avatar";
import { AdminOrder } from "@/lib/types";
import { ArrowRight, Receipt, CreditCard } from "lucide-react";

interface RecentOrdersTableProps {
  orders?: AdminOrder[];
}

const MOCK_ORDERS: AdminOrder[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-92810",
    user: { name: "Tanvir Ahmed", email: "tanvir@example.com" },
    courseTitle: "Fullstack Next.js 16 & AI Mastery",
    amount: 120,
    paymentStatus: "PAID",
    createdAt: "Just now",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-92809",
    user: { name: "Nusrat Jahan", email: "nusrat@example.com" },
    courseTitle: "Python Machine Learning Pro with PyTorch",
    amount: 95,
    paymentStatus: "PAID",
    createdAt: "12m ago",
  },
  {
    id: "ord-3",
    orderNumber: "ORD-92808",
    user: { name: "Rafiqul Islam", email: "rafiq@example.com" },
    courseTitle: "Docker & Kubernetes DevOps Architecture",
    amount: 80,
    paymentStatus: "PENDING",
    createdAt: "45m ago",
  },
  {
    id: "ord-4",
    orderNumber: "ORD-92807",
    user: { name: "Sadia Rahman", email: "sadia@example.com" },
    courseTitle: "React Native Mobile Engineering & Expo",
    amount: 110,
    paymentStatus: "PAID",
    createdAt: "1h ago",
  },
  {
    id: "ord-5",
    orderNumber: "ORD-92806",
    user: { name: "Arif Hossain", email: "arif@example.com" },
    courseTitle: "Advanced NestJS Microservices Architecture",
    amount: 135,
    paymentStatus: "PAID",
    createdAt: "2h ago",
  },
];

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const displayOrders = orders && orders.length > 0 ? orders : MOCK_ORDERS;

  const columns: Column<AdminOrder>[] = [
    {
      header: "Order ID",
      accessorKey: "orderNumber",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[6px] bg-[#EBF4FC] border border-[#BDE8F5]/60 flex items-center justify-center text-[#1C4D8D] shrink-0">
            <Receipt className="w-3.5 h-3.5" />
          </div>
          <span className="body-xsm-medium text-[#1C4D8D] font-mono font-bold">
            {row.orderNumber}
          </span>
        </div>
      ),
    },
    {
      header: "Student / Learner",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.user.name} size="sm" />
          <div className="flex flex-col text-left">
            <span className="body-sm-medium text-primary-500 font-semibold leading-tight">
              {row.user.name}
            </span>
            <span className="body-xsm-regular subtext-500">
              {row.user.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Course Enrolled",
      accessorKey: "courseTitle",
      cell: (row) => (
        <span className="body-sm-regular text-primary-500 truncate max-w-[240px] block">
          {row.courseTitle}
        </span>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (row) => (
        <span className="body-sm-medium text-primary-500 font-bold">
          ${row.amount}
        </span>
      ),
    },
    {
      header: "Gateway Status",
      cell: (row) => {
        const isPaid = row.paymentStatus === "PAID";
        const isPending = row.paymentStatus === "PENDING";
        return (
          <ToneBadge
            tone={isPaid ? "success" : isPending ? "warning" : "danger"}
            size="sm"
            className="body-xsm-medium font-bold uppercase tracking-wider"
          >
            {isPaid ? "Paid & Enrolled" : isPending ? "Payment Pending" : "Failed"}
          </ToneBadge>
        );
      },
    },
    {
      header: "Timestamp",
      accessorKey: "createdAt",
      cell: (row) => (
        <span className="body-xsm-regular subtext-500">
          {row.createdAt}
        </span>
      ),
    },
  ];

  return (
    <div className="rounded-[12px] bg-white border border-[#EDEDED] p-6 text-left" style={{ boxShadow: "0px 1px 2px 0px rgba(13, 13, 18, 0.05)" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#F0F0F0]">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#1C4D8D]" />
            <h3 className="body-medium text-primary-500 font-semibold">
              Recent Institutional Enrollments & Orders
            </h3>
          </div>
          <p className="body-sm-regular subtext-500 mt-0.5">
            Real-time payment gateway transactions and active course access provisions
          </p>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 body-sm-medium text-[#1C4D8D] hover:underline transition-colors cursor-pointer group shrink-0"
        >
          <span>View all transactions</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <Datatable columns={columns} data={displayOrders} />
    </div>
  );
}
