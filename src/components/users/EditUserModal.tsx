"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editUserSchema, EditUserInput } from "@/validations/userSchema";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { AdminUserItem } from "@/lib/types";
import { toast } from "sonner";

interface EditUserModalProps {
  user: AdminUserItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: AdminUserItem) => void;
}

export function EditUserModal({ user, isOpen, onClose, onSave }: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditUserInput>({
    resolver: zodResolver(editUserSchema),
    values: user
      ? {
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          phone: user.phone || "",
        }
      : undefined,
  });

  const onSubmit = (data: EditUserInput) => {
    if (!user) return;
    onSave({ ...user, ...data });
    toast.success(`User ${data.name} updated successfully`);
    onClose();
    reset();
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Modify User Credentials & Role"
      description="Update security status, platform permissions, or account details."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Full Name"
          {...register("name")}
          error={errors.name?.message}
          placeholder="e.g. Abdullah Al Mamun"
        />

        <InputField
          label="Email Address"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="user@example.com"
        />

        <InputField
          label="Phone Number (Optional)"
          {...register("phone")}
          error={errors.phone?.message}
          placeholder="+880 1700 000000"
        />

        <div className="grid grid-cols-2 gap-4">
          <DropdownSelect
            fieldLabel="System Role"
            value={watch("role")}
            onChange={(val) => setValue("role", val as any, { shouldValidate: true })}
            options={[
              { value: "STUDENT", label: "Student" },
              { value: "TEACHER", label: "Instructor" },
              { value: "ADMIN", label: "Administrator" },
            ]}
          />

          <DropdownSelect
            fieldLabel="Account Status"
            value={watch("status")}
            onChange={(val) => setValue("status", val as any, { shouldValidate: true })}
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "BLOCKED", label: "Blocked" },
              { value: "PENDING", label: "Pending" },
            ]}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EDEDED]">
          <SecondaryButton onClick={onClose} type="button">
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" isLoading={isSubmitting}>
            Save Changes
          </PrimaryButton>
        </div>
      </form>
    </ModalShell>
  );
}
