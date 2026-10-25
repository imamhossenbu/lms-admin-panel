"use client";

import React from "react";
import Image from "next/image";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { DetailCard } from "@/components/ui/DetailCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { OrderCourse, OrderItem } from "@/types/order";
import { enrollmentView } from "@/lib/orderView";
import { formatCurrency } from "@/components/orders/orderFormat";
import { OutlineLinkButton } from "./StudentInfoCard";

export function CourseThumbnail({ course, size = "md" }: { course: OrderCourse; size?: "md" | "lg" }) {
  return (
    <span className={`relative rounded-lg overflow-hidden bg-slate-100 shrink-0 ${size === "lg" ? "w-12 h-12" : "w-10 h-10"}`}>
      <Image src={course.thumbnailUrl} alt="" fill unoptimized className="object-cover" />
    </span>
  );
}

export function PurchasedCoursesCard({ order }: { order: OrderItem }) {
  const enrollment = enrollmentView(order.status);

  const columns: ColumnDef<OrderCourse>[] = [
    {
      key: "index",
      header: "#",
      width: "48px",
      align: "center",
      render: (_row, idx) => <span className="body-sm-regular text-primary-400">{idx + 1}</span>,
    },
    {
      key: "course",
      header: "Course",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-52">
          <CourseThumbnail course={row} />
          <div className="min-w-0">
            <p className="body-sm-medium text-primary-500">{row.title}</p>
            <p className="body-xsm-regular text-primary-300">{row.subtitle}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: () => (
        <span className="body-sm-regular text-primary-400 whitespace-nowrap">{order.isBundle ? "Bundle Course" : "Online Course"}</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row) => <span className="body-sm-regular text-primary-500">{formatCurrency(row.price)}</span>,
    },
    {
      key: "access",
      header: "Access",
      render: () => <span className="body-sm-regular text-primary-400 whitespace-nowrap">Lifetime Access</span>,
    },
    {
      key: "status",
      header: "Status",
      render: () => <ToneBadge tone={enrollment.tone}>{enrollment.label}</ToneBadge>,
    },
  ];

  return (
    <DetailCard
      title="Purchased Course(s)"
      action={
        <OutlineLinkButton href={`/courses?q=${encodeURIComponent(order.courses[0].title)}`}>View Course</OutlineLinkButton>
      }
    >
      <div className="rounded-lg border border-dash overflow-x-auto">
        <DataTable
          columns={columns}
          data={order.courses}
          rowKey={(row) => row.id}
          verticalBorders
          containerClassName="border-0 rounded-none"
          headerClassName="bg-slate-50 border-b border-dash"
          thClassName="px-3.5 py-3 body-xsm-medium text-primary-400 font-semibold normal-case"
          cellClassName="px-3.5 py-3"
        />
      </div>
    </DetailCard>
  );
}

export default PurchasedCoursesCard;
