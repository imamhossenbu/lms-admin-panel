import type { Metadata } from "next";
import { ConsoleShell } from "@/components/console/shell/ConsoleShell";

export const metadata: Metadata = {
  title: "EduPro Owner Console",
  description: "Manage institutions, subscriptions, invoices, plans and domains across the EduPro platform.",
};

/** Owner Console (/console/**) — own navy sidebar + navbar; never the institution AdminShell. */
export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return <ConsoleShell>{children}</ConsoleShell>;
}
