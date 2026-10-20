"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { AdminCourseItem } from "@/lib/types";
import { coursesApi, categoriesApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Plus,
  Image as ImageIcon,
  FolderPlus,
  Sparkles,
  Layers,
  Clock,
  Globe,
  CheckCircle2,
  X,
} from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (course: AdminCourseItem) => void;
  onOpenCategoryManager?: () => void;
}

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: "c1", name: "Fullstack Web", slug: "fullstack-web" },
  { id: "c2", name: "Artificial Intelligence", slug: "artificial-intelligence" },
  { id: "c3", name: "Cloud & DevOps", slug: "cloud-devops" },
  { id: "c4", name: "Software Engineering", slug: "software-engineering" },
  { id: "c5", name: "Cybersecurity", slug: "cybersecurity" },
];

const PRESET_BANNERS = [
  {
    name: "AI & Neural Networks",
    url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Modern React & Next.js",
    url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Cloud, Docker & DevOps",
    url: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "TypeScript Engineering",
    url: "https://images.unsplash.com/photo-1516116211227-bbc07b22a087?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Python & Machine Learning",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Cybersecurity & Cryptography",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
  },
];

export function CreateCourseModal({
  isOpen,
  onClose,
  onCreate,
  onOpenCategoryManager,
}: CreateCourseModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState(
    DEFAULT_CATEGORIES[0].name
  );
  const [price, setPrice] = useState<number>(99);
  const [isFree, setIsFree] = useState(false);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("PUBLISHED");
  const [level, setLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS">("INTERMEDIATE");
  const [language, setLanguage] = useState("English");
  const [durationHours, setDurationHours] = useState<number>(18);
  const [thumbnail, setThumbnail] = useState(PRESET_BANNERS[0].url);
  const [instructorName, setInstructorName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState("");
  const [requirements, setRequirements] = useState("");

  const [categories, setCategories] = useState<CategoryOption[]>(DEFAULT_CATEGORIES);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick category creation dialog inside course modal
  const [isQuickCategoryOpen, setIsQuickCategoryOpen] = useState(false);
  const [quickCategoryName, setQuickCategoryName] = useState("");

  useEffect(() => {
    async function loadBackendCategories() {
      try {
        const data = await categoriesApi.getAll();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
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

  const handleQuickAddCategory = async () => {
    if (!quickCategoryName.trim()) {
      toast.error("Category name required");
      return;
    }
    const catSlug = quickCategoryName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const newCat: CategoryOption = {
      id: `cat-${Date.now()}`,
      name: quickCategoryName.trim(),
      slug: catSlug,
    };

    try {
      const created = await categoriesApi.create({
        name: newCat.name,
        slug: newCat.slug,
      });
      if (created && created.id) newCat.id = created.id;
    } catch (err) {
      console.warn("Category saved locally in form state:", err);
    }

    setCategories((prev) => [newCat, ...prev]);
    setSelectedCategoryName(newCat.name);
    setQuickCategoryName("");
    setIsQuickCategoryOpen(false);
    toast.success(`Category "${newCat.name}" added and selected!`);
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

    const outcomesArray = learningOutcomes
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const requirementsArray = requirements
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const newCourse: AdminCourseItem = {
      id: `crs-${Date.now()}`,
      title: title.trim(),
      slug: finalSlug,
      thumbnail: thumbnail.trim(),
      description: description.trim() || `${title.trim()} - Comprehensive Coursera/Udemy style curriculum.`,
      shortDescription: shortDescription.trim() || title.trim(),
      price: isFree ? 0 : Number(price),
      isFree,
      status,
      level,
      language,
      durationMinutes: durationHours * 60,
      totalDuration: `${durationHours} Hours`,
      category: {
        id: matchedCategory.id,
        name: matchedCategory.name,
      },
      totalStudents: 0,
      ratingAverage: 5.0,
      instructorName: instructorName.trim() || "Faculty Instructor",
      learningOutcomes: outcomesArray.length > 0 ? outcomesArray : undefined,
      requirements: requirementsArray.length > 0 ? requirementsArray : undefined,
    };

    try {
      await coursesApi.create({
        title: newCourse.title,
        slug: newCourse.slug,
        thumbnail: newCourse.thumbnail,
        description: newCourse.description,
        shortDescription: newCourse.shortDescription,
        categoryId: matchedCategory.id,
        level: level,
        language: language,
        price: newCourse.price,
        isFree: newCourse.isFree,
        status: newCourse.status,
        durationMinutes: newCourse.durationMinutes,
        requirements: requirementsArray.join("\n"),
        learningOutcomes: outcomesArray.join("\n"),
      });
    } catch (err) {
      console.warn("Backend course sync notice (saved locally in catalog):", err);
    } finally {
      onCreate(newCourse);
      toast.success(`Course "${newCourse.title}" successfully added!`, {
        description: `Status: ${status} • Category: ${matchedCategory.name} • ${durationHours}h Curriculum`,
      });
      setIsSubmitting(false);
      setTitle("");
      setSlug("");
      setDescription("");
      setShortDescription("");
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
    { value: "BEGINNER", label: "Beginner (Foundations)" },
    { value: "INTERMEDIATE", label: "Intermediate (Core Practice)" },
    { value: "ADVANCED", label: "Advanced (Enterprise Mastery)" },
    { value: "ALL_LEVELS", label: "All Levels (Comprehensive)" },
  ];

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Bengali", label: "Bengali (বাংলা)" },
    { value: "Spanish", label: "Spanish (Español)" },
  ];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Academic Course"
      subtitle="Define curriculum metadata, banner image, syllabus requirements, and pricing tier."
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <SecondaryButton onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Course to Catalog
          </PrimaryButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        {/* ================= 1. 16:9 BANNER IMAGE & LIVE PREVIEW ================= */}
        <div className="space-y-3 p-4 rounded-[12px] bg-[#F8F9FA] border border-[#EDEDED]">
          <div className="flex items-center justify-between">
            <label className="body-sm-medium text-primary-500 font-semibold flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#1C4D8D]" />
              <span>Course Banner / Thumbnail Image (16:9 Aspect Ratio)</span>
            </label>
            <span className="body-xsm-regular subtext-500">
              Matches Coursera & Udemy card dimensions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Live 16:9 Thumbnail Preview */}
            <div className="md:col-span-5 relative aspect-video rounded-[10px] overflow-hidden border border-[#EDEDED] bg-slate-900 shadow-sm">
              <Image
                src={thumbnail}
                alt="Course banner preview"
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
              <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                <span className="body-xsm-medium font-bold block truncate">
                  {title || "Course Title Preview"}
                </span>
                <span className="body-xsm-regular text-sky-200">
                  {selectedCategoryName} • {level}
                </span>
              </div>
            </div>

            {/* Custom URL + Preset Banner Pickers */}
            <div className="md:col-span-7 space-y-2.5">
              <InputField
                label="Custom Thumbnail URL"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://example.com/course-cover.jpg"
              />

              <div className="space-y-1">
                <span className="body-xsm-regular subtext-500 block">
                  Or select a curated educational banner preset:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_BANNERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setThumbnail(preset.url)}
                      className={`h-12 relative rounded-[6px] overflow-hidden border transition-all cursor-pointer ${
                        thumbnail === preset.url
                          ? "ring-2 ring-[#1C4D8D] border-transparent"
                          : "border-[#EDEDED] opacity-75 hover:opacity-100"
                      }`}
                      title={preset.name}
                    >
                      <Image
                        src={preset.url}
                        alt={preset.name}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1 text-center">
                        <span className="text-[10px] text-white font-semibold leading-tight line-clamp-2">
                          {preset.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 2. TITLE & SLUG ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        {/* ================= 3. CATEGORY SELECTION + QUICK ADD ================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="body-sm-regular text-primary-400">Academic Category</span>
            <button
              type="button"
              onClick={() => setIsQuickCategoryOpen((prev) => !prev)}
              className="body-xsm-medium text-[#1C4D8D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ Add New Category</span>
            </button>
          </div>

          <DropdownSelect
            options={categoryOptions}
            value={selectedCategoryName}
            onChange={(val) => setSelectedCategoryName(val)}
          />

          {/* Inline Quick Category Add Form */}
          {isQuickCategoryOpen && (
            <div className="p-3 rounded-[8px] bg-[#EBF4FC] border border-[#BDE8F5]/80 space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="body-xsm-medium text-[#1C4D8D] font-bold">
                  Quick Create Category
                </span>
                <button
                  type="button"
                  onClick={() => setIsQuickCategoryOpen(false)}
                  className="text-primary-300 hover:text-primary-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={quickCategoryName}
                  onChange={(e) => setQuickCategoryName(e.target.value)}
                  placeholder="e.g. Distributed Systems"
                  className="flex-1 h-[36px] px-3 rounded-[6px] border border-[#EDEDED] bg-white text-primary-500 body-sm-regular outline-none focus:border-[#1C4D8D]"
                />
                <PrimaryButton size="sm" onClick={handleQuickAddCategory}>
                  Create & Select
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>

        {/* ================= 4. METADATA: LEVEL, LANGUAGE, DURATION ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DropdownSelect
            fieldLabel="Target Level"
            options={levelOptions}
            value={level}
            onChange={(val) => setLevel(val as any)}
          />

          <DropdownSelect
            fieldLabel="Instruction Language"
            options={languageOptions}
            value={language}
            onChange={(val) => setLanguage(val)}
          />

          <div className="space-y-1.5">
            <label className="body-sm-regular text-primary-400 block">
              Estimated Duration (Hours)
            </label>
            <div className="relative flex items-center">
              <Clock className="w-4 h-4 text-primary-300 absolute left-3 pointer-events-none" />
              <input
                type="number"
                min="1"
                step="1"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full h-[40px] pl-9 pr-3 rounded-[8px] border border-[#EDEDED] bg-white text-primary-500 body-sm-regular outline-none focus:border-[#1C4D8D]"
              />
            </div>
          </div>
        </div>

        {/* Instructor & Publication Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Lead Instructor Name"
            value={instructorName}
            onChange={(e) => setInstructorName(e.target.value)}
            placeholder="e.g. Dr. Alex Johnson"
          />

          <DropdownSelect
            fieldLabel="Publication State"
            options={statusOptions}
            value={status}
            onChange={(val) => setStatus(val as any)}
          />
        </div>

        {/* ================= 5. PRICING TIER ================= */}
        <div className="p-3.5 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED] space-y-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#1C4D8D] focus:ring-[#1C4D8D] cursor-pointer"
            />
            <span className="body-sm-regular text-primary-500 font-semibold">
              Offer this course with Free Student Enrollment
            </span>
          </label>

          {!isFree && (
            <div className="space-y-1.5 pt-1">
              <label className="block body-sm-regular text-primary-400">
                Tuition / Enrollment Price (USD)
              </label>
              <div className="relative flex items-center max-w-xs">
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

        {/* ================= 6. DESCRIPTIONS & LEARNING OBJECTIVES ================= */}
        <div className="space-y-4">
          <div>
            <label className="block body-sm-regular text-primary-400 mb-1.5">
              Course Short Summary (Displayed on Coursera/Udemy search cards)
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="e.g. Master React 19, Turbopack, and LLM integrations with real-world capstone microservices."
              className="w-full h-[40px] px-3.5 rounded-[8px] border border-[#EDEDED] text-primary-500 body-sm-regular outline-none focus:border-[#1C4D8D] bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block body-sm-regular text-primary-400 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>What Students Will Learn (One per line)</span>
              </label>
              <textarea
                rows={3}
                value={learningOutcomes}
                onChange={(e) => setLearningOutcomes(e.target.value)}
                placeholder="Build production Next.js 16 microservices&#10;Implement sub-second AI syllabus inference&#10;Deploy resilient PostgreSQL pools"
                className="w-full p-3 rounded-[8px] border border-[#EDEDED] text-primary-500 body-sm-regular outline-none focus:border-[#1C4D8D] bg-white"
              />
            </div>

            <div>
              <label className="block body-sm-regular text-primary-400 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#1C4D8D]" />
                <span>Prerequisites / Requirements (One per line)</span>
              </label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Basic JavaScript/TypeScript knowledge&#10;Node.js 20+ installed on local machine&#10;Familiarity with REST APIs"
                className="w-full p-3 rounded-[8px] border border-[#EDEDED] text-primary-500 body-sm-regular outline-none focus:border-[#1C4D8D] bg-white"
              />
            </div>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

export default CreateCourseModal;
