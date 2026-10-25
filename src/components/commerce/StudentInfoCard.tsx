"use client";

import React from "react";
import Link from "next/link";
import { BadgeInfo, CalendarDays, BookOpen, ReceiptText } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { DetailCard } from "@/components/ui/DetailCard";
import { OrderStudent } from "@/types/order";

interface StudentInfoCardProps {
  student: OrderStudent;
  totalOrders: number;
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-primary-300 [&>svg]:w-4 [&>svg]:h-4 shrink-0">{icon}</span>
      <span className="body-sm-regular text-primary-400 w-28 shrink-0">{label}</span>
      <span className="body-sm-medium text-primary-500 truncate">{value}</span>
    </div>
  );
}

export const OutlineLinkButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="h-9 px-4 rounded-lg border border-dash bg-white body-sm-medium text-blue hover:bg-blue-14 transition-colors inline-flex items-center whitespace-nowrap"
  >
    {children}
  </Link>
);

export function StudentInfoCard({ student, totalOrders }: StudentInfoCardProps) {
  return (
    <DetailCard title="Student Information" action={<OutlineLinkButton href={`/students/${student.id}`}>View Student</OutlineLinkButton>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:divide-x md:divide-dash">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar src={student.avatarUrl} name={student.name} size={88} />
          <div className="min-w-0 space-y-1">
            <p className="title-medium font-bold text-primary-500 truncate">{student.name}</p>
            <a href={`mailto:${student.email}`} className="block body-sm-regular text-primary-400 hover:text-blue truncate">
              {student.email}
            </a>
            {student.phone && <p className="body-sm-regular text-primary-400">{student.phone}</p>}
          </div>
        </div>
        <div className="space-y-2.5 md:pl-6">
          <Fact icon={<BadgeInfo />} label="Student ID" value={student.code} />
          <Fact icon={<CalendarDays />} label="Joined" value={student.joinedAt ?? "—"} />
          <Fact icon={<BookOpen />} label="Total Courses" value={student.totalCourses ?? "—"} />
          <Fact icon={<ReceiptText />} label="Total Orders" value={totalOrders} />
        </div>
      </div>
    </DetailCard>
  );
}

export default StudentInfoCard;
