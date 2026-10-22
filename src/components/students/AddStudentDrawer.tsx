"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, UserPlus, Edit2 } from "lucide-react";
import { StudentItem, StudentStatus } from "@/types/student";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { toast } from "sonner";

const studentSchema = z.object({
  name: z
    .string()
    .min(2, "Student name must be at least 2 characters")
    .max(60, "Name cannot exceed 60 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 digits"),
  status: z.enum(["Active", "Inactive"]),
  initialCourse: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface AddStudentDrawerProps {
  isOpen: boolean;
  mode: "add" | "edit";
  student: StudentItem | null;
  onClose: () => void;
  onSave: (payload: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    status: StudentStatus;
    initialCourse?: string;
  }) => void;
}

const COURSE_OPTIONS = [
  { value: "Complete Web Development Bootcamp", label: "Complete Web Development Bootcamp" },
  { value: "UI/UX Design Fundamentals", label: "UI/UX Design Fundamentals" },
  { value: "Digital Marketing Masterclass", label: "Digital Marketing Masterclass" },
  { value: "Python for Data Analysis & AI", label: "Python for Data Analysis & AI" },
];

export function AddStudentDrawer({
  isOpen,
  mode,
  student,
  onClose,
  onSave,
}: AddStudentDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "Active",
      initialCourse: "Complete Web Development Bootcamp",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && student) {
      reset({
        name: student.name,
        email: student.email,
        phone: student.phone,
        status: student.status,
        initialCourse: student.enrolledCourses[0]?.title || "",
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "+880 1",
        status: "Active",
        initialCourse: "Complete Web Development Bootcamp",
      });
    }
  }, [isOpen, mode, student, reset]);

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading(
      mode === "add" ? "Adding new student..." : "Updating student details..."
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      onSave({
        id: student?.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        initialCourse: data.initialCourse,
      });

      toast.success(
        mode === "add" ? "Student Added Successfully" : "Student Details Updated",
        {
          id: toastId,
          description: `Account for ${data.name} is ready.`,
        }
      );
      setIsSubmitting(false);
      onClose();
    } catch {
      toast.error("Operation Failed", {
        id: toastId,
        description: "Could not save student information.",
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
                    {mode === "add" ? "Add New Student" : "Edit Student Information"}
                  </h3>
                  <p className="body-2xsm-regular text-primary-300 mt-1">
                    {mode === "add"
                      ? "Create an account and assign courses."
                      : `Update records for ${student?.name}.`}
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
                id="student-drawer-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <InputField
                  id="student-name"
                  label="Full Name"
                  required
                  placeholder="e.g. Fahim Rahman"
                  {...register("name")}
                  error={errors.name?.message}
                />

                <InputField
                  id="student-email"
                  label="Email Address"
                  type="email"
                  required
                  placeholder="e.g. fahim@example.com"
                  {...register("email")}
                  error={errors.email?.message}
                />

                <InputField
                  id="student-phone"
                  label="Phone Number"
                  required
                  placeholder="e.g. +880 1712 345678"
                  {...register("phone")}
                  error={errors.phone?.message}
                />

                {mode === "add" && (
                  <div>
                    <Controller
                      name="initialCourse"
                      control={control}
                      render={({ field }) => (
                        <DropdownSelect
                          fieldLabel="Initial Course Enrollment"
                          options={COURSE_OPTIONS}
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Select initial course"
                          className="w-full"
                        />
                      )}
                    />
                  </div>
                )}

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
              </form>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-dash bg-slate-50/50 flex items-center justify-between gap-3">
              <SecondaryButton onClick={onClose} disabled={isSubmitting} size="md">
                Cancel
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                form="student-drawer-form"
                isLoading={isSubmitting}
                size="md"
              >
                {mode === "add" ? "Create Student" : "Save Changes"}
              </PrimaryButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AddStudentDrawer;
