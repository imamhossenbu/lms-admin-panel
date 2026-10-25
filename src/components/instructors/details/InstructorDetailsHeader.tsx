"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, Pencil, MoreHorizontal, Trash2, Send, BookOpen, Users, Clock } from "lucide-react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Avatar } from "@/components/ui/Avatar";
import { PrimaryButton } from "@/components/ui/primary-button";
import { InstructorFullDetails } from "./instructorDetailsData";

interface InstructorDetailsHeaderProps {
  details: InstructorFullDetails;
  /** Bio and the stat strip are only shown on the Overview tab, as in the design. */
  showSummary: boolean;
  /** Overrides for sub-pages such as Add Note. */
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
  /** Edit / ••• actions; omit all three handlers to hide them. */
  onEdit?: () => void;
  onSendMessage?: () => void;
  onDelete?: () => void;
}

function ContactItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 min-w-0 body-sm-regular text-primary-400 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-primary-300 [&>svg]:shrink-0">
      {icon}
      <span className="truncate">{children}</span>
    </span>
  );
}

/** Renders children separated by short vertical dividers with even spacing on both sides. */
function DividedRow({
  children,
  dividerClassName,
  className,
}: {
  children: React.ReactNode;
  dividerClassName: string;
  className?: string;
}) {
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <div className={`flex flex-wrap items-center ${className ?? ""}`}>
      {items.map((child, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span aria-hidden className={`border-l border-dash shrink-0 ${dividerClassName}`} />}
          {child}
        </React.Fragment>
      ))}
    </div>
  );
}

function HeaderStat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 [&>svg]:w-6 [&>svg]:h-6 [&>svg]:text-primary-300 [&>svg]:shrink-0">
      {icon}
      <div>
        <p className="heading-h5 font-bold text-primary-500 leading-tight whitespace-nowrap">{value}</p>
        <p className="body-sm-regular text-primary-300">{label}</p>
      </div>
    </div>
  );
}

export function InstructorDetailsHeader({
  details,
  showSummary,
  breadcrumbs,
  backHref = "/instructors",
  backLabel = "Back to Instructors",
  onEdit,
  onSendMessage,
  onDelete,
}: InstructorDetailsHeaderProps) {
  const { instructor } = details;
  const showActions = !!(onEdit || onSendMessage || onDelete);

  return (
    <div className="space-y-4 text-left">
      <Breadcrumb
        items={
          breadcrumbs ?? [
            { label: "Instructors", href: "/instructors" },
            { label: "Instructor Details" },
          ]
        }
      />

      <div className="bg-white rounded-xl border border-dash shadow-2xs p-5 flex flex-col xl:flex-row gap-5">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 h-10 px-3.5 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 body-sm-medium transition-colors shadow-2xs w-fit shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-primary-400" />
          {backLabel}
        </Link>

        <div className="flex flex-col md:flex-row gap-5 flex-1 min-w-0">
          <Avatar
            src={instructor.avatarUrl}
            name={instructor.name}
            size={112}
            className="ring-4 ring-blue-14 shrink-0"
          />

          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2.5 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="heading-h3 font-bold text-primary-500">{instructor.name}</h1>
                  <ToneBadge tone={instructor.status === "Active" ? "green" : "red"} dot>
                    {instructor.status}
                  </ToneBadge>
                </div>

                <DividedRow className="gap-x-5 gap-y-2" dividerClassName="h-4">
                  <ContactItem icon={<Mail />}>{instructor.email}</ContactItem>
                  {instructor.phone && <ContactItem icon={<Phone />}>{instructor.phone}</ContactItem>}
                  <ContactItem icon={<Calendar />}>Joined {instructor.joinDate}</ContactItem>
                </DividedRow>
              </div>

              {showActions && (
              <div className="flex items-center gap-2.5 shrink-0">
                {onEdit && (
                  <PrimaryButton type="button" onClick={onEdit} leftIcon={<Pencil className="w-4 h-4" />}>
                    Edit Instructor
                  </PrimaryButton>
                )}
                <AppDropdownMenu
                  trigger={
                    <button
                      type="button"
                      className="w-10 h-10 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
                      title="More options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  }
                  items={[
                    {
                      key: "send-message",
                      label: "Send Message",
                      icon: <Send className="w-3.5 h-3.5 text-primary-400" />,
                      onClick: onSendMessage,
                    },
                    {
                      key: "delete-instructor",
                      label: "Delete Instructor",
                      icon: <Trash2 className="w-3.5 h-3.5" />,
                      danger: true,
                      separatorBefore: true,
                      onClick: onDelete,
                    },
                  ]}
                />
              </div>
              )}
            </div>

            {showSummary && (
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <p className="body-sm-regular text-primary-400 leading-relaxed max-w-2xl">
                  {instructor.bio || "No bio added yet."}
                </p>
                <DividedRow className="gap-x-7 gap-y-3 shrink-0 lg:pl-7 lg:border-l lg:border-dash" dividerClassName="h-10">
                  <HeaderStat icon={<BookOpen />} value={details.courses.length} label="Courses" />
                  <HeaderStat icon={<Users />} value={instructor.studentsCount.toLocaleString()} label="Students" />
                  <HeaderStat icon={<Clock />} value={details.teachingTime} label="Teaching Time" />
                </DividedRow>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorDetailsHeader;
