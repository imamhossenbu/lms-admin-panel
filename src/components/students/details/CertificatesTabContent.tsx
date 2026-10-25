"use client";

import React, { useState, useMemo } from "react";
import {
  Award,
  Search,
  CheckCircle2,
  MinusCircle,
  MoreHorizontal,
  Eye,
  Download,
  Share2,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { AppSelect } from "@/components/ui/AppSelect";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CertificateThumbnail } from "./CertificateThumbnail";
import { StudentCertificateItem } from "./mockStudentDetails";
import toast from "react-hot-toast";

interface CertificatesTabContentProps {
  certificates: StudentCertificateItem[];
}

export function CertificatesTabContent({
  certificates: initialCertificates,
}: CertificatesTabContentProps) {
  const [certificates] =
    useState<StudentCertificateItem[]>(initialCertificates);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");

  const filteredCertificates = useMemo(() => {
    return certificates.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.certificateId.toLowerCase().includes(q) ||
        item.course.toLowerCase().includes(q);

      const matchesCourse =
        courseFilter === "All Courses" || item.course === courseFilter;

      return matchesSearch && matchesCourse;
    });
  }, [certificates, searchQuery, courseFilter]);

  const columns: ColumnDef<StudentCertificateItem>[] = [
    {
      key: "number",
      header: "#",
      width: "48px",
      align: "center",
      render: (row) => (
        <span className="body-xsm-medium text-primary-300">
          {row.orderNumber}
        </span>
      ),
    },
    {
      key: "certificate",
      header: "Certificate",
      render: (row) => (
        <div className="flex items-center gap-3">
          <CertificateThumbnail
            accentColor={row.accentColor}
            isEarned={row.status === "Issued"}
          />
          <div>
            <h4 className="body-sm-medium font-semibold text-primary-500 whitespace-nowrap">
              {row.title}
            </h4>
            <span className="body-2xsm-regular text-primary-300 whitespace-nowrap">
              {row.subtitle}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "course",
      header: "Course",
      render: (row) => (
        <span className="body-sm-regular text-primary-400 whitespace-nowrap">
          {row.course}
        </span>
      ),
    },
    {
      key: "issuedOn",
      header: "Issued On",
      render: (row) => (
        <span className="body-sm-regular text-primary-400 whitespace-nowrap">
          {row.issuedOn}
        </span>
      ),
    },
    {
      key: "certificateId",
      header: "Certificate ID",
      render: (row) => (
        <span className="body-sm-medium text-primary-400 font-mono tracking-tight whitespace-nowrap">
          {row.certificateId}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        if (row.status === "Issued") {
          return (
            <ToneBadge
              tone="green"
              variant="pill"
              size="md"
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              className="whitespace-nowrap shrink-0"
            >
              Issued
            </ToneBadge>
          );
        }

        return (
          <ToneBadge
            tone="navy"
            variant="pill"
            size="md"
            icon={<MinusCircle className="w-3.5 h-3.5" />}
            className="whitespace-nowrap shrink-0"
          >
            Not Earned
          </ToneBadge>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      width: "120px",
      render: (row) => {
        const isIssued = row.status === "Issued";

        return (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={!isIssued}
              onClick={() => {
                if (isIssued) {
                  toast(`Viewing certificate ${row.certificateId}`, {
                    icon: "🎓",
                  });
                }
              }}
              className={`body-sm-medium font-semibold px-1.5 py-1 ${
                isIssued
                  ? "text-blue hover:underline cursor-pointer"
                  : "text-primary-300 cursor-not-allowed"
              }`}
            >
              View
            </button>

            <AppDropdownMenu
              trigger={
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg border border-dash bg-white text-primary-400 hover:text-primary-500 hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
                  title="More actions"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              }
              items={
                isIssued
                  ? [
                      {
                        key: "view-cert",
                        label: "View Certificate",
                        icon: <Eye className="w-3.5 h-3.5 text-primary-400" />,
                        onClick: () =>
                          toast(`Opening certificate ${row.certificateId}`),
                      },
                      {
                        key: "download-pdf",
                        label: "Download PDF",
                        icon: (
                          <Download className="w-3.5 h-3.5 text-primary-400" />
                        ),
                        onClick: () =>
                          toast.success(
                            `Downloading PDF for ${row.certificateId}`
                          ),
                      },
                      {
                        key: "share-credential",
                        label: "Share Credential",
                        icon: (
                          <Share2 className="w-3.5 h-3.5 text-primary-400" />
                        ),
                        onClick: () =>
                          toast.success("Credential link copied to clipboard!"),
                      },
                    ]
                  : [
                      {
                        key: "issue-manually",
                        label: "Issue Manually",
                        icon: (
                          <FileCheck2 className="w-3.5 h-3.5 text-primary-400" />
                        ),
                        onClick: () =>
                          toast.success(
                            `Certificate manually issued for ${row.title}`
                          ),
                      },
                    ]
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs text-left">
      {/* Header and Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Title with Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="title-medium font-bold text-primary-500">
              Certificates
            </h2>
            <p className="body-sm-regular text-primary-300">
              Certificates earned by this student after completing courses.
            </p>
          </div>
        </div>

        {/* Right Toolbar: Search + All Courses */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <div className="relative w-48 sm:w-60">
            <Search className="w-4 h-4 text-primary-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certificates..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-dash bg-[#F8FAFC] body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>

          <AppSelect
            value={courseFilter}
            onValueChange={setCourseFilter}
            options={[
              "All Courses",
              "HTML Fundamentals",
              "CSS & Responsive Design",
              "JavaScript Essentials",
              "React for Beginners",
            ]}
          />
        </div>
      </div>

      {/* DataTable with Column-wise Borders */}
      <div className="rounded-lg border border-dash overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredCertificates}
          verticalBorders={true}
          tableClassName="border-collapse"
        />
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between pt-2">
        <span className="body-sm-regular text-primary-300">
          Showing {filteredCertificates.length} of {certificates.length}{" "}
          certificates
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="w-8 h-8 rounded-lg border border-dash bg-white text-primary-300 flex items-center justify-center body-sm-medium disabled:opacity-50 cursor-not-allowed hover:bg-slate-50 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-blue text-white flex items-center justify-center body-sm-medium font-bold shadow-2xs"
          >
            1
          </button>
          <button
            type="button"
            disabled
            className="w-8 h-8 rounded-lg border border-dash bg-white text-primary-300 flex items-center justify-center body-sm-medium disabled:opacity-50 cursor-not-allowed hover:bg-slate-50 transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
