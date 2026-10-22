"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, UserPlus, Edit2, Mail } from "lucide-react";
import { InstructorItem, InstructorStatus } from "@/types/instructor";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { toast } from "sonner";

const instructorSchema = z.object({
  name: z
    .string()
    .min(2, "Instructor name must be at least 2 characters")
    .max(60, "Name cannot exceed 60 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  expertise: z.string().min(2, "Please select an expertise area"),
  title: z.string().optional(),
  bio: z.string().min(10, "Bio must be at least 10 characters long"),
  status: z.enum(["Active", "Inactive"]),
});

type InstructorFormData = z.infer<typeof instructorSchema>;

interface AddInstructorDrawerProps {
  isOpen: boolean;
  mode: "add" | "edit";
  instructor: InstructorItem | null;
  onClose: () => void;
  onSave: (payload: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    expertise: string;
    title?: string;
    bio: string;
    status: InstructorStatus;
  }) => void;
}

const EXPERTISE_OPTIONS = [
  { value: "Web Development", label: "Web Development" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "Digital Marketing", label: "Digital Marketing" },
  { value: "Business Strategy", label: "Business Strategy" },
  { value: "Photography", label: "Photography" },
  { value: "Data Science", label: "Data Science" },
  { value: "Mobile Development", label: "Mobile Development" },
  { value: "Content Writing", label: "Content Writing" },
  { value: "Graphic Design", label: "Graphic Design" },
  { value: "English Language", label: "English Language" },
];

export function AddInstructorDrawer({
  isOpen,
  mode,
  instructor,
  onClose,
  onSave,
}: AddInstructorDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InstructorFormData>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      expertise: "Web Development",
      title: "",
      bio: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && instructor) {
      reset({
        name: instructor.name,
        email: instructor.email,
        phone: instructor.phone,
        expertise: instructor.expertise,
        title: instructor.title,
        bio: instructor.bio,
        status: instructor.status,
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "+880 1",
        expertise: "Web Development",
        title: "",
        bio: "",
        status: "Active",
      });
    }
  }, [isOpen, mode, instructor, reset]);

  const onSubmit = async (data: InstructorFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading(
      mode === "add"
        ? "Creating instructor account & emailing credentials..."
        : "Updating instructor details..."
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 450));
      onSave({
        id: instructor?.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        expertise: data.expertise,
        title: data.title || `${data.expertise} Instructor`,
        bio: data.bio,
        status: data.status,
      });

      if (mode === "add") {
        toast.success("Instructor Added Successfully", {
          id: toastId,
          description: `Temporary password and access credentials have been sent to ${data.email}.`,
        });
      } else {
        toast.success("Instructor Details Updated", {
          id: toastId,
          description: `Account for ${data.name} has been updated successfully.`,
        });
      }
      setIsSubmitting(false);
      onClose();
    } catch {
      toast.error("Operation Failed", {
        id: toastId,
        description: "Could not save instructor information.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end text-left">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-[460px] bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-dash"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-dash flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center">
                  {mode === "add" ? (
                    <UserPlus className="w-4 h-4 text-brand-orange" />
                  ) : (
                    <Edit2 className="w-4 h-4 text-brand-orange" />
                  )}
                </div>
                <div>
                  <h3 className="title-medium text-primary-500 font-bold leading-none">
                    {mode === "add" ? "Add New Instructor" : "Edit Instructor Information"}
                  </h3>
                  <p className="body-sm-regular text-primary-400 mt-1.5">
                    {mode === "add"
                      ? "Create an account and assign courses."
                      : `Update records for ${instructor?.name}.`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-300 hover:text-primary-500 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-5">
              <form
                id="instructor-drawer-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <InputField
                  id="instructor-name"
                  label="Full Name"
                  required
                  placeholder="e.g. Fahim Rahman"
                  {...register("name")}
                  error={errors.name?.message}
                />

                <InputField
                  id="instructor-email"
                  label="Email Address"
                  type="email"
                  required
                  placeholder="e.g. fahim@example.com"
                  {...register("email")}
                  error={errors.email?.message}
                />

                <InputField
                  id="instructor-phone"
                  label="Phone Number"
                  required
                  placeholder="e.g. +880 1712 345678"
                  {...register("phone")}
                  error={errors.phone?.message}
                />

                <div>
                  <Controller
                    name="expertise"
                    control={control}
                    render={({ field }) => (
                      <DropdownSelect
                        fieldLabel="Expertise / Specialization *"
                        options={EXPERTISE_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select primary expertise"
                        className="w-full"
                      />
                    )}
                  />
                  {errors.expertise && (
                    <span className="body-2xsm-regular text-red mt-1 block">
                      {errors.expertise.message}
                    </span>
                  )}
                </div>

                <InputField
                  id="instructor-title"
                  label="Professional Title"
                  placeholder="e.g. Senior Web Development Instructor"
                  {...register("title")}
                  error={errors.title?.message}
                />

                <div>
                  <label
                    htmlFor="instructor-bio"
                    className="block body-sm-regular text-primary-400 mb-2 select-none"
                  >
                    Biography / Background <span className="text-[#F04438] ml-0.5">*</span>
                  </label>
                  <textarea
                    id="instructor-bio"
                    rows={3}
                    placeholder="Brief professional background, teaching philosophy, and achievements..."
                    {...register("bio")}
                    className="w-full p-3 rounded-lg border border-dash body-sm-regular text-primary-500 focus:outline-none focus:border-brand-orange bg-white resize-none"
                  />
                  {errors.bio && (
                    <span className="body-2xsm-regular text-red mt-1 block">
                      {errors.bio.message}
                    </span>
                  )}
                </div>

                <div>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <DropdownSelect
                        fieldLabel="Account Status *"
                        options={[
                          { value: "Active", label: "Active (Permitted)" },
                          { value: "Inactive", label: "Inactive (Suspended)" },
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                      />
                    )}
                  />
                </div>

                {/* Email dispatch notice */}
                {mode === "add" && (
                  <div className="p-3.5 rounded-xl bg-blue-14 border border-blue/20 flex items-start gap-2.5 text-left">
                    <div className="w-7 h-7 rounded-lg bg-blue/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-4 h-4 text-blue" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="body-sm-medium text-primary-500 font-semibold">
                        Automated Credentials Email
                      </p>
                      <p className="body-sm-regular text-primary-400">
                        A temporary login password and instructor portal setup link will be automatically sent to the instructor&apos;s email address upon creation.
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-dash bg-slate-50/50 flex items-center justify-between gap-3">
              <SecondaryButton onClick={onClose} disabled={isSubmitting} size="md">
                Cancel
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                form="instructor-drawer-form"
                isLoading={isSubmitting}
                size="md"
              >
                {mode === "add" ? "Create Instructor" : "Save Changes"}
              </PrimaryButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AddInstructorDrawer;
