"use client";

import React, { useState } from "react";
import { MoreHorizontal, Edit, Trash2, BookOpen } from "lucide-react";
import { CategoryItem } from "@/types/category";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { CategoryIconRenderer } from "./CategoryIconRenderer";

interface CategoryTableProps {
  categories: CategoryItem[];
  selectedCategoryIds: string[];
  onSelectCategory: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
}

export function CategoryTable({
  categories,
  selectedCategoryIds,
  onSelectCategory,
  onSelectAll,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const allSelected =
    categories.length > 0 &&
    categories.every((c) => selectedCategoryIds.includes(c.id));

  const columns: ColumnDef<CategoryItem>[] = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => onSelectAll(e.target.checked)}
          className="rounded border-slate-300 text-brand-orange focus:ring-brand-orange cursor-pointer"
        />
      ),
      width: "44px",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedCategoryIds.includes(row.id)}
          onChange={(e) => onSelectCategory(row.id, e.target.checked)}
          className="rounded border-slate-300 text-brand-orange focus:ring-brand-orange cursor-pointer"
        />
      ),
    },
    {
      key: "number",
      header: "#",
      width: "48px",
      render: (row) => (
        <span className="body-sm-medium text-primary-400">
          {row.orderNumber}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <CategoryIconRenderer iconId={row.iconId} size="md" />
          <span className="body-sm-medium text-primary-500 font-bold whitespace-nowrap">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (row) => (
        <span className="body-sm-regular text-primary-400 truncate max-w-[260px] block" title={row.description}>
          {row.description}
        </span>
      ),
    },
    {
      key: "totalCourses",
      header: "Total Courses",
      render: (row) => (
        <span className="body-sm-medium text-primary-500 font-medium">
          {row.totalCourses}
        </span>
      ),
    },
    {
      key: "publishedCourses",
      header: "Published",
      render: (row) => (
        <span className="body-sm-medium text-primary-500 font-medium">
          {row.publishedCourses}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md body-2xsm-regular font-semibold ${
            row.status === "Active"
              ? "bg-green-bg text-green"
              : "bg-red-14 text-red"
          }`}
        >
          {row.status}
        </span>
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
      width: "50px",
      render: (row) => (
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setActiveMenuId(activeMenuId === row.id ? null : row.id)
            }
            className="p-1.5 rounded-lg text-primary-300 hover:text-primary-500 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {activeMenuId === row.id && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-dash py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setActiveMenuId(null);
                  onEdit(row);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-1.5 body-sm-regular text-primary-500 hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <Edit className="w-3.5 h-3.5 text-primary-400" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMenuId(null);
                  onDelete(row);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-1.5 body-sm-regular text-red hover:bg-red-14 transition-colors cursor-pointer text-left"
              >
                <Trash2 className="w-3.5 h-3.5 text-red" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full border-t border-dash overflow-x-auto">
      <DataTable
        columns={columns}
        data={categories}
        verticalBorders={false}
        containerClassName="border-0 rounded-none w-full"
        tableClassName="w-full"
        headerClassName="bg-transparent border-b border-dash body-2xsm-regular text-primary-300 font-semibold uppercase tracking-wider"
        thClassName="px-3.5 py-2.5 border-none"
        cellClassName="px-3.5 py-3 border-none"
      />
    </div>
  );
}
