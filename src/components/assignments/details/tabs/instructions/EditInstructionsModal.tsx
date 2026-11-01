"use client";

import React from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { ModalShell } from "@/components/ui/ModalShell";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { InputField } from "@/components/ui/InputField";
import { CharCounter } from "@/components/ui/CharCounter";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { assignmentInstructionsSchema, type AssignmentInstructionsFormValues } from "@/validations/assignmentSchema";
import { updateAssignment } from "@/lib/assignmentStorage";
import type { AssignmentItem } from "@/types/assignment";
import { InstructionListField } from "./InstructionListField";
import { FileTypesField } from "./FileTypesField";
import { errorText, fromInstructionsForm, toInstructionsForm } from "./instructionsForm";

const FORM_ID = "edit-instructions-form";
const OVERVIEW_MAX = 2000;

export interface EditInstructionsModalProps {
  assignment: AssignmentItem;
  onClose: () => void;
  onSaved: (next: AssignmentItem) => void;
}

/** Edit Instructions (mount only while open): own react-hook-form + zod, saves via updateAssignment. */
export function EditInstructionsModal({ assignment, onClose, onSaved }: EditInstructionsModalProps) {
  const methods = useForm<z.input<typeof assignmentInstructionsSchema>, unknown, AssignmentInstructionsFormValues>({
    resolver: zodResolver(assignmentInstructionsSchema),
    defaultValues: toInstructionsForm(assignment.instructions),
    mode: "onTouched",
  });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = methods;
  const overview = useWatch({ control, name: "overview" }) ?? "";

  const onSubmit = handleSubmit(
    async (values) => {
      const toastId = toast.loading("Saving instructions...", { description: "Updating what students will see." });
      try {
        const next = await updateAssignment(assignment.id, { instructions: fromInstructionsForm(values) });
        toast.success("Instructions saved", { id: toastId, description: `Students will see the updated instructions for "${next.title}".` });
        onSaved(next);
      } catch (e) {
        toast.error("Couldn't save instructions", { id: toastId, description: errorText(e) });
      }
    },
    () => toast.error("Instructions not saved", { description: "Fix the highlighted fields and try again." })
  );

  return (
    <ModalShell
      isOpen
      onClose={isSubmitting ? () => {} : onClose}
      title="Edit Instructions"
      subtitle="Update the overview, objectives, task steps and submission rules."
      maxWidth="xl"
      footer={
        <>
          <SecondaryButton onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form={FORM_ID} leftIcon={<Save />} isLoading={isSubmitting} disabled={!isDirty}>
            {isSubmitting ? "Saving..." : "Save Instructions"}
          </PrimaryButton>
        </>
      }
    >
      <FormProvider {...methods}>
        <form id={FORM_ID} onSubmit={onSubmit} noValidate className="space-y-6">
          <div>
            <label htmlFor="instructions-overview" className="mb-2 block body-sm-medium text-primary-500">
              Overview <span className="text-red">*</span>
            </label>
            <TextAreaField id="instructions-overview" rows={4} placeholder="Describe what students will build and why." error={errors.overview?.message} {...register("overview")} />
            <CharCounter count={overview.length} max={OVERVIEW_MAX} className="mt-1" />
          </div>

          <InstructionListField name="objectives" label="Learning Objectives" placeholder="e.g. Use headings and paragraphs correctly" max={10} />
          <InstructionListField
            name="tasks"
            label="Your Task"
            placeholder="e.g. Create a new HTML file named `index.html`"
            hint="Wrap code in backticks, e.g. `index.html`, to show it as code."
            max={15}
            numbered
          />
          <InstructionListField name="requirements" label="Submission Requirements" placeholder="e.g. Make sure the file is complete and working" max={10} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <FileTypesField />
            </div>
            <InputField
              id="instructions-max-size"
              label="Maximum File Size (MB)"
              required
              type="number"
              min={1}
              max={500}
              className="no-spinner"
              error={errors.maxFileSizeMb?.message}
              {...register("maxFileSizeMb", { valueAsNumber: true })}
            />
          </div>

          <InstructionListField name="gradingNotes" label="Grading Notes" placeholder="e.g. Correct HTML structure" max={10} />
        </form>
      </FormProvider>
    </ModalShell>
  );
}

export default EditInstructionsModal;
