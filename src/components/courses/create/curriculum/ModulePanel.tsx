"use client";

import React, { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, Reorder, useDragControls } from "framer-motion";
import { Plus, Sparkles, Trash2, X } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { coursesApi } from "@/lib/api";
import {
  CURRICULUM_MODULE_DESCRIPTION_MAX,
  CURRICULUM_MODULE_OBJECTIVES_MAX,
  CURRICULUM_MODULE_TITLE_MAX,
  curriculumModuleSchema,
  type CurriculumModuleInput,
} from "@/validations/courseOutlineSchema";
import { MediaUploadField } from "../MediaUploadField";
import { THUMBNAIL_UPLOAD } from "../createCourseOptions";
import { FieldError } from "../basic/FieldLabel";
import { OutlineDragHandle } from "../outline/OutlineDragHandle";
import { EMPTY_MODULE_PANEL } from "./curriculumEditing";

interface ModulePanelProps {
  mode: "create" | "edit";
  initialValues?: CurriculumModuleInput;
  onCancel: () => void;
  onSubmit: (values: CurriculumModuleInput) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

const INPUT =
  "w-full rounded-lg border bg-white px-3.5 body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none transition-colors";

function Counter({ value, max }: { value: number; max: number }) {
  return <span className={value > max ? "body-xsm-regular text-red" : "body-xsm-regular text-primary-300"}>{value}/{max}</span>;
}

function ObjectiveRow({
  id,
  index,
  register,
  onRemove,
  error,
}: {
  id: string;
  index: number;
  register: ReturnType<typeof useForm<CurriculumModuleInput>>["register"];
  onRemove: () => void;
  error?: string;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={id}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      className="list-none"
    >
      <div className="flex items-center gap-2">
        <OutlineDragHandle controls={controls} label={`Reorder objective ${index + 1}`} />
        <input
          {...register(`objectives.${index}.value` as const)}
          placeholder={`Objective ${index + 1}`}
          className={`${INPUT} h-10 ${error ? "border-red" : "border-dash focus:border-brand-orange"}`}
        />
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={onRemove}
          aria-label={`Remove objective ${index + 1}`}
          className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-red hover:bg-red-14 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
      <FieldError message={error} />
    </Reorder.Item>
  );
}

/** Right-hand "Add Module" / "Edit Module" panel on the Curriculum step. */
export function ModulePanel({ mode, initialValues, onCancel, onSubmit, onUploadingChange }: ModulePanelProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CurriculumModuleInput>({
    resolver: zodResolver(curriculumModuleSchema),
    mode: "onTouched",
    defaultValues: initialValues ?? EMPTY_MODULE_PANEL,
  });
  const { fields, append, remove, move } = useFieldArray({ control, name: "objectives" });
  const [title, description] = useWatch({ control, name: ["title", "description"] });

  useEffect(() => {
    reset(initialValues ?? EMPTY_MODULE_PANEL);
  }, [initialValues, reset]);

  const order = fields.map((f) => f.id);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="dashboard-card shadow-2xs text-left flex flex-col"
      aria-label={mode === "create" ? "Add module" : "Edit module"}
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <div>
            <h2 className="heading-h5 font-bold text-primary-500 flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-brand-orange" />
              {mode === "create" ? "Add Module" : "Edit Module"}
            </h2>
            <p className="body-sm-regular text-primary-400 mt-1">
              {mode === "create" ? "Create a new module to organize your lessons." : "Update this module's details."}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close panel"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-400 hover:bg-slate-100 hover:text-primary-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="module-title" className="body-sm-medium text-primary-500">
                Module Title <span className="text-red">*</span>
              </label>
              <Counter value={title?.length ?? 0} max={CURRICULUM_MODULE_TITLE_MAX} />
            </div>
            <input
              id="module-title"
              {...register("title")}
              placeholder="e.g. HTML Fundamentals"
              className={`${INPUT} h-11 ${errors.title ? "border-red" : "border-dash focus:border-brand-orange"}`}
            />
            <FieldError message={errors.title?.message} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="module-description" className="body-sm-medium text-primary-500">
                Module Description
              </label>
              <Counter value={description?.length ?? 0} max={CURRICULUM_MODULE_DESCRIPTION_MAX} />
            </div>
            <textarea
              id="module-description"
              rows={4}
              {...register("description")}
              placeholder="What will students learn in this module?"
              className={`${INPUT} py-3 resize-y ${errors.description ? "border-red" : "border-dash focus:border-brand-orange"}`}
            />
            <FieldError message={errors.description?.message} />
          </div>

          <div>
            <p className="body-sm-medium text-primary-500 mb-2">
              Module Thumbnail <span className="body-sm-regular text-primary-300">(Optional)</span>
            </p>
            <Controller
              control={control}
              name="thumbnailUrl"
              render={({ field }) => (
                <MediaUploadField
                  kind="image"
                  layout="single"
                  value={field.value}
                  onChange={field.onChange}
                  config={{ ...THUMBNAIL_UPLOAD, title: "Upload Image" }}
                  upload={coursesApi.uploadThumbnail}
                  onUploadingChange={onUploadingChange}
                />
              )}
            />
          </div>

          <div>
            <p className="body-sm-medium text-primary-500">
              Learning Objectives <span className="body-sm-regular text-primary-300">(Optional)</span>
            </p>
            <p className="body-xsm-regular text-primary-300 mt-0.5 mb-3">Add a few key learning objectives for this module.</p>
            <Reorder.Group
              axis="y"
              values={order}
              onReorder={(next) => {
                const from = order.findIndex((id, i) => next[i] !== id);
                if (from === -1) return;
                const to = next.indexOf(order[from]);
                move(from, to);
              }}
              className="space-y-2.5"
            >
              <AnimatePresence initial={false}>
                {fields.map((field, index) => (
                  <ObjectiveRow
                    key={field.id}
                    id={field.id}
                    index={index}
                    register={register}
                    onRemove={() => remove(index)}
                    error={errors.objectives?.[index]?.value?.message}
                  />
                ))}
              </AnimatePresence>
            </Reorder.Group>
            <FieldError message={errors.objectives?.message} />
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              disabled={fields.length >= CURRICULUM_MODULE_OBJECTIVES_MAX}
              onClick={() => append({ value: "" })}
              className="mt-3 w-full h-11 rounded-lg border border-dash bg-white body-sm-medium text-primary-500 hover:bg-slate-50 inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Objective
            </motion.button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-dash">
          <SecondaryButton type="button" onClick={onCancel}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit">{mode === "create" ? "Create Module" : "Save Changes"}</PrimaryButton>
        </div>
      </form>
    </motion.aside>
  );
}

export default ModulePanel;
