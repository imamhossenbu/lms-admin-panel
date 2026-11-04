"use client";

import React, { Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { CategoryDrawerMode, CategoryItem } from "@/types/category";
import { deleteCategory } from "@/lib/categoryStorage";
import { apiErrorMessage } from "@/lib/apiError";
import { useUrlParams } from "@/lib/useUrlParams";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { CategoryHeader } from "@/components/categories/CategoryHeader";
import { CategoryToolbar } from "@/components/categories/CategoryToolbar";
import { CategoryTable } from "@/components/categories/CategoryTable";
import { CategoryGrid } from "@/components/categories/CategoryGrid";
import { CategoryPagination } from "@/components/categories/CategoryPagination";
import { CategoryDrawer } from "@/components/categories/CategoryDrawer";
import { CategorySkeleton } from "@/components/categories/CategorySkeleton";
import { useCategoriesData } from "@/components/categories/useCategoriesData";

const PAGE_SIZES = [10, 20, 50];

/**
 * /categories — list (table / grid) with search, status filter and pagination, plus the create / edit /
 * details drawer. Everything lives in the URL (`q`, `status`, `view`, `page`, `size`, `drawer`, `mode`).
 */
function CategoriesContent() {
  const { get, getPage, set } = useUrlParams();
  const { categories, isLoading, loadError, retry } = useCategoriesData();
  const [deleting, setDeleting] = useState<CategoryItem | null>(null);

  // Local copy so typing never waits on a router round-trip; mirrored to ?q=.
  const [searchQuery, setSearchQuery] = useState(() => get("q"));
  const statusFilter = get("status", "All");
  const viewMode: "table" | "grid" = get("view") === "grid" ? "grid" : "table";
  const sizeParam = Number(get("size"));
  const pageSize = PAGE_SIZES.includes(sizeParam) ? sizeParam : 10;

  // Drawer: ?drawer=new | ?drawer=<id>&mode=edit|details
  const drawerParam = get("drawer");
  const drawerCategory = drawerParam && drawerParam !== "new" ? categories.find((c) => c.id === drawerParam) ?? null : null;
  const drawerMode: CategoryDrawerMode = drawerParam === "new" ? "create" : get("mode") === "edit" ? "edit" : "details";
  const isDrawerOpen = drawerParam === "new" || !!drawerCategory;

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return categories.filter((cat) => {
      const matchesSearch = !q || cat.name.toLowerCase().includes(q) || cat.slug.includes(q) || cat.description.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || cat.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(getPage(), totalPages);
  const paginated = useMemo(() => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize), [filtered, currentPage, pageSize]);

  const openDrawer = (id: string, mode?: "edit" | "details") => set({ drawer: id, mode: mode === "edit" ? "edit" : null });
  const closeDrawer = () => set({ drawer: null, mode: null });

  const confirmDelete = async () => {
    if (!deleting) return;
    const id = toast.loading("Deleting category...", { description: deleting.name });
    try {
      await deleteCategory(deleting.id);
      toast.success("Category deleted", { id, description: `"${deleting.name}" was removed.` });
      if (drawerParam === deleting.id) closeDrawer();
    } catch (err) {
      toast.error("Couldn't delete the category", { id, description: apiErrorMessage(err, "Please try again.") });
      throw err;
    }
  };

  if (isLoading) return <CategorySkeleton />;
  if (loadError) return <LoadErrorCard title="Couldn't load categories" message={loadError} onRetry={retry} />;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-4 text-left pb-8">
      <CategoryHeader onAddClick={() => set({ drawer: "new", mode: null })} />

      <div className="bg-white rounded-xl border border-dash shadow-2xs overflow-hidden flex flex-col justify-between">
        <CategoryToolbar
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            set({ q, page: null });
          }}
          statusFilter={statusFilter}
          onStatusChange={(s) => set({ status: s, page: null })}
          viewMode={viewMode}
          onViewModeChange={(m) => set({ view: m === "grid" ? "grid" : null })}
        />

        {viewMode === "table" ? (
          <CategoryTable categories={paginated} onEdit={(c) => openDrawer(c.id, "edit")} onViewDetails={(c) => openDrawer(c.id)} onDelete={setDeleting} />
        ) : (
          <CategoryGrid categories={paginated} onEdit={(c) => openDrawer(c.id, "edit")} onViewDetails={(c) => openDrawer(c.id)} />
        )}

        <CategoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={filtered.length}
          pageSize={pageSize}
          onPageChange={(page) => set({ page })}
          onPageSizeChange={(size) => set({ size: size === 10 ? null : size, page: null })}
        />
      </div>

      <CategoryDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        category={drawerCategory}
        onClose={closeDrawer}
        onSaved={closeDrawer}
        onOpenEdit={(c) => openDrawer(c.id, "edit")}
        onDelete={setDeleting}
      />

      <ConfirmModal
        isOpen={deleting !== null}
        title="Delete this category?"
        subtitle={deleting?.name}
        message={
          deleting && deleting.totalCourses > 0
            ? `${deleting.totalCourses} course${deleting.totalCourses === 1 ? " still uses" : "s still use"} this category. Move ${deleting.totalCourses === 1 ? "it" : "them"} to another category first.`
            : "The category will be removed permanently. This can't be undone."
        }
        confirmLabel="Delete Category"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </motion.div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoriesContent />
    </Suspense>
  );
}
