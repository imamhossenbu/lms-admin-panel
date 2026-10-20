import React from "react";
import { Datatable, Column } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { AdminOrder } from "@/lib/types";

const MOCK_ORDERS: AdminOrder[] = [
  {
    id: "ord-1",
    orderNumber: "LMS-92810",
    user: { name: "Tanvir Ahmed", email: "tanvir@example.com" },
    courseTitle: "Fullstack Next.js & AI Mastery",
    amount: 120,
    paymentStatus: "PAID",
    createdAt: "Just now",
  },
  {
    id: "ord-2",
    orderNumber: "LMS-92809",
    user: { name: "Nusrat Jahan", email: "nusrat@example.com" },
    courseTitle: "Python Machine Learning Pro",
    amount: 95,
    paymentStatus: "PAID",
    createdAt: "12m ago",
  },
  {
    id: "ord-3",
    orderNumber: "LMS-92808",
    user: { name: "Rafiqul Islam", email: "rafiq@example.com" },
    courseTitle: "Docker & Kubernetes DevOps",
    amount: 80,
    paymentStatus: "PENDING",
    createdAt: "45m ago",
  },
  {
    id: "ord-4",
    orderNumber: "LMS-92807",
    user: { name: "Sadia Rahman", email: "sadia@example.com" },
    courseTitle: "React Native Mobile Engineering",
    amount: 110,
    paymentStatus: "PAID",
    createdAt: "1h ago",
  },
];

export function RecentOrdersTable() {
  const columns: Column<AdminOrder>[] = [
    {
      header: "Order #",
      accessorKey: "orderNumber",
      cell: (row) => <span className="font-semibold text-brand-primary">{row.orderNumber}</span>,
    },
    {
      header: "Student",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-brand-navy">{row.user.name}</span>
          <span className="body-xsm-regular text-muted">{row.user.email}</span>
        </div>
      ),
    },
    {
      header: "Course",
      accessorKey: "courseTitle",
      cell: (row) => <span className="truncate max-w-[220px] block">{row.courseTitle}</span>,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (row) => <span className="font-semibold">${row.amount}</span>,
    },
    {
      header: "Status",
      cell: (row) => (
        <ToneBadge
          tone={
            row.paymentStatus === "PAID"
              ? "success"
              : row.paymentStatus === "PENDING"
              ? "warning"
              : "danger"
          }
        >
          {row.paymentStatus}
        </ToneBadge>
      ),
    },
    {
      header: "Time",
      accessorKey: "createdAt",
      cell: (row) => <span className="body-xsm-regular text-muted">{row.createdAt}</span>,
    },
  ];

  return (
    <div className="dashboard-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="h5-medium text-brand-navy">Recent Enrollments & Orders</h3>
          <p className="body-xsm-regular text-muted">Latest payment gateway transactions</p>
        </div>
        <span className="body-xsm-medium text-brand-primary hover:underline cursor-pointer">
          View all orders
        </span>
      </div>
      <Datatable columns={columns} data={MOCK_ORDERS} />
    </div>
  );
}
