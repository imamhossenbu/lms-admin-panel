"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, Link2, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { AppSelect } from "@/components/ui/AppSelect";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import { newResourceId } from "@/components/courses/create/lesson/resources/resourceUtils";
import {
  RESOURCE_DESCRIPTION_MAX,
  lessonEditorResourceSchema,
  type LessonEditorResource,
} from "@/validations/lessonEditorSchema";
import { CharCounter } from "@/components/ui/CharCounter";
import { EditorBlueButton } from "../quiz/EditorBlueButton";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { ResourceUploadField } from "./ResourceUploadField";
import { emptyResource, titleFromFileName } from "./resourceDisplay";

const KIND_OPTIONS = [
  { value: "FILE", label: "File Upload", icon: <FileUp className="h-4 w-4 text-blue" /> },
  { value: "LINK", label: "External Link", icon: <Link2 className="h-4 w-4 text-purple" /> },
];

export interface ResourceFormProps {
  /** Resource loaded for editing; null = adding a new one. */
  editing: LessonEditorResource | null;
  /** False when the resource limit is reached (adding only). */
  canAdd: boolean;
  onSubmit: (resource: LessonEditorResource) => void;
  onCancelEdit: () => void;
  onUploadingChange: (uploading: boolean) => void;
}

/**
 * "Learning Resources" add / edit form. Its own react-hook-form + `lessonEditorResourceSchema`.
 * Rendered inside the page's <form>, so it is a <div> (no nested <form>): Enter and the button
 * submit only this form and never the page.
 */
export function ResourceForm({ editing, canAdd, onSubmit, onCancelEdit, onUploadingChange }: ResourceFormProps) {
  const [uploading, setUploading] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    clearErrors,
    formState: { errors, isSubmitted },
  } = useForm<LessonEditorResource>({
    resolver: zodResolver(lessonEditorResourceSchema),
    mode: "onTouched",
    defaultValues: emptyResource(),
  });

  const [kind, description, url, fileName, size, format] = useWatch({
    control,
    name: ["kind", "description", "url", "fileName", "size", "format"],
  });

  useEffect(() => {
    reset(editing ?? emptyResource());
  }, [editing, reset]);

  const reportUploading = (value: boolean) => {
    setUploading(value);
    onUploadingChange(value);
  };

  const changeKind = (next: string) => {
    if (next === kind) return;
    const opts = { shouldDirty: true };
    setValue("kind", next as LessonEditorResource["kind"], opts);
    setValue("url", "", opts);
    setValue("fileName", "", opts);
    setValue("size", 0, opts);
    setValue("format", next === "LINK" ? "LINK" : "", opts);
    clearErrors("url");
  };

  const submit = handleSubmit(
    (values) => {
      if (!editing && !canAdd) {
        toast.error("Resource limit reached", { description: "A lesson can have up to 30 resources. Remove one to add another." });
        return;
      }
      const isLink = values.kind === "LINK";
      onSubmit({
        ...values,
        id: values.id || newResourceId(),
        fileName: isLink ? "" : values.fileName,
        size: isLink ? 0 : values.size,
        format: isLink ? "LINK" : values.format,
      });
      toast.success(editing ? "Resource saved" : "Resource added", {
        description: `"${values.title}" ${editing ? "was updated" : "was added to this lesson"}.`,
      });
      reset(emptyResource());
    },
    () => toast.error("Check the resource details", { description: "Fix the highlighted fields and try again." })
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
      e.preventDefault();
      if (!uploading) void submit();
    }
  };

  return (
    <div className="space-y-5" onKeyDown={onKeyDown}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <FieldLabel label="Resource Type" />
          <Controller
            control={control}
            name="kind"
            render={({ field }) => <AppSelect value={field.value} onValueChange={changeKind} options={KIND_OPTIONS} fullWidth disabled={uploading} />}
          />
        </div>
        <div>
          <FieldLabel htmlFor="resource-title" label="Title" required />
          <InputField id="resource-title" maxLength={120} placeholder="e.g. HTML Cheat Sheet" error={errors.title?.message} {...register("title")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          {kind === "FILE" ? (
            <>
              <FieldLabel label="File" required />
              <ResourceUploadField
                value={{ url, fileName, size, format }}
                error={errors.url?.message}
                onUploadingChange={reportUploading}
                onClear={() => {
                  setValue("url", "", { shouldDirty: true, shouldValidate: isSubmitted });
                  setValue("fileName", "");
                  setValue("size", 0);
                  setValue("format", "");
                }}
                onUploaded={(file) => {
                  setValue("url", file.url, { shouldDirty: true, shouldValidate: isSubmitted });
                  setValue("fileName", file.fileName);
                  setValue("size", file.size);
                  setValue("format", file.format);
                  clearErrors("url");
                  if (!getValues("title").trim()) setValue("title", titleFromFileName(file.fileName), { shouldValidate: isSubmitted });
                }}
              />
            </>
          ) : (
            <>
              <FieldLabel htmlFor="resource-url" label="URL" required />
              <InputField
                id="resource-url"
                type="url"
                inputMode="url"
                placeholder="https://example.com/resource"
                leftElement={<Link2 className="h-4 w-4" />}
                error={errors.url?.message}
                {...register("url")}
              />
            </>
          )}
        </div>
        <div>
          <FieldLabel htmlFor="resource-description" label="Description" optional />
          <TextAreaField
            id="resource-description"
            rows={4}
            maxLength={RESOURCE_DESCRIPTION_MAX}
            placeholder="Add a short description for this resource..."
            error={errors.description?.message}
            {...register("description")}
          />
          <CharCounter className="mt-1" count={description?.length ?? 0} max={RESOURCE_DESCRIPTION_MAX} />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Controller
          control={control}
          name="visible"
          render={({ field }) => (
            <SettingToggleRow
              id="resource-visible"
              title="Make this resource visible to students"
              description="Turn off to keep this resource for instructor use only."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <div className="flex shrink-0 items-center gap-2">
          {editing && (
            <SecondaryButton onClick={onCancelEdit} disabled={uploading}>
              Cancel
            </SecondaryButton>
          )}
          <EditorBlueButton
            leftIcon={editing ? <Save /> : <Plus />}
            onClick={() => void submit()}
            disabled={uploading || (!editing && !canAdd)}
          >
            {editing ? "Save Resource" : "Add Resource"}
          </EditorBlueButton>
        </div>
      </div>
      {!editing && !canAdd && <p className="body-xsm-regular text-red">You&apos;ve reached the limit of 30 resources for this lesson.</p>}
    </div>
  );
}

export default ResourceForm;
