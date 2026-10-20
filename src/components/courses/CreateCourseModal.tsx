"use client";

import React, { useState, useEffect } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { AdminCourseItem } from "@/lib/types";
import { coursesApi, categoriesApi } from "@/lib/api";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: "c1", name: "Fullstack Web" },
  { id: "c2", name: "Artificial Intelligence" },
  { id: "c3", name: "Cloud & DevOps" },
  { id: "c4", name: "Software Engineering" },
  { id: "c5", name: "Mobile Development" },
];

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (course: AdminCourseItem) => void;
}

export function CreateCourseModal({
  isOpen,
  onClose,
  onCreate,
}: CreateCourseModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>(DEFAULT_CATEGORIES);
  const [selectedCategoryName, setSelectedCategoryName] = useState("Fullstack Web");
  const [level, setLevel] = useState("Intermediate");
  const [price, setPrice] = useState(99);
  const [isFree, setIsFree] = useState(false);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("PUBLISHED");
  const [instructorName, setInstructorName] = useState("Faculty Instructor");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadBackendCategories() {
      try {
        const data = await categoriesApi.getAll();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((c: any) => ({
            id: c.id,
            name: c.name,
          }));
          const map = new Map<string, CategoryOption>();
          DEFAULT_CATEGORIES.forEach((item) => map.set(item.name, item));
          formatted.forEach((item: CategoryOption) => map.set(item.name, item));
          setCategories(Array.from(map.values()));
        }
      } catch {
        // Keep defaults
      }
    }
    if (isOpen) {
      loadBackendCategories();
    }
  }, [isOpen]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Course title is required.");
      return;
    }

    const finalSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");

    const matchedCategory =
      categories.find((c) => c.name === selectedCategoryName) || categories[0];

    setIsSubmitting(true);

    const newCourse: AdminCourseItem = {
      id: `crs-${Date.now()}`,
      title: title.trim(),
      slug: finalSlug,
      price: isFree ? 0 : Number(price),
      isFree,
      status,
      category: {
        id: matchedCategory.id,
        name: matchedCategory.name,
      },
      totalStudents: 0,
      ratingAverage: 5.0,
      instructorName: instructorName.trim() || "Faculty Instructor",
    };

    try {
      await coursesApi.create({
        title: newCourse.title,
        slug: newCourse.slug,
        description: description.trim() || `${newCourse.title} - comprehensive curriculum.`,
        shortDescription: description.trim().slice(0, 100) || newCourse.title,
        categoryId: matchedCategory.id,
        level: level,
        language: "English",
        price: newCourse.price,
        isFree: newCourse.isFree,
        durationMinutes: 90,
      });
    } catch (err) {
      console.warn("Backend course sync notice (saved locally in catalog):", err);
    } finally {
      onCreate(newCourse);
      toast.success(`Course "${newCourse.title}" successfully added!`, {
        description: `Status: ${status} • Category: ${matchedCategory.name}`,
      });
      setIsSubmitting(false);
      setTitle("");
      setSlug("");
      setDescription("");
      onClose();
    }
  };

  const categoryOptions = categories.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const statusOptions = [
    { value: "PUBLISHED", label: "Published (Available to students)" },
    { value: "DRAFT", label: "Draft (Under construction)" },
  ];

  const levelOptions = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Academic Course"
      subtitle="Define core course metadata, pricing tier, and initial publication state."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <SecondaryButton onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={<Plus />}
          >
            Add Course to Catalog
          </PrimaryButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <InputField
          label="Course Title"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="e.g. Next.js 16 Fullstack Engineering"
        />

        <InputField
          label="URL Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g. nextjs-16-fullstack-engineering"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DropdownSelect
            fieldLabel="Academic Category"
            options={categoryOptions}
            value={selectedCategoryName}
            onChange={(val) => setSelectedCategoryName(val)}
          />

          <DropdownSelect
            fieldLabel="Publication Status"
            options={statusOptions}
            value={status}
            onChange={(val) => setStatus(val as "DRAFT" | "PUBLISHED")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DropdownSelect
            fieldLabel="Difficulty Level"
            options={levelOptions}
            value={level}
            onChange={(val) => setLevel(val)}
          />

          <InputField
            label="Instructor Name"
            value={instructorName}
            onChange={(e) => setInstructorName(e.target.value)}
            placeholder="e.g. Dr. Alex Johnson"
          />
        </div>

        {/* Pricing Options */}
        <div className="p-3.5 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED] space-y-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#1C4D8D] focus:ring-[#1C4D8D] cursor-pointer"
            />
            <span className="body-sm-regular text-primary-500 font-medium">
              Offer this course as Free
            </span>
          </label>

          {!isFree && (
            <div className="space-y-1.5 pt-1">
              <label className="block body-sm-regular text-primary-400">
                Course Price (USD)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-primary-300 font-bold">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full h-[40px] pl-8 pr-4 rounded-[8px] border border-[#EDEDED] bg-white text-primary-500 body-sm-regular outline-none focus:border-[#1C4D8D]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block body-sm-regular text-primary-400 mb-2">
            Short Overview
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of curriculum objectives and syllabus scope..."
            className="w-full p-3 rounded-[8px] border border-[#EDEDED] text-primary-500 body-sm-regular outline-none focus:border-[#1C4D8D] bg-white"
          />
        </div>
      </form>
    </ModalShell>
  );
}

export default CreateCourseModal;
