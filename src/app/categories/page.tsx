"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MOCK_CATEGORIES } from "@/data/mockCategoryData";
import {
  CategoryItem,
  SubCategoryItem,
  CategoryDrawerMode,
  CategoryStatus,
} from "@/types/category";
import { CategoryHeader } from "@/components/categories/CategoryHeader";
import { CategoryToolbar } from "@/components/categories/CategoryToolbar";
import { CategoryTable } from "@/components/categories/CategoryTable";
import { CategoryGrid } from "@/components/categories/CategoryGrid";
import { CategoryPagination } from "@/components/categories/CategoryPagination";
import { CategoryDrawer } from "@/components/categories/CategoryDrawer";
import { CategorySkeleton } from "@/components/categories/CategorySkeleton";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(MOCK_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Drawer state management (create, edit, details, including sub-category editing)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<CategoryDrawerMode>("create");
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategoryItem | null>(null);

  const [pageSize, setPageSize] = useState(10);

  // Filtered categories (also searches through subcategories!)
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        Boolean(
          cat.subCategories?.some((sub) => sub.name.toLowerCase().includes(q))
        );
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

  // Drawer Open Handlers
  const handleOpenAdd = () => {
    setSelectedCategory(null);
    setEditingSubCategory(null);
    setDrawerMode("create");
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setSelectedCategory(cat);
    setEditingSubCategory(null);
    setDrawerMode("edit");
    setIsDrawerOpen(true);
  };

  const handleOpenEditSubCategory = (
    sub: SubCategoryItem,
    parentCat: CategoryItem
  ) => {
    setSelectedCategory(parentCat);
    setEditingSubCategory(sub);
    setDrawerMode("edit");
    setIsDrawerOpen(true);
  };

  const handleOpenDetails = (cat: CategoryItem) => {
    setSelectedCategory(cat);
    setEditingSubCategory(null);
    setDrawerMode("details");
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingSubCategory(null);
  };

  // Add / Edit Category or Sub-category handler
  const handleSaveCategory = (payload: {
    id?: string;
    name: string;
    slug: string;
    description: string;
    status: CategoryStatus;
    iconId: string;
    isSubCategory: boolean;
    parentId?: string;
  }) => {
    if (payload.isSubCategory && payload.parentId) {
      // Adding or editing a sub-category under a parent
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === payload.parentId) {
            const existingSub = cat.subCategories || [];
            if (payload.id) {
              return {
                ...cat,
                subCategories: existingSub.map((sub) =>
                  sub.id === payload.id
                    ? {
                        ...sub,
                        name: payload.name,
                        slug: payload.slug,
                        description: payload.description,
                        status: payload.status,
                      }
                    : sub
                ),
              };
            } else {
              const newSub: SubCategoryItem = {
                id: `sub-${Date.now()}`,
                name: payload.name,
                slug: payload.slug,
                description: payload.description,
                courseCount: 0,
                status: payload.status,
                createdDate: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                parentId: payload.parentId!,
              };
              return {
                ...cat,
                subCategories: [newSub, ...existingSub],
              };
            }
          }
          return cat;
        })
      );
    } else {
      // Parent category create or edit
      if (payload.id) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === payload.id
              ? {
                  ...cat,
                  name: payload.name,
                  slug: payload.slug,
                  description: payload.description,
                  status: payload.status,
                  iconId: payload.iconId,
                }
              : cat
          )
        );
      } else {
        const newCat: CategoryItem = {
          id: `cat-${Date.now()}`,
          orderNumber: categories.length + 1,
          name: payload.name,
          slug: payload.slug,
          description: payload.description,
          totalCourses: 0,
          publishedCourses: 0,
          status: payload.status,
          createdDate: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          iconId: payload.iconId,
          colorScheme: "orange",
          subCategories: [],
        };
        setCategories((prev) => [newCat, ...prev]);
      }
    }
  };

  if (isLoading) {
    return <CategorySkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-[16px] text-left pb-8"
    >
      {/* 1. Page Header with Prominent Breadcrumbs & Add Category CTA */}
      <CategoryHeader onAddClick={handleOpenAdd} />

      {/* 2. Full-Width Category Card: Toolbar + DataTable/Grid + Pagination */}
      <div className="bg-white rounded-xl border border-dash shadow-2xs overflow-hidden flex flex-col justify-between">
        {/* Toolbar */}
        <CategoryToolbar
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          statusFilter={statusFilter}
          onStatusChange={(s) => {
            setStatusFilter(s);
            setCurrentPage(1);
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Table or Grid View */}
        {viewMode === "table" ? (
          <CategoryTable
            categories={paginatedCategories}
            onEdit={handleOpenEdit}
            onViewDetails={handleOpenDetails}
            onEditSubCategory={handleOpenEditSubCategory}
          />
        ) : (
          <CategoryGrid
            categories={paginatedCategories}
            onEdit={handleOpenEdit}
            onViewDetails={handleOpenDetails}
          />
        )}

        {/* Pagination Footer */}
        <CategoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={filteredCategories.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* 3. Slide-Over Side Drawer for Create / Edit / Details */}
      <CategoryDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        category={selectedCategory}
        editingSubCategory={editingSubCategory}
        parentCategories={categories}
        onClose={handleCloseDrawer}
        onSave={handleSaveCategory}
        onOpenEdit={handleOpenEdit}
        onOpenEditSubCategory={handleOpenEditSubCategory}
      />
    </motion.div>
  );
}
