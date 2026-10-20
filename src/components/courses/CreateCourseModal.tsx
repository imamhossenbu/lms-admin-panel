"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCourseSchema, CreateCourseInput } from "@/validations/courseSchema";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { SelectField } from "@/components/ui/SelectField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { OutlineButton } from "@/components/ui/outline-button";
import { AdminCourseItem } from "@/lib/types";
import { toast } from "sonner";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (course: AdminCourseItem) => void;
}

export function CreateCourseModal({ isOpen, onClose, onCreate }: CreateCourseModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      categoryId: "cat-1",
      level: "BEGINNER",
      price: 49,
      isFree: false,
      status: "DRAFT",
    },
  });

  const onSubmit = (data: CreateCourseInput) => {
    const newCourse: AdminCourseItem = {
      id: `crs-${Date.now()}`,
      title: data.title,
      slug: data.slug,
      price: data.isFree ? 0 : data.price,
      isFree: data.isFree,
      status: data.status,
      category: { id: data.categoryId, name: "Web Development" },
      totalStudents: 0,
      ratingAverage: 5.0,
      instructorName: "Lead Instructor",
    };

    onCreate(newCourse);
    toast.success(`Course "${data.title}" drafted successfully!`);
    reset();
    onClose();
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Academic Course"
      description="Define core course metadata, pricing tier, and initial publication state."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Course Title"
          {...register("title")}
          error={errors.title?.message}
          placeholder="e.g. Next.js 16 Fullstack Engineering"
        />

        <InputField
          label="URL Slug"
          {...register("slug")}
          error={errors.slug?.message}
          placeholder="e.g. nextjs-16-fullstack-engineering"
        />

        <div className="flex flex-col gap-1.5 text-left">
          <label className="body-sm-medium text-brand-navy">Short Overview</label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full p-3 rounded-lg border border-dash body-sm-regular focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            placeholder="Brief overview of curriculum objectives and prerequisite knowledge..."
          />
          {errors.description && (
            <span className="body-xsm-regular text-rose-500">{errors.description.message}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Proficiency Level"
            {...register("level")}
            error={errors.level?.message}
            options={[
              { value: "BEGINNER", label: "Beginner" },
              { value: "INTERMEDIATE", label: "Intermediate" },
              { value: "ADVANCED", label: "Advanced" },
            ]}
          />

          <InputField
            label="Standard Price (USD)"
            type="number"
            {...register("price", { valueAsNumber: true })}
            error={errors.price?.message}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-dash">
          <OutlineButton onClick={onClose} type="button">Cancel</OutlineButton>
          <PrimaryButton type="submit" isLoading={isSubmitting}>Draft Course</PrimaryButton>
        </div>
      </form>
    </ModalShell>
  );
}
