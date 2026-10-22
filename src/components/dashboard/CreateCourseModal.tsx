"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";

const createCourseSchema = z.object({
  title: z
    .string()
    .min(3, "Course title must be at least 3 characters")
    .max(100, "Title is too long"),
  category: z.string().min(1, "Please select a category"),
  price: z
    .number()
    .min(0, "Price cannot be negative"),
  level: z.string().min(1, "Please select difficulty level"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

type CreateCourseFormData = z.infer<typeof createCourseSchema>;

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated?: (newCourse: any) => void;
}

export function CreateCourseModal({
  isOpen,
  onClose,
  onCourseCreated,
}: CreateCourseModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      category: "Web Development",
      price: 49,
      level: "Beginner",
      description: "",
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: CreateCourseFormData) => {
    const toastId = toast.loading("Creating course...", {
      description: "Setting up syllabus and provisioning curriculum resources.",
    });

    try {
      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Course Created Successfully", {
        id: toastId,
        description: `"${data.title}" has been drafted and saved.`,
      });

      if (onCourseCreated) {
        onCourseCreated(data);
      }
      reset();
      onClose();
    } catch {
      toast.error("Failed to Create Course", {
        id: toastId,
        description: "Please check your network connection and try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-dash shadow-2xl max-w-lg w-full overflow-hidden text-left animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-dash flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-orange-light text-brand-orange flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="heading-h5 font-bold text-primary-500">
                Create New Course
              </h2>
              <p className="body-2xsm-regular text-primary-300">
                Add a new curriculum offering to your academy catalog.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-primary-300 hover:text-primary-500 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block body-sm-medium text-primary-500 mb-1.5 font-medium">
              Course Title
            </label>
            <input
              type="text"
              placeholder="e.g. Next.js 15 & Clean Architecture Mastery"
              {...register("title")}
              className="w-full h-11 px-3.5 rounded-xl border border-dash body-sm-regular text-primary-500 focus:outline-none focus:border-brand-orange transition-colors"
            />
            {errors.title && (
              <p className="body-xsm-regular text-red-dark mt-1 font-medium">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block body-sm-medium text-primary-500 mb-1.5 font-medium">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full h-11 px-3.5 rounded-xl border border-dash body-sm-regular text-primary-500 focus:outline-none focus:border-brand-orange transition-colors bg-white"
              >
                <option value="Web Development">Web Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Artificial Intelligence">AI & Machine Learning</option>
              </select>
            </div>

            <div>
              <label className="block body-sm-medium text-primary-500 mb-1.5 font-medium">
                Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="49.00"
                {...register("price", { valueAsNumber: true })}
                className="w-full h-11 px-3.5 rounded-xl border border-dash body-sm-regular text-primary-500 focus:outline-none focus:border-brand-orange transition-colors"
              />
              {errors.price && (
                <p className="body-xsm-regular text-red-dark mt-1 font-medium">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block body-sm-medium text-primary-500 mb-1.5 font-medium">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief course objectives and audience prerequisites..."
              {...register("description")}
              className="w-full p-3 rounded-xl border border-dash body-sm-regular text-primary-500 focus:outline-none focus:border-brand-orange transition-colors resize-none"
            />
            {errors.description && (
              <p className="body-xsm-regular text-red-dark mt-1 font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-dash flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-dash body-sm-medium text-primary-400 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white body-sm-medium font-semibold shadow-sm flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting...</span>
                </>
              ) : (
                <span>Publish Course</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
