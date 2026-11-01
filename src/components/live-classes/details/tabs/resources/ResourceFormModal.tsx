"use client";

import React, { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { AppSelect } from "@/components/ui/AppSelect";
import { InputField } from "@/components/ui/InputField";
import { ModalShell } from "@/components/ui/ModalShell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { FieldLabel } from "@/components/ui/SelectField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { addLiveResource, updateLiveResource } from "@/lib/liveClassStorage";
import { liveResourceSchema, type LiveResourceValues } from "@/validations/liveClassSchema";
import type { LiveResource, LiveResourceType } from "@/types/liveClass";
import { errorText } from "../qa/liveTabFormat";
import { TYPE_OPTIONS, VISIBILITY_OPTIONS } from "./resourceMeta";
import { ResourceFileField } from "./ResourceFileField";

export interface ResourceFormModalProps {
  classId: string;
  /** Resource being edited (null = add). */
  resource: LiveResource | null;
  /** Preset type when adding (Quick Actions). */
  presetType: LiveResourceType;
  onClose: () => void;
}

const FORM_ID = "live-resource-form";

/** Add / edit resource modal (react-hook-form + liveResourceSchema). Mount it with a key per open. */
export function ResourceFormModal({ classId, resource, presetType, onClose }: ResourceFormModalProps) {
  const [uploading, setUploading] = useState(false);
  const editing = !!resource;
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LiveResourceValues>({
    resolver: zodResolver(liveResourceSchema),
    defaultValues: resource
      ? { type: resource.type, title: resource.title, description: resource.description, url: resource.url, size: resource.size, visibility: resource.visibility }
      : { type: presetType, title: "", description: "", url: "", size: 0, visibility: "ALL_STUDENTS" },
  });
  const type = useWatch({ control, name: "type" });
  const url = useWatch({ control, name: "url" });
  const size = useWatch({ control, name: "size" });
  const isLink = type === "LINK";

  const onSubmit = async (values: LiveResourceValues) => {
    const payload = { ...values, size: values.type === "LINK" ? 0 : values.size };
    const toastId = toast.loading(editing ? "Saving resource..." : "Adding resource...", { description: values.title });
    try {
      if (resource) await updateLiveResource(resource.id, payload);
      else await addLiveResource(classId, payload);
      toast.success(editing ? "Resource updated" : "Resource added", {
        id: toastId,
        description: editing ? `${values.title} was updated.` : `${values.title} is now listed in the class resources.`,
      });
      onClose();
    } catch (e) {
      toast.error(editing ? "Couldn't save the resource" : "Couldn't add the resource", { id: toastId, description: errorText(e) });
    }
  };

  const busy = isSubmitting || uploading;

  return (
    <ModalShell
      isOpen
      onClose={busy ? () => {} : onClose}
      title={editing ? "Edit Resource" : "Add Resource"}
      subtitle="Share recordings, notes, code and useful links with students of this class."
      maxWidth="md"
      footer={
        <>
          <SecondaryButton onClick={onClose} disabled={busy}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form={FORM_ID} leftIcon={editing ? <Save /> : <Plus />} isLoading={isSubmitting} disabled={busy}>
            {isSubmitting ? "Saving..." : editing ? "Save Changes" : "Add Resource"}
          </PrimaryButton>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Type</FieldLabel>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <AppSelect
                  value={field.value}
                  fullWidth
                  disabled={uploading}
                  options={TYPE_OPTIONS}
                  onValueChange={(v) => {
                    const next = v as LiveResourceType;
                    if ((next === "LINK") !== (field.value === "LINK")) {
                      setValue("url", "", { shouldDirty: true });
                      setValue("size", 0, { shouldDirty: true });
                    }
                    field.onChange(next);
                  }}
                />
              )}
            />
          </div>
          <div>
            <FieldLabel>Visibility</FieldLabel>
            <Controller
              control={control}
              name="visibility"
              render={({ field }) => (
                <AppSelect value={field.value} fullWidth options={VISIBILITY_OPTIONS} onValueChange={(v) => field.onChange(v as LiveResourceValues["visibility"])} />
              )}
            />
            {errors.visibility && <p className="mt-1.5 body-xsm-regular text-red">{errors.visibility.message}</p>}
          </div>
        </div>

        <InputField id="resource-title" label="Title" required placeholder={type === "RECORDING" ? "e.g. Full Session Recording" : type === "LINK" ? "e.g. MDN Documentation" : type === "CODE" ? "e.g. Code Examples" : "e.g. Session Notes"} error={errors.title?.message} {...register("title")} />

        <div>
          <FieldLabel htmlFor="resource-description">Description</FieldLabel>
          <TextAreaField id="resource-description" rows={2} placeholder="Short note shown under the title (optional)" error={errors.description?.message} {...register("description")} />
        </div>

        {isLink ? (
          <InputField id="resource-url" label="Link URL" required type="url" placeholder="https://" error={errors.url?.message} {...register("url")} />
        ) : (
          <div>
            <FieldLabel>
              File <span className="text-red">*</span>
            </FieldLabel>
            <ResourceFileField
              type={type}
              url={url}
              size={size}
              error={errors.url?.message}
              onUploadingChange={setUploading}
              onUploaded={(f) => {
                setValue("url", f.url, { shouldDirty: true, shouldValidate: true });
                setValue("size", f.size, { shouldDirty: true });
              }}
              onClear={() => {
                setValue("url", "", { shouldDirty: true });
                setValue("size", 0, { shouldDirty: true });
              }}
            />
          </div>
        )}
      </form>
    </ModalShell>
  );
}

export default ResourceFormModal;
