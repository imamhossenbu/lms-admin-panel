"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { instructorFormSchema, InstructorFormInput } from "@/validations/instructorSchema";
import { InstructorInformationCard } from "./InstructorInformationCard";
import { InstructorPasswordCard } from "./InstructorPasswordCard";
import { AssignCoursesCard } from "./AssignCoursesCard";
import { InstructorAccountSummaryCard } from "./InstructorAccountSummaryCard";
import { InstructorNextStepsCard } from "./InstructorNextStepsCard";
import { InstructorFormActions } from "./InstructorFormActions";

interface InstructorFormProps {
  defaultValues: InstructorFormInput;
  defaultCourseIds?: string[];
  mode?: "create" | "edit";
  infoDescription?: string;
  nextSteps?: string[];
  cancelHref: string;
  submitLabel: string;
  submittingLabel: string;
  submitIcon: React.ReactNode;
  /** Resolve to finish; throw to keep the form open and re-enable submit. */
  onSubmit: (data: InstructorFormInput, courseIds: string[]) => Promise<void>;
}

export function InstructorForm({
  defaultValues,
  defaultCourseIds = [],
  mode = "create",
  infoDescription,
  nextSteps,
  cancelHref,
  submitLabel,
  submittingLabel,
  submitIcon,
  onSubmit,
}: InstructorFormProps) {
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>(defaultCourseIds);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InstructorFormInput>({
    resolver: zodResolver(instructorFormSchema),
    mode: "onTouched",
    defaultValues,
  });

  const [name, email, phone, status] = useWatch({
    control,
    name: ["name", "email", "phone", "status"],
  });

  const submit = async (data: InstructorFormInput) => {
    try {
      await onSubmit(data, selectedCourseIds);
    } catch {
      // Error toast is raised by the page; swallow so the form re-enables.
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <InstructorInformationCard
            register={register}
            errors={errors}
            control={control}
            description={infoDescription}
          />
          <InstructorPasswordCard mode={mode} />
          <AssignCoursesCard
            selectedCourseIds={selectedCourseIds}
            onChangeSelectedCourseIds={setSelectedCourseIds}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-dash p-5 shadow-2xs space-y-5">
            <InstructorAccountSummaryCard
              name={name}
              email={email}
              phone={phone}
              status={status}
              coursesCount={selectedCourseIds.length}
            />
            <InstructorNextStepsCard steps={nextSteps} />
          </div>

          <div className="mt-auto">
            <InstructorFormActions
              cancelHref={cancelHref}
              isSubmitting={isSubmitting}
              submitLabel={submitLabel}
              submittingLabel={submittingLabel}
              submitIcon={submitIcon}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

export default InstructorForm;
