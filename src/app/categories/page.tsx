"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MOCK_CATEGORIES } from "@/data/mockCategoryData";
import { CategoryItem } from "@/types/category";
import { CategoryHeader } from "@/components/categories/CategoryHeader";
import { CategoryToolbar } from "@/components/categories/CategoryToolbar";
import { CategoryTable } from "@/components/categories/CategoryTable";
import { CategoryGrid } from "@/components/categories/CategoryGrid";
import { CategoryPagination } from "@/components/categories/CategoryPagination";
import { AddCategoryCard } from "@/components/categories/AddCategoryCard";
import { CategorySkeleton } from "@/components/categories/CategorySkeleton";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(MOCK_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAddPanel, setShowAddPanel] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 10;

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || cat.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  // Paginated categories
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCategories.slice(startIndex, startIndex + pageSize);
  }, [filteredCategories, currentPage]);

  const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;

  // Checkbox handlers
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(paginatedCategories.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectCategory = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Category Add / Edit / Delete handlers
  const handleCategoryCreated = (newCategory: CategoryItem) => {
    setCategories((prev) => [newCategory, ...prev]);
  };

  const handleEditCategory = (cat: CategoryItem) => {
    toast.info("Edit Category", {
      description: `Editing details for "${cat.name}".`,
    });
  };

  const handleDeleteCategory = (cat: CategoryItem) => {
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    toast.success("Category Deleted", {
      description: `"${cat.name}" has been removed.`,
    });
  };

  if (isLoading) {
    return <CategorySkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-[12px] text-left pb-6"
    >
      {/* 1. Page Header with Breadcrumbs & Add Category CTA */}
      <CategoryHeader
        onAddClick={() => {
          setShowAddPanel(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* 2. Main Layout Split: Table on Left + Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[12px] items-start">
        {/* Left Side: Category Table / Grid Card */}
        <div
          className={`${
            showAddPanel ? "lg:col-span-2" : "lg:col-span-3"
          } bg-white rounded-xl border border-dash shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between transition-all`}
        >
          {/* Card Toolbar */}
          <CategoryToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Table or Grid View */}
          {viewMode === "table" ? (
            <CategoryTable
              categories={paginatedCategories}
              selectedCategoryIds={selectedIds}
              onSelectCategory={handleSelectCategory}
              onSelectAll={handleSelectAll}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          ) : (
            <CategoryGrid
              categories={paginatedCategories}
              onEdit={handleEditCategory}
            />
          )}

          {/* Card Pagination Footer */}
          <CategoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={filteredCategories.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Right Side: Add Category Side Card */}
        {showAddPanel && (
          <div className="lg:col-span-1">
            <AddCategoryCard
              onClose={() => setShowAddPanel(false)}
              onCategoryCreated={handleCategoryCreated}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
