"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="body-sm-medium text-primary-400 hover:text-brand-orange transition-colors flex items-center gap-1.5 group"
              >
                {item.icon && (
                  <span className="text-primary-300 group-hover:text-brand-orange transition-colors shrink-0">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="body-sm-medium text-primary-500 font-semibold flex items-center gap-1.5">
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            )}

            {!isLast && (
              <ChevronRight className="w-3.5 h-3.5 text-primary-300 shrink-0 select-none" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
