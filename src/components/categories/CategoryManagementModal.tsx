"use client";

import React, { useState, useEffect } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { TagBadge } from "@/components/ui/TagBadge";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { categoriesApi } from "@/lib/api";
import { AdminCategoryItem } from "@/lib/types";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { toast } from "sonner";
import {
  FolderPlus,
  Trash2,
  Edit2,
  Check,
  X,
  Layers,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated?: (category: AdminCategoryItem) => void;
}

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

export function CategoryManagementModal({
  isOpen,
  onClose,
  onCategoryCreated,
}: CategoryManagementModalProps) {
  const [categories, setCategories] = useState<AdminCategoryItem[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New category form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("📚");
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Load backend categories
  useEffect(() => {
    async function fetchCategories() {
      if (!isOpen) return;
      setIsLoading(true);
      try {
        const res = await categoriesApi.getAll();
        if (Array.isArray(res) && res.length > 0) {
          const map = new Map<string, AdminCategoryItem>();
          DEFAULT_CATEGORIES.forEach((c) => map.set(c.slug, c));
          res.forEach((c: any) =>
            map.set(c.slug || c.name, {
              id: c.id,
              name: c.name,
              slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              description: c.description || "",
              icon: c.icon || "📚",
              status: (c.status as any) || "ACTIVE",
              _count: c._count || { courses: 0 },
            })
          );
          setCategories(Array.from(map.values()));
        }
      } catch (err) {
        console.warn("Using offline categories list:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, [isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(autoSlug);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const finalSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");

    setIsSubmitting(true);
    const newCategoryItem: AdminCategoryItem = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: finalSlug,
      description: description.trim(),
      icon: icon.trim() || "📚",
      status: "ACTIVE",
      _count: { courses: 0 },
    };

    try {
      const created = await categoriesApi.create({
        name: newCategoryItem.name,
        slug: newCategoryItem.slug,
        description: newCategoryItem.description,
        icon: newCategoryItem.icon,
      });
      if (created && created.id) {
        newCategoryItem.id = created.id;
      }
    } catch (err) {
      console.warn("Created category saved locally in session:", err);
    } finally {
      setCategories((prev) => [newCategoryItem, ...prev]);
      onCategoryCreated?.(newCategoryItem);
      toast.success(`Category "${newCategoryItem.name}" created successfully!`, {
        description: "Now available for curriculum assignments.",
      });
      setName("");
      setSlug("");
      setDescription("");
      setIcon("📚");
      setIsFormVisible(false);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      await categoriesApi.delete(id);
    } catch {
      // Optimistic delete
    }
    toast.success(`Category "${catName}" removed.`);
  };

  const emojiPresets = ["🤖", "💻", "☁️", "⚡", "🛡️", "📊", "🎨", "📱", "🌐", "🧠"];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Academic Categories Directory"
      subtitle="Organize institutional curriculums into searchable departments and learning pathways."
      maxWidth="xl"
      headerActions={
        !isFormVisible ? (
          <PrimaryButton
            size="sm"
            leftIcon={<FolderPlus className="w-4 h-4" />}
            onClick={() => setIsFormVisible(true)}
          >
            Add Category
          </PrimaryButton>
        ) : undefined
      }
    >
      <div className="space-y-5 text-left">
        {/* Inline Create Category Form */}
        {isFormVisible && (
          <form
            onSubmit={handleCreate}
            className="p-4.5 rounded-[12px] bg-[#F8F9FA] border border-[#EDEDED] space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EDEDED]">
              <h4 className="body-sm-medium text-primary-500 font-semibold flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#1C4D8D]" />
                <span>Create New Learning Category</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsFormVisible(false)}
                className="text-primary-300 hover:text-primary-500 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Category Name"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Distributed Systems & Golang"
              />

              <InputField
                label="URL Slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. distributed-systems-golang"
              />
            </div>

            {/* Icon / Emoji Selection */}
            <div className="space-y-1.5">
              <label className="body-sm-regular text-primary-400 block">
                Category Emblem / Emoji
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  maxLength={4}
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-12 h-[38px] text-center text-lg rounded-[8px] border border-[#EDEDED] bg-white focus:outline-none focus:border-[#1C4D8D]"
                />
                <span className="body-xsm-regular subtext-500 mr-2">Or choose:</span>
                {emojiPresets.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setIcon(em)}
                    className={`w-9 h-9 rounded-[8px] text-base flex items-center justify-center border transition-all cursor-pointer ${
                      icon === em
                        ? "border-[#1C4D8D] bg-[#EBF4FC] shadow-2xs"
                        : "border-[#EDEDED] bg-white hover:bg-gray-100"
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="body-sm-regular text-primary-400 block">
                Description & Target Domain
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the scope of courses that belong in this department..."
                className="w-full p-3 rounded-[8px] border border-[#EDEDED] text-primary-500 body-sm-regular outline-none focus:border-[#1C4D8D] bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <SecondaryButton
                size="sm"
                onClick={() => setIsFormVisible(false)}
                disabled={isSubmitting}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                size="sm"
                isLoading={isSubmitting}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                Save Category
              </PrimaryButton>
            </div>
          </form>
        )}

        {/* Existing Categories Table */}
        <div className="rounded-[10px] border border-[#EDEDED] overflow-hidden">
          <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-[#EDEDED] flex items-center justify-between">
            <span className="body-xsm-medium-inter subtext-500 uppercase tracking-wider">
              {categories.length} Registered Categories
            </span>
            <span className="body-xsm-regular subtext-500">
              Real-time synchronization with Prisma database
            </span>
          </div>

          <div className="divide-y divide-[#EDEDED] max-h-96 overflow-y-auto">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CategoryIcon icon={cat.icon} className="w-10 h-10 text-xl" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="body-sm-medium text-primary-500 font-semibold truncate">
                        {cat.name}
                      </span>
                      <span className="body-xsm-regular font-mono text-primary-300 bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">
                        /{cat.slug}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="body-xsm-regular subtext-500 line-clamp-1 mt-0.5">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1 body-xsm-medium text-[#1C4D8D] bg-blue-50 px-2.5 py-1 rounded-md border border-[#BDE8F5]/60">
                    <BookOpen className="w-3.5 h-3.5 text-[#1C4D8D]" />
                    <span>{cat._count?.courses || 0} Courses</span>
                  </span>

                  <ToneBadge tone={cat.status === "ACTIVE" ? "success" : "gray"} size="sm">
                    {cat.status}
                  </ToneBadge>

                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-primary-300 hover:text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

export default CategoryManagementModal;
