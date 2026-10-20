"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Sparkles,
  BookOpen,
  Users,
  Star,
  Cpu,
  LayoutGrid,
  List,
  X,
  RotateCcw,
  Trash2,
  FolderPlus,
  Layers,
  ArrowRight,
  Clock,
} from "lucide-react";
import { CourseCard } from "./CourseCard";
import { CreateCourseModal } from "./CreateCourseModal";
import { AiSyllabusModal } from "./AiSyllabusModal";
import { CourseDetailsModal } from "./CourseDetailsModal";
import { CategoryManagementModal } from "@/components/categories/CategoryManagementModal";
import { StatGroupCard } from "@/components/ui/StatGroupCard";
import { StatItem } from "@/components/ui/StatCard";
import { DataTable, ColumnDef } from "@/components/ui/Datatable";
import { PillTabs, PillTabItem } from "@/components/ui/PillTabs";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { TagBadge } from "@/components/ui/TagBadge";
import { TwoLineCell } from "@/components/ui/TwoLineCell";
import { RowActionButton } from "@/components/ui/RowActionButton";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { Pagination } from "@/components/ui/Pagination";
import { AdminCourseItem } from "@/lib/types";
import { coursesApi, categoriesApi } from "@/lib/api";
import { toast } from "sonner";

const INITIAL_COURSES: AdminCourseItem[] = [
  {
    id: "crs-1",
    title: "Mastering Next.js 16 & Enterprise Architecture",
    slug: "nextjs-16-enterprise",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
    shortDescription:
      "Master React 19 Server Components, Turbopack, and microservices architecture.",
    price: 99,
    isFree: false,
    status: "PUBLISHED",
    level: "ADVANCED",
    language: "English",
    durationMinutes: 1080,
    totalDuration: "18 Hours",
    category: { id: "c1", name: "Fullstack Web" },
    totalStudents: 2840,
    ratingAverage: 4.9,
    instructorName: "Tanvir Ahmed",
  },
  {
    id: "crs-2",
    title: "Advanced Gemini 3.8 & AI Agent Architecture",
    slug: "gemini-ai-agent-engineering",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    shortDescription:
      "Build autonomous agents with Gemini 3.8 Flash SDK and sub-second Groq pipelines.",
    price: 129,
    isFree: false,
    status: "PUBLISHED",
    level: "INTERMEDIATE",
    language: "English",
    durationMinutes: 840,
    totalDuration: "14 Hours",
    category: { id: "c2", name: "Artificial Intelligence" },
    totalStudents: 1950,
    ratingAverage: 4.95,
    instructorName: "Imam Hossain",
  },
  {
    id: "crs-3",
    title: "Foundations of TypeScript 6 & Clean Code",
    slug: "typescript-foundations",
    thumbnail:
      "https://images.unsplash.com/photo-1516116211227-bbc07b22a087?q=80&w=800&auto=format&fit=crop",
    shortDescription:
      "Type safety, generics, decorators, and clean domain-driven architecture.",
    price: 0,
    isFree: true,
    status: "PUBLISHED",
    level: "BEGINNER",
    language: "English",
    durationMinutes: 540,
    totalDuration: "9 Hours",
    category: { id: "c3", name: "Software Engineering" },
    totalStudents: 4890,
    ratingAverage: 4.8,
    instructorName: "Dr. Farhana Yasmin",
  },
  {
    id: "crs-4",
    title: "Docker, Kubernetes & Production CI/CD Pipelines",
    slug: "devops-docker-kubernetes",
    thumbnail:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop",
    shortDescription:
      "Container orchestration, multi-stage builds, and cloud deployment pipelines.",
    price: 79,
    isFree: false,
    status: "PUBLISHED",
    level: "INTERMEDIATE",
    language: "English",
    durationMinutes: 960,
    totalDuration: "16 Hours",
    category: { id: "c4", name: "Cloud & DevOps" },
    totalStudents: 1420,
    ratingAverage: 4.85,
    instructorName: "Engr. Mahmudul Huq",
  },
  {
    id: "crs-5",
    title: "Fullstack Python Machine Learning with PyTorch",
    slug: "python-ml-pytorch",
    thumbnail:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    shortDescription:
      "Deep learning neural networks, tensor operations, and model deployment.",
    price: 110,
    isFree: false,
    status: "PUBLISHED",
    level: "ADVANCED",
    language: "English",
    durationMinutes: 1200,
    totalDuration: "20 Hours",
    category: { id: "c2", name: "Artificial Intelligence" },
    totalStudents: 980,
    ratingAverage: 4.9,
    instructorName: "Nusrat Jahan",
  },
  {
    id: "crs-6",
    title: "Microservices with NestJS, RabbitMQ & Redis",
    slug: "nestjs-microservices-rabbitmq",
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    shortDescription:
      "Event-driven architecture, distributed queues, caching, and resilient database pools.",
    price: 89,
    isFree: false,
    status: "DRAFT",
    level: "ADVANCED",
    language: "English",
    durationMinutes: 720,
    totalDuration: "12 Hours",
    category: { id: "c1", name: "Fullstack Web" },
    totalStudents: 0,
    ratingAverage: 0,
    instructorName: "Lead DevOps Specialist",
  },
];

const DEFAULT_CATEGORIES = [
  "All Categories",
  "Artificial Intelligence",
  "Fullstack Web",
  "Cloud & DevOps",
  "Software Engineering",
  "Cybersecurity",
];

interface CoursesGridClientProps {
  isCreateModalOpen?: boolean;
  setIsCreateModalOpen?: (open: boolean) => void;
  isAiModalOpen?: boolean;
  setIsAiModalOpen?: (open: boolean) => void;
  isCategoryModalOpen?: boolean;
  setIsCategoryModalOpen?: (open: boolean) => void;
}

export function CoursesGridClient({
  isCreateModalOpen: propIsCreateModalOpen,
  setIsCreateModalOpen: propSetIsCreateModalOpen,
  isAiModalOpen: propIsAiModalOpen,
  setIsAiModalOpen: propSetIsAiModalOpen,
  isCategoryModalOpen: propIsCategoryModalOpen,
  setIsCategoryModalOpen: propSetIsCategoryModalOpen,
}: CoursesGridClientProps = {}) {
  const [courses, setCourses] = useState<AdminCourseItem[]>(INITIAL_COURSES);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [internalCreateModalOpen, setInternalCreateModalOpen] = useState(false);
  const [internalAiModalOpen, setInternalAiModalOpen] = useState(false);
  const [internalCategoryModalOpen, setInternalCategoryModalOpen] = useState(false);
  const [aiModalTitle, setAiModalTitle] = useState("");

  const isCreateOpen =
    propIsCreateModalOpen !== undefined
      ? propIsCreateModalOpen
      : internalCreateModalOpen;
  const setCreateOpen = propSetIsCreateModalOpen || setInternalCreateModalOpen;

  const isAiOpen =
    propIsAiModalOpen !== undefined ? propIsAiModalOpen : internalAiModalOpen;
  const setAiOpen = propSetIsAiModalOpen || setInternalAiModalOpen;

  const isCategoryOpen =
    propIsCategoryModalOpen !== undefined
      ? propIsCategoryModalOpen
      : internalCategoryModalOpen;
  const setCategoryOpen =
    propSetIsCategoryModalOpen || setInternalCategoryModalOpen;

  // Selected course for full Coursera / Udemy Syllabus & Details Inspector
  const [selectedCourseForDetails, setSelectedCourseForDetails] =
    useState<AdminCourseItem | null>(null);

  // Active action menu anchor for table view
  const [activeMenuCourse, setActiveMenuCourse] = useState<AdminCourseItem | null>(null);
  const [activeMenuAnchor, setActiveMenuAnchor] = useState<HTMLElement | null>(null);

  // Sync catalog and categories from backend API on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [coursesRes, catsRes] = await Promise.allSettled([
          coursesApi.getAll(),
          categoriesApi.getAll(),
        ]);

        if (catsRes.status === "fulfilled" && Array.isArray(catsRes.value)) {
          const catNames = catsRes.value.map((c: any) => c.name);
          const unique = Array.from(
            new Set(["All Categories", ...catNames, ...DEFAULT_CATEGORIES.slice(1)])
          );
          setCategories(unique);
        }

        if (coursesRes.status === "fulfilled") {
          const apiCourses = Array.isArray(coursesRes.value)
            ? coursesRes.value
            : coursesRes.value?.data;

          if (Array.isArray(apiCourses) && apiCourses.length > 0) {
            const formatted: AdminCourseItem[] = apiCourses.map((c: any) => ({
              id: c.id,
              title: c.title,
              slug: c.slug,
              thumbnail: c.thumbnail,
              shortDescription: c.shortDescription || c.description?.slice(0, 100),
              price: Number(c.price || 0),
              isFree: Boolean(c.isFree),
              status: c.status || "PUBLISHED",
              level: c.level || "INTERMEDIATE",
              language: c.language || "English",
              durationMinutes: Number(c.durationMinutes || 720),
              totalDuration: `${Math.round((c.durationMinutes || 720) / 60)} Hours`,
              category: {
                id: c.category?.id || "cat-gen",
                name: c.category?.name || "General",
              },
              totalStudents: c.totalStudents || 0,
              ratingAverage: Number(c.ratingAverage || 5.0),
              instructorName: c.instructorName || "Faculty Instructor",
              modules: c.modules,
            }));

            // Merge with initials so user always sees rich mock data while backend builds up
            const map = new Map<string, AdminCourseItem>();
            INITIAL_COURSES.forEach((c) => map.set(c.id, c));
            formatted.forEach((c) => map.set(c.id, c));
            setCourses(Array.from(map.values()));
          }
        }
      } catch (err) {
        console.warn("Using offline / initial courses state:", err);
      }
    }

    loadBackendData();
  }, []);

  // Filter & Search Logic
  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.category?.name.toLowerCase().includes(search.toLowerCase()) ||
        (course.instructorName &&
          course.instructorName.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All Categories" ||
        course.category?.name === selectedCategory;

      const matchesStatus =
        selectedStatus === "ALL" || course.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "POPULAR") return b.totalStudents - a.totalStudents;
      if (sortBy === "RATING") return b.ratingAverage - a.ratingAverage;
      if (sortBy === "PRICE_ASC") return a.price - b.price;
      if (sortBy === "PRICE_DESC") return b.price - a.price;
      return 0; // NEWEST
    });

  const totalPages = Math.ceil(filteredCourses.length / pageSize) || 1;
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDeleteCourse = async (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    try {
      await coursesApi.delete(id);
    } catch {
      // Local delete is optimistic
    }
    toast.success("Course archived successfully");
  };

  const handleOpenAiOutline = (course?: AdminCourseItem) => {
    setAiModalTitle(course ? course.title : "");
    setAiOpen(true);
  };

  const handleApplyAiOutline = (title: string, outline: any) => {
    const newCourse: AdminCourseItem = {
      id: `crs-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      thumbnail:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
      price: 99,
      isFree: false,
      status: "DRAFT",
      level: (outline.level as any) || "INTERMEDIATE",
      language: "English",
      durationMinutes: 720,
      totalDuration: "12 Hours",
      category: { id: "cat-ai", name: "Artificial Intelligence" },
      totalStudents: 0,
      ratingAverage: 5.0,
      instructorName: "AI Co-Instructor",
      modules: outline.modules?.map((m: any, mIdx: number) => ({
        id: `mod-${mIdx + 1}`,
        title: m.title,
        order: mIdx + 1,
        durationMinutes: 60,
        lessons: (m.lessons || []).map((l: string, lIdx: number) => ({
          id: `les-${mIdx + 1}-${lIdx + 1}`,
          title: l,
          durationMinutes: 15,
          order: lIdx + 1,
          type: "VIDEO",
          isPreview: lIdx === 0,
        })),
      })),
    };
    setCourses((prev) => [newCourse, ...prev]);
  };

  // KPI Metrics Strip
  const courseStats: StatItem[] = [
    {
      label: "Total Curriculums",
      value: courses.length.toString(),
      icon: <BookOpen />,
      trend: { direction: "up", value: "+3 new", comparisonLabel: "this month" },
    },
    {
      label: "Enrolled Learners",
      value: courses
        .reduce((acc, curr) => acc + curr.totalStudents, 0)
        .toLocaleString(),
      icon: <Users />,
      trend: { direction: "up", value: "+18.4%", comparisonLabel: "vs last term" },
    },
    {
      label: "Avg Rating Quality",
      value: "4.89 / 5.0",
      icon: <Star />,
      trend: { direction: "up", value: "98.7%", comparisonLabel: "satisfaction" },
    },
    {
      label: "AI Compiled Modules",
      value: "1,420+",
      icon: <Cpu />,
      trend: { direction: "up", value: "99.98%", comparisonLabel: "sub-second" },
    },
  ];

  // PillTabs array
  const pillTabsList: PillTabItem[] = categories.map((cat) => ({
    id: cat,
    label: cat,
  }));

  // List View Columns (Coursera / Udemy style with 16:9 thumbnail preview)
  const listColumns: ColumnDef<AdminCourseItem>[] = [
    {
      key: "title",
      header: "Course Curriculum",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-[300px]">
          <div className="w-16 h-10 rounded-[8px] overflow-hidden relative border border-[#EDEDED] shrink-0 bg-slate-900 shadow-2xs">
            <Image
              src={
                row.thumbnail ||
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=200&auto=format&fit=crop"
              }
              alt={row.title}
              fill
              unoptimized
              className="object-cover"
              sizes="64px"
            />
          </div>
          <TwoLineCell
            title={row.title}
            sub={`${row.level || "Intermediate"} • ${row.instructorName || "Faculty Instructor"}`}
          />
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => (
        <TagBadge
          tag={row.category?.name || "General"}
          bgColor="bg-[#F2F3F3]"
          textColor="text-primary-500 font-semibold"
        />
      ),
    },
    {
      key: "learners",
      header: "Learners",
      render: (row) => (
        <span className="body-sm-regular text-primary-500 font-medium">
          {row.totalStudents.toLocaleString()}
        </span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (row) => (
        <span className="flex items-center gap-1 body-sm-regular font-bold text-amber-600">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{row.ratingAverage > 0 ? row.ratingAverage : "5.0"}</span>
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row) => (
        <span className="body-sm-medium text-primary-500 font-bold">
          {row.isFree ? "Free" : `$${row.price}`}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <ToneBadge
          tone={row.status === "PUBLISHED" ? "green" : "orange"}
          className="body-xsm-medium uppercase tracking-wider font-bold"
        >
          {row.status}
        </ToneBadge>
      ),
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (row) => (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <RowActionButton
            label="Actions"
            onClick={(e) => {
              setActiveMenuCourse(row);
              setActiveMenuAnchor(e.currentTarget);
            }}
          />
        </div>
      ),
    },
  ];

  const tableMenuItems = [
    {
      label: "View Syllabus & Details",
      icon: <Layers className="w-4 h-4 text-[#1C4D8D]" />,
      onClick: () => {
        if (activeMenuCourse) setSelectedCourseForDetails(activeMenuCourse);
      },
    },
    {
      label: "AI Syllabus Builder",
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      onClick: () => {
        if (activeMenuCourse) handleOpenAiOutline(activeMenuCourse);
      },
      className: "text-purple-700 hover:bg-purple-50",
    },
    {
      label: "Archive Course",
      icon: <Trash2 className="w-4 h-4 text-rose-500" />,
      onClick: () => {
        if (activeMenuCourse) handleDeleteCourse(activeMenuCourse.id);
      },
      className: "text-rose-600 hover:bg-rose-50",
    },
  ];

  return (
    <div className="space-y-5 text-left">
      {/* 1. KPI Statistics Strip */}
      <StatGroupCard stats={courseStats} columns={4} />

      {/* 2. Structured Filter & Search Section */}
      <div className="space-y-3">
        {/* ROW 1: Pilltabs in ONE SINGLE LINE */}
        <div className="w-full overflow-x-auto pb-1 scrollbar-none">
          <PillTabs
            tabs={pillTabsList}
            activeId={selectedCategory}
            onChange={(id) => setSelectedCategory(id)}
          />
        </div>

        {/* ROW 2: Bottom Toolbar -> Left Side = Search, Right Side = Filters, Categories & Add Course */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          {/* Bottom Left Side: Search Bar */}
          <div className="w-full sm:w-80 md:w-96">
            <InputField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses, categories, instructors..."
              leftElement={<Search className="w-4 h-4 text-primary-300" />}
              rightElement={
                search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="p-1 text-primary-300 hover:text-primary-500 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : undefined
              }
            />
          </div>

          {/* Bottom Right Side: Filters, Sort, View Switcher & Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end flex-wrap sm:flex-nowrap">
            <div className="w-36">
              <DropdownSelect
                label="All Statuses"
                options={[
                  { value: "ALL", label: "All Statuses" },
                  { value: "PUBLISHED", label: "Published" },
                  { value: "DRAFT", label: "Drafts" },
                ]}
                value={selectedStatus}
                onChange={(val) => setSelectedStatus(val)}
              />
            </div>

            <div className="w-44">
              <DropdownSelect
                label="Sort By"
                options={[
                  { value: "NEWEST", label: "Newest First" },
                  { value: "POPULAR", label: "Most Learners" },
                  { value: "RATING", label: "Highest Rated" },
                  { value: "PRICE_ASC", label: "Price: Low to High" },
                  { value: "PRICE_DESC", label: "Price: High to Low" },
                ]}
                value={sortBy}
                onChange={(val) => setSortBy(val)}
              />
            </div>

            {/* View Switcher */}
            <div className="flex items-center p-1 bg-[#F3F4F6] rounded-[8px] border border-[#EDEDED] h-[40px]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-[6px] transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-[#1C4D8D] shadow-2xs font-semibold"
                    : "text-primary-300 hover:text-primary-500"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-[6px] transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-[#1C4D8D] shadow-2xs font-semibold"
                    : "text-primary-300 hover:text-primary-500"
                }`}
                title="List table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <SecondaryButton
              leftIcon={<FolderPlus className="w-4 h-4 text-[#1C4D8D]" />}
              onClick={() => setCategoryOpen(true)}
            >
              Categories
            </SecondaryButton>

            <PrimaryButton
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setCreateOpen(true)}
            >
              Add Course
            </PrimaryButton>
          </div>
        </div>

        {/* Clean Metadata Subline */}
        <div className="flex items-center justify-between body-xsm-regular subtext-500 px-1 pt-1">
          <span>
            Showing <strong className="text-primary-500 font-medium">{filteredCourses.length}</strong> of{" "}
            <strong className="text-primary-500 font-medium">{courses.length}</strong> curriculums
          </span>
          <span>
            {selectedCategory} • {selectedStatus === "ALL" ? "All Statuses" : selectedStatus}
          </span>
        </div>
      </div>

      {/* 3. Course Cards Grid or List */}
      {filteredCourses.length === 0 ? (
        <div className="rounded-[14px] border border-[#EDEDED] bg-white p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-[10px] bg-[#F5F5F5] flex items-center justify-center mx-auto text-primary-300">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="h6-medium text-primary-500">
            No matching curriculums found
          </h3>
          <p className="body-sm-regular subtext-500 max-w-sm mx-auto">
            Try adjusting your search query, selecting &quot;All Categories&quot;, or creating a new course.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <SecondaryButton
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={() => {
                setSearch("");
                setSelectedCategory("All Categories");
                setSelectedStatus("ALL");
              }}
            >
              Reset Filters
            </SecondaryButton>
            <PrimaryButton
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setCreateOpen(true)}
            >
              Create Course
            </PrimaryButton>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {paginatedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onDelete={handleDeleteCourse}
              onGenerateOutline={handleOpenAiOutline}
              onViewDetails={(c) => setSelectedCourseForDetails(c)}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="bg-white"
        >
          <DataTable
            columns={listColumns}
            data={paginatedCourses}
            rowKey={(row) => row.id}
            onRowClick={(row) => setSelectedCourseForDetails(row)}
          />
        </motion.div>
      )}

      {/* 4. Pagination */}
      {filteredCourses.length > pageSize && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          totalItems={filteredCourses.length}
        />
      )}

      {/* Table Dropdown Menu Portal */}
      <DropdownMenu
        open={Boolean(activeMenuAnchor)}
        onClose={() => {
          setActiveMenuAnchor(null);
          setActiveMenuCourse(null);
        }}
        items={tableMenuItems}
        anchorEl={activeMenuAnchor}
      />

      {/* Course Creation Modal */}
      <CreateCourseModal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(newCourse) => setCourses((prev) => [newCourse, ...prev])}
        onOpenCategoryManager={() => setCategoryOpen(true)}
      />

      {/* AI Syllabus Generation Modal */}
      <AiSyllabusModal
        isOpen={isAiOpen}
        onClose={() => setAiOpen(false)}
        defaultTitle={aiModalTitle}
        onApplyOutline={handleApplyAiOutline}
      />

      {/* Category Management Modal */}
      <CategoryManagementModal
        isOpen={isCategoryOpen}
        onClose={() => setCategoryOpen(false)}
        onCategoryCreated={(newCat) => {
          if (!categories.includes(newCat.name)) {
            setCategories((prev) => [...prev, newCat.name]);
          }
        }}
      />

      {/* Coursera / Udemy Course Details & Syllabus Inspector Modal */}
      <CourseDetailsModal
        course={selectedCourseForDetails}
        isOpen={Boolean(selectedCourseForDetails)}
        onClose={() => setSelectedCourseForDetails(null)}
        onOpenAiOutline={(c) => {
          setSelectedCourseForDetails(null);
          handleOpenAiOutline(c);
        }}
      />
    </div>
  );
}

export default CoursesGridClient;
