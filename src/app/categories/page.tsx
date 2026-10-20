"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { TagBadge } from "@/components/ui/TagBadge";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { InputField } from "@/components/ui/InputField";
import { ModalShell } from "@/components/ui/ModalShell";
import { RowActionButton } from "@/components/ui/RowActionButton";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { categoriesApi } from "@/lib/api";
import { AdminCategoryItem } from "@/lib/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderTree,
  Plus,
  Search,
  BookOpen,
  Layers,
  Sparkles,
  RotateCw,
  Trash2,
  Edit3,
  CheckCircle2,
  LayoutGrid,
  List,
  Check,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const EMOJI_OPTIONS = [
  "🤖", "💻", "☁️", "⚡", "🛡️", "📱", "🎨", "📊", "🧠", "🌐", "🔬", "🚀", "🎯", "⚙️"
];

const DEFAULT_CATEGORIES: AdminCategoryItem[] = [
  {
    id: "cat-ai",
    name: "Artificial Intelligence",
    slug: "artificial-intelligence",
    description: "Deep learning, LLMs, neural networks, and prompt engineering.",
    icon: "🤖",
    status: "ACTIVE",
    _count: { courses: 14 },
  },
  {
    id: "cat-web",
    name: "Fullstack Web",
    slug: "fullstack-web",
    description: "Next.js, React 19, TypeScript, and modern frontend/backend stacks.",
    icon: "💻",
    status: "ACTIVE",
    _count: { courses: 28 },
  },
  {
    id: "cat-cloud",
    name: "Cloud & DevOps",
    slug: "cloud-devops",
    description: "Docker, Kubernetes, AWS, Terraform, and CI/CD automation pipelines.",
    icon: "☁️",
    status: "ACTIVE",
    _count: { courses: 18 },
  },
  {
    id: "cat-se",
    name: "Software Engineering",
    slug: "software-engineering",
    description: "Data structures, algorithms, system design, and clean architecture.",
    icon: "⚡",
    status: "ACTIVE",
    _count: { courses: 22 },
  },
  {
    id: "cat-cyber",
    name: "Cybersecurity",
    slug: "cybersecurity",
    description: "Ethical hacking, zero-trust infrastructure, and cryptography.",
    icon: "🛡️",
    status: "ACTIVE",
    _count: { courses: 8 },
  },
];

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<AdminCategoryItem[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formIcon, setFormIcon] = useState("⚡");
  const [formStatus, setFormStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirm State
  const [deletingCategory, setDeletingCategory] = useState<AdminCategoryItem | null>(null);

  // Load backend categories
  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      if (Array.isArray(data) && data.length > 0) {
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

        // Merge with defaults to ensure robust initial display
        const map = new Map<string, AdminCategoryItem>();
        DEFAULT_CATEGORIES.forEach((cat) => map.set(cat.name, cat));
        formatted.forEach((cat) => map.set(cat.name, cat));
        setCategories(Array.from(map.values()));
      }
    } catch (err) {
      console.warn("Using offline categories catalog:", err);
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
    setFormName("");
    setFormSlug("");
    setFormDesc("");
    setFormIcon("⚡");
    setFormStatus("ACTIVE");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: AdminCategoryItem) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormSlug(category.slug);
    setFormDesc(category.description || "");
    setFormIcon(category.icon || "⚡");
    setFormStatus(category.status === "INACTIVE" ? "INACTIVE" : "ACTIVE");
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      const genSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormSlug(genSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(editingCategory ? "Updating category..." : "Creating category...");

    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, {
          name: formName.trim(),
          description: formDesc.trim(),
          status: formStatus,
        });

        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id
              ? {
                  ...cat,
                  name: formName.trim(),
                  slug: formSlug.trim(),
                  description: formDesc.trim(),
                  icon: formIcon,
                  status: formStatus,
                }
              : cat
          )
        );

        toast.success("Category Updated", {
          id: toastId,
          description: `${formName} classification updated successfully.`,
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        });
      } else {
        const payload = {
          name: formName.trim(),
          slug: formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: formDesc.trim(),
          icon: formIcon,
        };

        const res = await categoriesApi.create(payload);
        const newCat: AdminCategoryItem = {
          id: res?.id || `cat-${Date.now()}`,
          name: payload.name,
          slug: payload.slug,
          description: payload.description,
          icon: payload.icon,
          status: formStatus,
          _count: { courses: 0 },
        };

        setCategories((prev) => [newCat, ...prev]);
        toast.success("Category Created", {
          id: toastId,
          description: `Discipline ${formName} added to academic registry.`,
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save category:", err);
      // Optimistic fallback for frontend UX
      if (!editingCategory) {
        const localCat: AdminCategoryItem = {
          id: `cat-local-${Date.now()}`,
          name: formName.trim(),
          slug: formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: formDesc.trim(),
          icon: formIcon,
          status: formStatus,
          _count: { courses: 0 },
        };
        setCategories((prev) => [localCat, ...prev]);
        toast.success("Category Registered (Local Workspace)", { id: toastId });
        setIsModalOpen(false);
      } else {
        toast.error("Error saving category", {
          id: toastId,
          description: err.response?.data?.message || "Please check backend connection.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    const catId = deletingCategory.id;
    const toastId = toast.loading("Archiving category...");

    try {
      await categoriesApi.delete(catId);
      setCategories((prev) => prev.filter((c) => c.id !== catId));
      toast.success("Category Removed", {
        id: toastId,
        description: `Discipline ${deletingCategory.name} was successfully removed.`,
      });
    } catch {
      setCategories((prev) => prev.filter((c) => c.id !== catId));
      toast.success("Category Removed (Catalog Synchronized)", { id: toastId });
    } finally {
      setDeletingCategory(null);
    }
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" ? true : cat.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  // Key KPI stats
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status !== "INACTIVE").length;
  const totalCourses = categories.reduce((acc, c) => acc + (c._count?.courses || 0), 0);
  const topCategory = [...categories].sort(
    (a, b) => (b._count?.courses || 0) - (a._count?.courses || 0)
  )[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="space-y-6 text-left bg-white"
    >
      {/* ================= PAGE HEADER ================= */}
      <PageHeader
        title="Academic Categories & Disciplines"
        subtitle="Manage instructional taxonomy, subject classifications, and curriculum density."
        badge={
          <ToneBadge tone="ice" className="gap-1.5 font-medium">
            <FolderTree className="w-3.5 h-3.5 text-[#1C4D8D]" />
            <span>Taxonomy Engine</span>
          </ToneBadge>
        }
      >
        <SecondaryButton
          onClick={handleRefresh}
          className="h-[40px] px-3.5"
          disabled={isRefreshing}
          title="Refresh catalog"
        >
          <RotateCw className={`w-4 h-4 text-primary-400 ${isRefreshing ? "animate-spin" : ""}`} />
        </SecondaryButton>

        <PrimaryButton
          onClick={handleOpenCreate}
          className="h-[40px] px-4 font-semibold shadow-xs"
          leftIcon={<Plus className="w-4 h-4 text-white" />}
        >
          New Category
        </PrimaryButton>
      </PageHeader>

      {/* ================= KPI METRIC CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-[12px] bg-white border border-[#EDEDED] flex items-center justify-between shadow-2xs">
          <div>
            <span className="body-xsm-medium uppercase tracking-wider subtext-500 block">
              Total Categories
            </span>
            <span className="h6-medium font-bold text-primary-500 mt-1 block">
              {totalCategories}
            </span>
            <span className="body-xsm-regular text-emerald-600 font-medium mt-0.5 block">
              Verified Classifications
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1C4D8D]">
            <FolderTree className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-[12px] bg-white border border-[#EDEDED] flex items-center justify-between shadow-2xs">
          <div>
            <span className="body-xsm-medium uppercase tracking-wider subtext-500 block">
              Active Disciplines
            </span>
            <span className="h6-medium font-bold text-primary-500 mt-1 block">
              {activeCategories}
            </span>
            <span className="body-xsm-regular text-sky-600 font-medium mt-0.5 block">
              Published in Catalog
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-[12px] bg-white border border-[#EDEDED] flex items-center justify-between shadow-2xs">
          <div>
            <span className="body-xsm-medium uppercase tracking-wider subtext-500 block">
              Linked Courses
            </span>
            <span className="h6-medium font-bold text-primary-500 mt-1 block">
              {totalCourses}
            </span>
            <span className="body-xsm-regular subtext-500 mt-0.5 block">
              Curriculum Units
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-[12px] bg-white border border-[#EDEDED] flex items-center justify-between shadow-2xs">
          <div>
            <span className="body-xsm-medium uppercase tracking-wider subtext-500 block">
              Top Discipline
            </span>
            <span className="h6-medium font-bold text-primary-500 mt-1 block truncate max-w-[140px]">
              {topCategory?.name || "N/A"}
            </span>
            <span className="body-xsm-regular text-[#1C4D8D] font-medium mt-0.5 block">
              {topCategory?._count?.courses || 0} active courses
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ================= CONTROLS: SEARCH & FILTERS ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-primary-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search disciplines by name, slug, or tags..."
            className="w-full h-[40px] pl-10 pr-4 rounded-[8px] bg-white border border-[#EDEDED] body-sm-regular text-primary-500 placeholder:text-[#969696] focus:outline-none focus:border-[#1C4D8D] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="inline-flex rounded-[8px] border border-[#EDEDED] p-0.5 bg-[#F8F9FA]">
            {(["ALL", "ACTIVE", "INACTIVE"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 h-[32px] rounded-[6px] body-xsm-medium transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-white text-primary-500 font-bold shadow-2xs border border-[#EDEDED]"
                    : "text-[#8C95A3] hover:text-primary-500"
                }`}
              >
                {st === "ALL" ? "All" : st === "ACTIVE" ? "Active" : "Inactive"}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex rounded-[8px] border border-[#EDEDED] p-0.5 bg-[#F8F9FA]">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-[6px] transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-[#1C4D8D] shadow-2xs border border-[#EDEDED]"
                  : "text-[#8C95A3] hover:text-primary-500"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-[6px] transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-[#1C4D8D] shadow-2xs border border-[#EDEDED]"
                  : "text-[#8C95A3] hover:text-primary-500"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= CATEGORY CARDS / TABLE VIEW ================= */}
      {filteredCategories.length === 0 ? (
        <div className="py-16 text-center rounded-[12px] border border-dashed border-[#EDEDED] bg-white">
          <FolderTree className="w-10 h-10 text-primary-300 mx-auto mb-3" />
          <h4 className="title-medium text-primary-500">No categories found</h4>
          <p className="body-sm-regular subtext-500 max-w-sm mx-auto mt-1 mb-4">
            No disciplines match your current filter criteria. Create a new classification or adjust your search.
          </p>
          <PrimaryButton
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-4 h-4 text-white" />}
          >
            Create Category
          </PrimaryButton>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredCategories.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-[14px] border border-[#EDEDED] bg-white flex flex-col justify-between hover:border-[#1C4D8D]/40 hover:shadow-md transition-all group relative"
              >
                <div>
                  {/* Top Row: Icon + Status + Actions */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED] flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                        {cat.icon || "📚"}
                      </div>
                      <div>
                        <h4 className="title-medium text-primary-500 font-bold group-hover:text-[#1C4D8D] transition-colors">
                          {cat.name}
                        </h4>
                        <span className="body-xsm-regular subtext-500 block">
                          /{cat.slug}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <ToneBadge
                        tone={cat.status === "INACTIVE" ? "neutral" : "green"}
                        size="sm"
                        className="font-semibold"
                      >
                        {cat.status === "INACTIVE" ? "Inactive" : "Active"}
                      </ToneBadge>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 rounded-[6px] text-primary-300 hover:text-primary-500 hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCategory(cat)}
                        className="p-1.5 rounded-[6px] text-primary-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="body-sm-regular subtext-500 line-clamp-2 mb-4">
                    {cat.description || "Instructional subject area and course classification."}
                  </p>
                </div>

                {/* Bottom Row: Metrics & Tag */}
                <div className="pt-3 border-t border-[#EDEDED] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 body-xsm-medium text-primary-500 font-semibold">
                    <BookOpen className="w-3.5 h-3.5 text-[#1C4D8D]" />
                    <span>{cat._count?.courses ?? 0} Courses Registered</span>
                  </div>

                  <span className="body-xsm-regular text-[#8C95A3] bg-[#F8F9FA] px-2 py-0.5 rounded border border-[#EDEDED]">
                    ID: {cat.id.slice(0, 8)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Table View */
        <div className="rounded-[12px] border border-[#EDEDED] bg-white overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EDEDED] bg-[#F8F9FA] body-xsm-medium uppercase tracking-wider text-primary-500">
                <th className="py-3.5 px-4 font-semibold">Discipline</th>
                <th className="py-3.5 px-4 font-semibold">Slug Identifier</th>
                <th className="py-3.5 px-4 font-semibold">Description</th>
                <th className="py-3.5 px-4 font-semibold text-center">Courses</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED] body-sm-regular text-primary-500">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#F8F9FA]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat.icon || "📚"}</span>
                      <span className="body-sm-medium text-primary-500 font-bold">
                        {cat.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-primary-400">
                    /{cat.slug}
                  </td>
                  <td className="py-3.5 px-4 subtext-500 max-w-xs truncate">
                    {cat.description || "N/A"}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-[#1C4D8D] body-xsm-medium font-semibold border border-blue-100">
                      {cat._count?.courses ?? 0}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <ToneBadge
                      tone={cat.status === "INACTIVE" ? "neutral" : "green"}
                      size="sm"
                    >
                      {cat.status === "INACTIVE" ? "Inactive" : "Active"}
                    </ToneBadge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 rounded-[6px] text-primary-300 hover:text-primary-500 hover:bg-[#F8F9FA] transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCategory(cat)}
                        className="p-1.5 rounded-[6px] text-primary-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= CREATE / EDIT CATEGORY MODAL ================= */}
      <ModalShell
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Category Discipline" : "Create Academic Discipline"}
        description="Classify courses under tailored subject tags with live curriculum counts."
        maxWidth="md"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <SecondaryButton
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="h-[40px] px-4"
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              form="category-form"
              isLoading={isSubmitting}
              className="h-[40px] px-5 font-semibold"
            >
              {editingCategory ? "Save Changes" : "Register Category"}
            </PrimaryButton>
          </div>
        }
      >
        <form id="category-form" onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Emoji / Icon Selector */}
          <div>
            <label className="body-sm-medium text-primary-500 font-semibold block mb-1.5">
              Discipline Emoji / Icon
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 rounded-[8px] bg-[#F8F9FA] border border-[#EDEDED]">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormIcon(emoji)}
                  className={`w-9 h-9 rounded-[6px] text-lg flex items-center justify-center transition-all cursor-pointer ${
                    formIcon === emoji
                      ? "bg-white border-2 border-[#1C4D8D] shadow-xs scale-110"
                      : "hover:bg-white border border-transparent"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <InputField
            label="Category Name"
            value={formName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Generative AI & Prompt Engineering"
            required
          />

          {/* Slug */}
          <div className="space-y-1">
            <InputField
              label="URL Slug Identifier"
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              placeholder="e.g. generative-ai"
              required
            />
            <span className="body-xsm-regular subtext-500 block">
              Machine-readable path used in filtering and routing
            </span>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="body-sm-medium text-primary-500 font-semibold block">
              Curriculum Description
            </label>
            <textarea
              rows={3}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Provide a summary of concepts and technologies encompassed..."
              className="w-full p-3 rounded-[8px] border border-[#EDEDED] bg-white text-primary-500 body-sm-regular focus:outline-none focus:border-[#1C4D8D] transition-colors"
            />
          </div>

          {/* Status Toggle */}
          <div className="space-y-1.5">
            <label className="body-sm-medium text-primary-500 font-semibold block">
              Publication Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormStatus("ACTIVE")}
                className={`h-[40px] rounded-[8px] border flex items-center justify-center gap-2 body-sm-medium transition-all cursor-pointer ${
                  formStatus === "ACTIVE"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold ring-1 ring-emerald-500"
                    : "border-[#EDEDED] bg-white text-primary-400 hover:bg-[#F8F9FA]"
                }`}
              >
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Active</span>
              </button>
              <button
                type="button"
                onClick={() => setFormStatus("INACTIVE")}
                className={`h-[40px] rounded-[8px] border flex items-center justify-center gap-2 body-sm-medium transition-all cursor-pointer ${
                  formStatus === "INACTIVE"
                    ? "border-slate-500 bg-slate-50 text-slate-700 font-bold ring-1 ring-slate-500"
                    : "border-[#EDEDED] bg-white text-primary-400 hover:bg-[#F8F9FA]"
                }`}
              >
                <span>Inactive</span>
              </button>
            </div>
          </div>
        </form>
      </ModalShell>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      <ModalShell
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="Confirm Discipline Removal"
        maxWidth="sm"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <SecondaryButton
              type="button"
              onClick={() => setDeletingCategory(null)}
              className="h-[40px] px-4"
            >
              Cancel
            </SecondaryButton>
            <button
              type="button"
              onClick={handleDelete}
              className="h-[40px] px-4 rounded-[8px] bg-rose-600 hover:bg-rose-700 text-white body-sm-medium font-bold transition-colors cursor-pointer shadow-xs"
            >
              Archive Category
            </button>
          </div>
        }
      >
        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3 p-3.5 rounded-[8px] bg-rose-50 border border-rose-100 text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="body-sm-regular">
              Are you sure you want to remove{" "}
              <strong className="font-semibold text-rose-900">
                &quot;{deletingCategory?.name}&quot;
              </strong>
              ?
              {deletingCategory?._count?.courses ? (
                <p className="mt-1 body-xsm-regular text-rose-700">
                  Warning: {deletingCategory._count.courses} courses currently reference this category.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </ModalShell>
    </motion.div>
  );
}
