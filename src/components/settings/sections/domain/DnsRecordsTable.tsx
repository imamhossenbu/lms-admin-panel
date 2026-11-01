"use client";

import React from "react";
import type { CustomDomain } from "@/types/saas";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CopyButton } from "@/components/ui/CopyButton";

interface DnsRow {
  id: string;
  type: "CNAME" | "TXT";
  host: string;
  value: string;
  purpose: string;
}

/** The two DNS records the institution adds at its registrar (CNAME → cname.edupro.com, TXT verify token). */
export function DnsRecordsTable({ domain }: { domain: CustomDomain }) {
  const rows: DnsRow[] = [
    { id: "cname", type: "CNAME", host: domain.domain, value: domain.dnsTarget, purpose: "Points your domain at EduPro" },
    { id: "txt", type: "TXT", host: `_edupro-verify.${domain.domain}`, value: domain.txtToken, purpose: "Proves you own the domain" },
  ];

  const copyCell = (text: string, label: string) => (
    <div className="flex min-w-0 items-center gap-1.5">
      <span className="min-w-0 truncate body-sm-medium text-primary-500" title={text}>
        {text}
      </span>
      <CopyButton value={text} label={label} />
    </div>
  );

  const columns: ColumnDef<DnsRow>[] = [
    {
      key: "type",
      header: "Type",
      width: "14%",
      render: (r) => (
        <ToneBadge tone={r.type === "CNAME" ? "blue" : "purple"} size="sm">
          {r.type}
        </ToneBadge>
      ),
    },
    { key: "host", header: "Host / Name", width: "34%", render: (r) => copyCell(r.host, "Host copied") },
    { key: "value", header: "Value / Points to", width: "34%", render: (r) => copyCell(r.value, "Value copied") },
    {
      key: "purpose",
      header: "Purpose",
      width: "18%",
      render: (r) => (
        <span className="block truncate body-xsm-regular text-primary-300" title={r.purpose}>
          {r.purpose}
        </span>
      ),
    },
  ];

  return <DataTable<DnsRow> columns={columns} data={rows} tableClassName="table-fixed" minWidth="min-w-160" />;
}

export default DnsRecordsTable;
