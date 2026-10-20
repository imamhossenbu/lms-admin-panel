"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CoursesGridClient } from "@/components/courses/CoursesGridClient";
import { CoursesSkeleton } from "@/components/courses/CoursesSkeleton";
import { motion } from "framer-motion";
import { ToneBadge } from "@/components/ui/ToneBadge";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { RotateCw, Sparkles, Plus, FolderPlus } from "lucide-react";
import { toast } from "sonner";

export default function CoursesManagementPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Catalog Synchronized", {
        description: "Course registrations and syllabus definitions up to date.",
        icon: <Sparkles className="w-4 h-4 text-[#1C4D8D]" />,
      });
    }, 500);
  };

  if (isLoading || isRefreshing) {
    return <CoursesSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="space-y-5 text-left bg-white"
    >
      <PageHeader
        title="Curriculum & Course Catalog"
        subtitle="Author institutional learning modules, compile automated AI syllabi, and audit course publication status."
        badge={
          <ToneBadge tone="green" className="gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0dc34a] animate-pulse" />
            <span>AI Neural Active</span>
          </ToneBadge>
        }
      >
        <SecondaryButton
          leftIcon={
            <RotateCw
              className={`w-4 h-4 text-primary-300 ${
                isRefreshing ? "animate-spin text-[#1C4D8D]" : ""
              }`}
            />
          }
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <span className="hidden sm:inline">Sync</span>
        </SecondaryButton>

        <SecondaryButton
          leftIcon={<FolderPlus className="w-4 h-4 text-[#1C4D8D]" />}
          onClick={() => setIsCategoryOpen(true)}
        >
          Categories
        </SecondaryButton>

        <SecondaryButton
          leftIcon={<Sparkles className="w-4 h-4 text-purple-600" />}
          onClick={() => setIsAiOpen(true)}
        >
          AI Syllabus
        </SecondaryButton>

        <PrimaryButton
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateOpen(true)}
        >
          Add New Course
        </PrimaryButton>
      </PageHeader>

      <CoursesGridClient
        isCreateModalOpen={isCreateOpen}
        setIsCreateModalOpen={setIsCreateOpen}
        isAiModalOpen={isAiOpen}
        setIsAiModalOpen={setIsAiOpen}
        isCategoryModalOpen={isCategoryOpen}
        setIsCategoryModalOpen={setIsCategoryOpen}
      />
    </motion.div>
  );
}
