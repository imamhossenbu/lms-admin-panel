"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  MoreHorizontal,
  Edit2,
  Eye,
  Layers,
} from "lucide-react";
import { CategoryItem } from "@/types/category";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CategoryIconRenderer } from "./CategoryIconRenderer";

interface CategoryTableProps {
  categories: CategoryItem[];
  onEdit: (category: CategoryItem) => void;
  onViewDetails: (category: CategoryItem) => void;
}

export function CategoryTable({
  categories,
  onEdit,
  onViewDetails,
}: CategoryTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>(
    []
  );

  const toggleRowExpand = (id: string) => {
    setExpandedRowKeys((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
    );
  };

  const columns: ColumnDef<CategoryItem>[] = [
    {
      key: "expand",
      header: "",
      width: "44px",
      render: (row) => {
        const isExpanded = expandedRowKeys.includes(row.id);
        const subCount = row.subCategories?.length || 0;

        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleRowExpand(row.id);
            }}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
              isExpanded
                ? "bg-brand-orange-light text-brand-orange"
                : "text-primary-300 hover:text-brand-orange hover:bg-slate-100"
            }`}
            title={
              isExpanded
                ? "Collapse sub-categories"
                : `Expand sub-categories (${subCount})`
            }
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? "rotate-90 text-brand-orange" : ""
              }`}
            />
          </button>
        );
      },
    },
    {
      key: "number",
      header: "#",
      width: "44px",
      render: (row) => (
        <span className="body-sm-medium text-primary-400">
          {row.orderNumber}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category Name",
      render: (row) => {
        const subCount = row.subCategories?.length || 0;
        return (
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => toggleRowExpand(row.id)}
          >
            <CategoryIconRenderer iconId={row.iconId} size="md" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="body-sm-medium text-primary-500 font-bold group-hover:text-brand-orange transition-colors">
                  {row.name}
                </span>
                {subCount > 0 && (
                  <span className="body-2xsm-regular px-1.5 py-0.5 rounded-full bg-slate-100 text-primary-400 font-medium">
                    {subCount} sub
                  </span>
                )}
              </div>
              <span className="body-2xsm-regular text-primary-300 font-mono">
                /{row.slug}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "description",
      header: "Description",
      render: (row) => (
        <span
          className="body-sm-regular text-primary-400 truncate max-w-[280px] block"
          title={row.description}
        >
          {row.description}
        </span>
      ),
    },
    {
      key: "totalCourses",
      header: "Total Courses",
      render: (row) => (
        <span className="body-sm-medium text-primary-500 font-semibold">
          {row.totalCourses}
        </span>
      ),
    },
    {
      key: "publishedCourses",
      header: "Published",
      render: (row) => (
        <span className="body-sm-medium text-brand-orange font-semibold">
          {row.publishedCourses}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <ToneBadge
          tone={row.status === "Active" ? "green" : "red"}
          size="sm"
        >
          {row.status}
        </ToneBadge>
      ),
    },
    {
      key: "createdDate",
      header: "Created Date",
      render: (row) => (
        <span className="body-sm-regular text-primary-300 whitespace-nowrap">
          {row.createdDate}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "56px",
      align: "center",
      render: (row) => (
        <div className="relative flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenuId(activeMenuId === row.id ? null : row.id);
            }}
            className="p-1.5 rounded-lg text-primary-300 hover:text-primary-500 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Category Actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {activeMenuId === row.id && (
            <div
              className="absolute right-0 top-8 mt-1 w-40 bg-white rounded-xl shadow-xl border border-dash py-1 z-30 animate-in fade-in zoom-in-95 duration-100 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveMenuId(null);
                  onViewDetails(row);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 body-sm-regular text-primary-500 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-primary-400" />
                <span>View Details</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMenuId(null);
                  onEdit(row);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 body-sm-regular text-primary-500 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-primary-400" />
                <span>Edit Category</span>
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  // Render expanded row showing nested subcategories with smooth layout
  const renderExpandedRow = (row: CategoryItem) => {
    const subCategories = row.subCategories || [];

    return (
      <div className="bg-[#F8FAFC] border-y border-dash px-5 py-3.5 space-y-2.5 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-orange" />
            <h5 className="body-sm-medium text-primary-500 font-bold">
              Sub-categories under &ldquo;{row.name}&rdquo; ({subCategories.length})
            </h5>
          </div>
          <span className="body-2xsm-regular text-primary-300">
            Click chevron above to collapse
          </span>
        </div>

        {subCategories.length > 0 ? (
          <div className="rounded-xl border border-dash overflow-hidden bg-white shadow-2xs divide-y divide-dash">
            {subCategories.map((sub) => (
              <div
                key={sub.id}
                className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                  <span className="body-sm-medium text-primary-500 font-semibold">
                    {sub.name}
                  </span>
                  <span className="body-2xsm-regular text-primary-300 font-mono">
                    /{sub.slug}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="body-2xsm-regular px-2 py-0.5 rounded bg-slate-100 text-primary-400 font-medium">
                    {sub.courseCount} courses
                  </span>
                  <ToneBadge
                    tone={sub.status === "Active" ? "green" : "red"}
                    size="sm"
                  >
                    {sub.status}
                  </ToneBadge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 px-4 text-center body-sm-regular text-primary-300 bg-white rounded-xl border border-dash">
            No sub-categories found under this category yet.
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="w-full overflow-x-auto text-left"
      onClick={() => setActiveMenuId(null)}
    >
      <DataTable
        columns={columns}
        data={categories}
        rowKey={(row) => row.id}
        renderExpandedRow={renderExpandedRow}
        expandedRowKeys={expandedRowKeys}
        verticalBorders={false}
        containerClassName="border-0 rounded-none w-full"
        tableClassName="w-full"
        headerClassName="bg-slate-50/70 border-b border-dash body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider"
        thClassName="px-3.5 py-3 border-none"
        cellClassName="px-3.5 py-3.5 border-none"
      />
    </div>
  );
}

export default CategoryTable;
