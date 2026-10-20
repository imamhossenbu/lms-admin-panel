"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { categoriesApi } from "@/lib/api";
import { AdminCategoryItem } from "@/lib/types";
import { toast } from "sonner";
import {
  FolderTree,
  Plus,
  Search,
  RotateCw,
  LayoutGrid,
  List,
} from "lucide-react";
import { DEFAULT_CATEGORIES } from "@/components/categories/constants";
import { CategoryStats } from "@/components/categories/CategoryStats";
import { CategoryGrid } from "@/components/categories/CategoryGrid";
import { CategoryTable } from "@/components/categories/CategoryTable";
import { CategoryFormModal } from "@/components/categories/CategoryFormModal";
import { DeleteCategoryModal } from "@/components/categories/DeleteCategoryModal";

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<AdminCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<AdminCategoryItem | null>(null);

  // Load backend categories
  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      if (Array.isArray(data)) {
        const formatted: AdminCategoryItem[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: item.description || "Course discipline and curriculum category.",
          icon: item.icon || "📚",
          status: item.status || "ACTIVE",
          _count: {
            courses: item._count?.courses ?? item.courses?.length ?? 0,
          },
        }));
        setCategories(formatted);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.warn("Failed to load real categories:", err);
      setCategories([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchCategories();
    toast.success("Categories Synchronized", {
      description: "Subject areas and curriculum density up to date.",
    });
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (cat: AdminCategoryItem) => {
    setEditingCategory(cat);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (cat: AdminCategoryItem) => {
    setDeletingCategory(cat);
  };

  const handleSaveCategory = async (catData: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    status: "ACTIVE" | "INACTIVE";
  }) => {
    if (editingCategory) {
      try {
        await categoriesApi.update(editingCategory.id, catData);
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id ? { ...c, ...catData } : c
          )
        );
        toast.success("Category Updated", {
          description: `"${catData.name}" has been updated.`,
        });
      } catch {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id ? { ...c, ...catData } : c
          )
        );
        toast.success("Category Updated (Local Sync)");
      }
    } else {
      try {
        const created = await categoriesApi.create(catData);
        const newCat: AdminCategoryItem = {
          id: created?.id || `cat-${Date.now()}`,
          name: catData.name,
          slug: catData.slug,
          description: catData.description || "",
          icon: catData.icon || "⚡",
          status: catData.status,
          _count: { courses: 0 },
        };
        setCategories((prev) => [newCat, ...prev]);
        toast.success("Category Created", {
          description: `"${newCat.name}" is now live in catalog.`,
        });
      } catch {
        const localCat: AdminCategoryItem = {
          id: `cat-${Date.now()}`,
          name: catData.name,
          slug: catData.slug,
          description: catData.description || "",
          icon: catData.icon || "⚡",
          status: catData.status,
          _count: { courses: 0 },
        };
        setCategories((prev) => [localCat, ...prev]);
        toast.success("Category Created (Local Demo)");
      }
    }
  };

  const handleConfirmDelete = async (cat: AdminCategoryItem) => {
    try {
      await categoriesApi.delete(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      toast.success("Category Deleted", {
        description: `"${cat.name}" has been removed.`,
      });
    } catch {
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      toast.success("Category Deleted (Local Sync)");
    }
  };

  // Filter and search logic
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description &&
          cat.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" || cat.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 pb-12 bg-white min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Course Categories & Disciplines"
        subtitle="Manage subject areas, academic taxonomies, and course allocations"
        action={
          <div className="flex items-center gap-3">
            <SecondaryButton
              onClick={handleRefresh}
              disabled={isRefreshing}
              icon={
                <RotateCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              }
            >
              Refresh
            </SecondaryButton>
            <PrimaryButton
              onClick={handleOpenCreate}
              icon={<Plus className="w-4 h-4" />}
            >
              Add New Category
            </PrimaryButton>
          </div>
        }
      />

      {/* KPI Stats Overview */}
      <CategoryStats categories={categories} />

      {/* Filter and View Toolbar */}
      <div className="p-4 rounded-[12px] bg-white border border-[#EDEDED] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary-300" />
          <input
            type="text"
            placeholder="Search disciplines or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-[8px] border border-[#EDEDED] body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-[#1C4D8D]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center p-1 rounded-[8px] bg-[#F8F9FA] border border-[#EDEDED]">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1 rounded-[6px] body-xsm-medium transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-white text-primary-500 font-bold shadow-2xs"
                  : "text-primary-400 hover:text-primary-500"
              }`}
            >
              All ({categories.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-3 py-1 rounded-[6px] body-xsm-medium transition-all cursor-pointer ${
                statusFilter === "ACTIVE"
                  ? "bg-white text-primary-500 font-bold shadow-2xs"
                  : "text-primary-400 hover:text-primary-500"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("INACTIVE")}
              className={`px-3 py-1 rounded-[6px] body-xsm-medium transition-all cursor-pointer ${
                statusFilter === "INACTIVE"
                  ? "bg-white text-primary-500 font-bold shadow-2xs"
                  : "text-primary-400 hover:text-primary-500"
              }`}
            >
              Inactive
            </button>
          </div>

          <div className="flex items-center p-1 rounded-[8px] bg-[#F8F9FA] border border-[#EDEDED]">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-[6px] transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-[#1C4D8D] shadow-2xs"
                  : "text-primary-400 hover:text-primary-500"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-[6px] transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-[#1C4D8D] shadow-2xs"
                  : "text-primary-400 hover:text-primary-500"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalog View */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-[12px] border border-[#EDEDED] bg-white p-4 animate-pulse space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-28 bg-slate-100 rounded" />
                  <div className="h-3 w-16 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-3 w-3/4 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-16 text-center rounded-[12px] border-2 border-dashed border-[#EDEDED] bg-[#F8F9FA]/40 space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1C4D8D] flex items-center justify-center mx-auto">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <h4 className="body-md-medium text-primary-500 font-bold">
              No categories found
            </h4>
            <p className="body-sm-regular subtext-500 mt-1">
              {searchQuery
                ? `No disciplines matching "${searchQuery}".`
                : "Get started by adding your first academic category."}
            </p>
          </div>
          <PrimaryButton onClick={handleOpenCreate} icon={<Plus className="w-4 h-4" />}>
            Create Category
          </PrimaryButton>
        </div>
      ) : viewMode === "grid" ? (
        <CategoryGrid
          categories={filteredCategories}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      ) : (
        <CategoryTable
          categories={filteredCategories}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Add / Edit Category Modal */}
      <CategoryFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCategoryModal
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        category={deletingCategory}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
