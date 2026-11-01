import { Building2, CreditCard, FileText, Globe, LayoutDashboard, Settings, Tags, type LucideIcon } from "lucide-react";

export interface ConsoleNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface ConsoleNavSection {
  category: string;
  items: ConsoleNavItem[];
}

/** Owner Console navigation (sidebar + search palette quick links). */
export const CONSOLE_NAV: ConsoleNavSection[] = [
  { category: "Platform", items: [{ href: "/console", label: "Overview", icon: LayoutDashboard }] },
  {
    category: "Customers",
    items: [
      { href: "/console/institutions", label: "Institutions", icon: Building2 },
      { href: "/console/subscriptions", label: "Subscriptions", icon: CreditCard },
      { href: "/console/invoices", label: "Invoices", icon: FileText },
    ],
  },
  {
    category: "Catalogue",
    items: [
      { href: "/console/plans", label: "Plans & pricing", icon: Tags },
      { href: "/console/domains", label: "Domains", icon: Globe },
    ],
  },
  { category: "System", items: [{ href: "/console/settings", label: "Settings", icon: Settings }] },
];

export const isNavActive = (pathname: string, href: string) => (href === "/console" ? pathname === "/console" : pathname === href || pathname.startsWith(`${href}/`));
