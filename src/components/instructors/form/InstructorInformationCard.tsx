"use client";

import React from "react";
import { User, Mail, Phone } from "lucide-react";
import { UseFormRegister, FieldErrors, Control, Controller } from "react-hook-form";
import { InputField } from "@/components/ui/InputField";
import { AppSelect } from "@/components/ui/AppSelect";
import { InstructorFormInput } from "@/validations/instructorSchema";
import { InstructorFormCardHeader } from "./InstructorFormCardHeader";

interface InstructorInformationCardProps {
  register: UseFormRegister<InstructorFormInput>;
  errors: FieldErrors<InstructorFormInput>;
  control: Control<InstructorFormInput>;
  description?: string;
}

const STATUS_OPTIONS = [
  {
    value: "Active",
    label: "Active",
    icon: <span className="w-2 h-2 rounded-full bg-green inline-block" />,
  },
  {
    value: "Inactive",
    label: "Inactive",
    icon: <span className="w-2 h-2 rounded-full bg-primary-300 inline-block" />,
  },
];

export function InstructorInformationCard({
  register,
  errors,
  control,
  description = "Enter the basic information for the instructor. A secure password will be automatically generated.",
}: InstructorInformationCardProps) {
  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-5 shadow-2xs text-left">
      <InstructorFormCardHeader
        icon={<User className="w-5 h-5" />}
        title="Instructor Information"
        description={description}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          id="instructor-name"
          label="Full Name"
          required
          placeholder="Enter full name"
          leftElement={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register("name")}
        />

        <InputField
          id="instructor-email"
          type="email"
          label="Email Address"
          required
          placeholder="Enter email address"
          leftElement={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <InputField
          id="instructor-phone"
          type="tel"
          label={
            <>
              Phone Number <span className="text-primary-300">(Optional)</span>
            </>
          }
          placeholder="Enter phone number"
          leftElement={<Phone className="w-4 h-4" />}
          error={errors.phone?.message}
          {...register("phone")}
        />

        <div>
          <label className="block body-sm-regular text-primary-400 mb-2 select-none">
            Status
          </label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <AppSelect
                value={field.value}
                onValueChange={field.onChange}
                className="w-full"
                triggerClassName="w-full h-10 bg-white"
                options={STATUS_OPTIONS}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default InstructorInformationCard;
