"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  Edit2,
  Eye,
  Layers,
} from "lucide-react";
import { CategoryItem, SubCategoryItem } from "@/types/category";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CategoryIconRenderer } from "./CategoryIconRenderer";

interface CategoryTableProps {
  categories: CategoryItem[];
  onEdit: (category: CategoryItem) => void;
  onViewDetails: (category: CategoryItem) => void;
  onEditSubCategory: (subCategory: SubCategoryItem, parentCategory: CategoryItem) => void;
}

export function CategoryTable({
  categories,
  onEdit,
  onViewDetails,
  onEditSubCategory,
}: CategoryTableProps) {
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
      align: "center",
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
                : "text-primary-300 hover:text-brand-orange hover:bg-slate-200/60"
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
                  <span className="body-2xsm-regular px-1.5 py-0.5 rounded-full bg-slate-200/70 text-primary-500 font-medium">
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
      width: "120px",
      align: "center",
      render: (row) => (
        <span className="body-sm-medium text-primary-500 font-semibold">
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
        <span className="body-sm-medium text-brand-orange font-semibold">
          {row.publishedCourses}
        </span>
      ),
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
      key: "createdDate",
      header: "Created Date",
      width: "120px",
      align: "center",
      render: (row) => (
        <span className="body-sm-regular text-primary-300 whitespace-nowrap">
          {row.createdDate}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "84px",
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
        </div>
      ),
    },
  ];

  // Render expanded row showing nested subcategories with icon-only edit button
  const renderExpandedRow = (row: CategoryItem) => {
    const subCategories = row.subCategories || [];

    return (
      <div className="bg-[#F8FAFC] border-y border-dash px-5 py-4 space-y-3 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-orange" />
            <h5 className="body-sm-medium text-primary-500 font-bold">
              Sub-categories under &ldquo;{row.name}&rdquo; ({subCategories.length})
            </h5>
          </div>
          <span className="body-2xsm-regular text-primary-300">
            Click chevron on the left to collapse
          </span>
        </div>

        {subCategories.length > 0 ? (
          <div className="rounded-xl border border-dash overflow-hidden bg-white shadow-2xs divide-y divide-dash">
            {subCategories.map((sub, idx) => (
              <div
                key={sub.id || idx}
                className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0" />
                  <div>
                    <span className="body-sm-medium text-primary-500 font-semibold block">
                      {sub.name}
                    </span>
                    <span className="body-2xsm-regular text-primary-300 font-mono">
                      /{sub.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="body-2xsm-regular px-2.5 py-1 rounded-md bg-slate-100 text-primary-500 font-medium">
                    {sub.courseCount} courses
                  </span>

                  <ToneBadge
                    tone={sub.status === "Active" ? "green" : "red"}
                    size="sm"
                  >
                    {sub.status}
                  </ToneBadge>

                  {/* Sub-Category Edit Icon-Only Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSubCategory(sub, row);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-dash bg-white hover:bg-brand-orange-light text-primary-400 hover:text-brand-orange hover:border-brand-orange/40 transition-all cursor-pointer shadow-2xs"
                    title={`Edit sub-category "${sub.name}"`}
                  >
                    <Edit2 className="w-3.5 h-3.5 text-brand-orange" />
                  </button>
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
    <div className="w-full overflow-x-auto text-left">
      <DataTable
        columns={columns}
        data={categories}
        rowKey={(row) => row.id}
        renderExpandedRow={renderExpandedRow}
        expandedRowKeys={expandedRowKeys}
        verticalBorders={true}
        containerClassName="border-0 rounded-none w-full"
        tableClassName="w-full"
        headerClassName="bg-[#F1F3F5] border-b border-dash body-sm-medium text-primary-500 font-semibold normal-case"
        thClassName="px-3.5 py-3 text-primary-500 font-semibold normal-case text-[13.5px]"
        cellClassName="px-3.5 py-3.5"
      />
    </div>
  );
}

export default CategoryTable;
