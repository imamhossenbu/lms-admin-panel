"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Edit2, Check, X } from "lucide-react";
import { AppSelect } from "@/components/ui/AppSelect";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { StudentFullDetails } from "@/types/studentDetails";
import { studentInfoSchema, type StudentInfoInput } from "@/validations/studentSchema";

interface StudentInfoOverviewCardProps {
  student: StudentFullDetails;
  /** Saves through the API; resolves on success, rejects (after its own error toast) on failure. */
  onSave: (values: StudentInfoInput) => Promise<void>;
  /** Hides the Edit button for team members without the students › manage permission. */
  canEdit?: boolean;
}

const INPUT = "w-full h-9 px-3 rounded-lg border bg-gray-bg body-sm-regular text-primary-500 focus:outline-none transition-colors";
const inputClass = (error?: string) => `${INPUT} ${error ? "border-red focus:border-red" : "border-dash focus:border-blue"}`;

export function StudentInfoOverviewCard({ student, onSave, canEdit = true }: StudentInfoOverviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const valuesOf = (s: StudentFullDetails): StudentInfoInput => ({ name: s.name, email: s.email, phone: s.phone, status: s.status });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentInfoInput>({ resolver: zodResolver(studentInfoSchema), defaultValues: valuesOf(student) });

  // Keep the form in step with fresh data from the API (while not editing).
  useEffect(() => {
    if (!isEditing) reset(valuesOf(student));
  }, [student, isEditing, reset]);

  const handleCancel = () => {
    reset(valuesOf(student));
    setIsEditing(false);
  };

  const handleSave = handleSubmit(async (values) => {
    try {
      await onSave(values);
      setIsEditing(false);
    } catch {
      /* stay in edit mode; the caller showed the error toast */
    }
  });

  return (
    <div className="bg-white rounded-xl border border-dash p-6 shadow-2xs text-left h-full flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="title-medium text-primary-500">
              {isEditing ? "Edit Student Information" : "Student Information"}
            </h2>
            {isEditing && (
              <p className="body-2xsm-regular text-primary-300">
                Update student profile details directly in this card.
              </p>
            )}
          </div>
        </div>

        {!isEditing ? (
          canEdit && <SecondaryButton
            size="sm"
            onClick={() => setIsEditing(true)}
            leftIcon={<Edit2 className="w-3.5 h-3.5 text-primary-400" />}
          >
            Edit
          </SecondaryButton>
        ) : (
          <div className="flex items-center gap-2">
            <SecondaryButton
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
              leftIcon={<X className="w-3.5 h-3.5" />}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              size="sm"
              onClick={handleSave}
              disabled={isSubmitting}
              leftIcon={<Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </PrimaryButton>
          </div>
        )}
      </div>

      {/* Mode 1: Display Mode with Balanced Vertical Padding */}
      {!isEditing ? (
        <div className="divide-y divide-dash flex-1 flex flex-col justify-between pt-1">
          <div className="flex items-center justify-between py-3.5">
            <span className="body-sm-regular text-primary-400">Full Name</span>
            <span className="body-sm-medium text-primary-500">
              {student.name}
            </span>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <span className="body-sm-regular text-primary-400">Email</span>
            <span className="body-sm-medium text-primary-500">
              {student.email}
            </span>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <span className="body-sm-regular text-primary-400">Phone</span>
            <span className="body-sm-medium text-primary-500">
              {student.phone || <span className="text-primary-300">Not provided</span>}
            </span>
          </div>

          {/* Status Row: Fixed badge alignment and generous breathing room */}
          <div className="flex items-center justify-between py-3.5">
            <span className="body-sm-regular text-primary-400">Status</span>
            <ToneBadge
              tone={
                student.status === "Active"
                  ? "green"
                  : student.status === "Suspended"
                  ? "red"
                  : "gray"
              }
              dot
              variant="pill"
              size="sm"
            >
              {student.status}
            </ToneBadge>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <span className="body-sm-regular text-primary-400">Joined Date</span>
            <span className="body-sm-medium text-primary-500">
              {student.joinedDate}
            </span>
          </div>

          <div className="flex items-center justify-between py-3.5">
            <span className="body-sm-regular text-primary-400">Student ID</span>
            <span className="body-sm-medium text-primary-500 font-mono">
              {student.studentIdCode}
            </span>
          </div>
        </div>
      ) : (
        /* Mode 2: In-place Inline Edit Form */
        <form onSubmit={handleSave} noValidate className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="block body-xsm-medium text-primary-400">
              Full Name <span className="text-red">*</span>
            </label>
            <input id="student-info-name" type="text" {...register("name")} className={inputClass(errors.name?.message)} placeholder="Student full name" />
            {errors.name && <p className="body-2xsm-regular text-red">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block body-xsm-medium text-primary-400">
              Email Address <span className="text-red">*</span>
            </label>
            <input id="student-info-email" type="email" {...register("email")} className={inputClass(errors.email?.message)} placeholder="student@example.com" />
            {errors.email && <p className="body-2xsm-regular text-red">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block body-xsm-medium text-primary-400">
              Phone Number
            </label>
            <input id="student-info-phone" type="tel" {...register("phone")} className={inputClass(errors.phone?.message)} placeholder="+880 1712 345678" />
            {errors.phone && <p className="body-2xsm-regular text-red">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block body-xsm-medium text-primary-400">
              Status
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
            <AppSelect
              value={field.value}
              onValueChange={(val) => field.onChange(val as StudentInfoInput["status"])}
              className="w-full"
              triggerClassName="w-full h-9 bg-gray-bg"
              options={[
                {
                  value: "Active",
                  label: "Active",
                  icon: (
                    <span className="w-2 h-2 rounded-full bg-green inline-block" />
                  ),
                },
                {
                  value: "Inactive",
                  label: "Inactive",
                  icon: (
                    <span className="w-2 h-2 rounded-full bg-primary-300 inline-block" />
                  ),
                },
                {
                  value: "Suspended",
                  label: "Suspended",
                  icon: (
                    <span className="w-2 h-2 rounded-full bg-red inline-block" />
                  ),
                },
              ]}
            />
              )}
            />
          </div>

          {/* Read-only metadata info */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dash">
            <div>
              <span className="block body-2xsm-regular text-primary-300">
                Joined Date
              </span>
              <span className="body-xsm-medium text-primary-400">
                {student.joinedDate}
              </span>
            </div>
            <div>
              <span className="block body-2xsm-regular text-primary-300">
                Student ID
              </span>
              <span className="body-xsm-medium text-primary-400 font-mono">
                {student.studentIdCode}
              </span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
