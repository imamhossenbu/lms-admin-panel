"use client";

import React from "react";
import { FileText, User, Mail, Phone, ClipboardList, BookOpen } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { InstructorFormCardHeader } from "./InstructorFormCardHeader";

interface InstructorAccountSummaryCardProps {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  coursesCount: number;
}

function SummaryRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2.5 text-primary-300 shrink-0">
        {icon}
        <span className="body-sm-regular text-primary-400">{label}</span>
      </div>
      <div className="min-w-0 text-right">{children}</div>
    </div>
  );
}

const EMPTY = <span className="body-sm-regular text-primary-300">—</span>;

export function InstructorAccountSummaryCard({
  name,
  email,
  phone,
  status = "Active",
  coursesCount,
}: InstructorAccountSummaryCardProps) {
  return (
    <div className="space-y-4 text-left">
      <InstructorFormCardHeader
        icon={<FileText className="w-5 h-5" />}
        title="Account Summary"
      />

      <div className="rounded-lg border border-dash p-4 divide-y divide-dash">
        <SummaryRow icon={<User className="w-4 h-4" />} label="Instructor Name">
          {name?.trim() ? (
            <span className="body-sm-medium text-primary-500 truncate block">{name}</span>
          ) : (
            EMPTY
          )}
        </SummaryRow>

        <SummaryRow icon={<Mail className="w-4 h-4" />} label="Email">
          {email?.trim() ? (
            <span className="body-sm-regular text-primary-500 truncate block">{email}</span>
          ) : (
            EMPTY
          )}
        </SummaryRow>

        <SummaryRow icon={<Phone className="w-4 h-4" />} label="Phone">
          {phone?.trim() ? (
            <span className="body-sm-regular text-primary-500 whitespace-nowrap">{phone}</span>
          ) : (
            EMPTY
          )}
        </SummaryRow>

        <SummaryRow icon={<ClipboardList className="w-4 h-4" />} label="Status">
          <ToneBadge tone={status === "Active" ? "green" : "gray"} dot size="sm" variant="pill">
            {status}
          </ToneBadge>
        </SummaryRow>

        <SummaryRow icon={<BookOpen className="w-4 h-4" />} label="Courses to Teach">
          <ToneBadge tone="navy" size="sm">
            {coursesCount} {coursesCount === 1 ? "course" : "courses"}
          </ToneBadge>
        </SummaryRow>
      </div>
    </div>
  );
}

export default InstructorAccountSummaryCard;
