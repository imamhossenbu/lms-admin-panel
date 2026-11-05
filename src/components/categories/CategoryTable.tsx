"use client";

import React from "react";
import { CornerDownRight, Edit2, Eye, Trash2 } from "lucide-react";
import { CategoryItem } from "@/types/category";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CategoryIconRenderer } from "./CategoryIconRenderer";

interface CategoryTableProps {
  /** The rows to show (tree order: sub-categories right under their parent). */
  categories: CategoryItem[];
  /** Every category (for parent names). */
  allCategories: CategoryItem[];
  onEdit: (category: CategoryItem) => void;
  onViewDetails: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
}

const formatDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—");

export function CategoryTable({
  categories,
  allCategories,
  onEdit,
  onViewDetails,
  onDelete,
}: CategoryTableProps) {
  const columns: ColumnDef<CategoryItem>[] = [
    {
      key: "category",
      header: "Category Name",
      render: (row) => (
        <button type="button" className={`flex items-center gap-3 cursor-pointer group text-left ${row.parentId ? "pl-5" : ""}`} onClick={() => onViewDetails(row)}>
          {row.parentId && <CornerDownRight className="w-3.5 h-3.5 text-primary-300 shrink-0 -ml-1" aria-hidden />}
          <CategoryIconRenderer iconId={row.iconId} size="md" />
          <span className="flex flex-col min-w-0">
            <span className="body-sm-medium text-primary-500 group-hover:text-brand-orange transition-colors">{row.name}</span>
            <span className="body-2xsm-regular text-primary-300">
              <span className="font-mono">/{row.slug}</span>
              {row.parentId
                ? ` · in ${allCategories.find((c) => c.id === row.parentId)?.name ?? "another category"}`
                : row.subCategoryCount > 0
                  ? ` · ${row.subCategoryCount} sub-categor${row.subCategoryCount === 1 ? "y" : "ies"}`
                  : ""}
            </span>
          </span>
        </button>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (row) => (
        <span
          className="body-sm-regular text-primary-400 truncate max-w-70 block"
          title={row.description}
        >
          {row.description || "—"}
        </span>
      ),
    },
    {
      key: "totalCourses",
      header: "Total Courses",
      width: "120px",
      align: "center",
      render: (row) => (
        <span className="body-sm-medium text-primary-500">
          {row.totalCourses}
        </span>
      ),
    },
    {
      key: "publishedCourses",
      header: "Published",
      width: "110px",
      align: "center",
      render: (row) => (
        <span className="body-sm-medium text-brand-orange">
          {row.publishedCourses}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      width: "120px",
      align: "center",
      render: (row) => <span className="body-sm-regular text-primary-400 whitespace-nowrap">{formatDate(row.createdAt)}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "100px",
      align: "center",
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
      key: "actions",
      header: "Actions",
      width: "116px",
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          {/* View Details Icon Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(row);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-dash bg-white hover:bg-slate-100 text-primary-400 hover:text-primary-600 transition-colors cursor-pointer shadow-2xs"
            title={`View details for "${row.name}"`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Edit Category Icon-Only Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-dash bg-white hover:bg-brand-orange-light text-primary-400 hover:text-brand-orange hover:border-brand-orange/40 transition-colors cursor-pointer shadow-2xs"
            title={`Edit category "${row.name}"`}
          >
            <Edit2 className="w-3.5 h-3.5 text-brand-orange" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-dash bg-white hover:bg-red-14 text-red hover:border-red transition-colors cursor-pointer shadow-2xs"
            title={`Delete category "${row.name}"`}
            aria-label={`Delete category "${row.name}"`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full overflow-x-auto text-left">
      <DataTable
        columns={columns}
        data={categories}
        rowKey={(row) => row.id}
        emptyMessage="No categories match your filters."
        verticalBorders={true}
        containerClassName="border-0 rounded-none w-full"
        tableClassName="w-full"
        headerClassName="bg-gray-bg border-b border-dash body-sm-medium text-primary-500 normal-case"
        thClassName="px-3.5 py-3 text-primary-500 normal-case body-sm-medium"
        cellClassName="px-3.5 py-3.5"
      />
    </div>
  );
}

export default CategoryTable;
