"use client";

import React from "react";
import { User, Mail, Phone, ChevronDown } from "lucide-react";
import { UseFormRegister, FieldErrors, Control, Controller } from "react-hook-form";
import { CreateStudentInput } from "@/validations/studentSchema";
import { StudentPasswordSection } from "./StudentPasswordSection";

interface StudentInformationCardProps {
  register: UseFormRegister<CreateStudentInput>;
  errors: FieldErrors<CreateStudentInput>;
  control: Control<CreateStudentInput>;
}

export function StudentInformationCard({
  register,
  errors,
  control,
}: StudentInformationCardProps) {
  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-6 shadow-2xs text-left">
      {/* Card Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h2 className="title-medium font-bold text-primary-500">
            Student Information
          </h2>
          <p className="body-sm-regular text-primary-300">
            Enter the basic information for the student. A secure password will be automatically generated.
          </p>
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block body-sm-medium text-primary-400">
            Full Name <span className="text-red">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-300 pointer-events-none">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Enter full name"
              {...register("name")}
              className={`w-full h-10 pl-10 pr-3.5 rounded-lg border body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none transition-colors ${
                errors.name
                  ? "border-red bg-red-14/10 focus:border-red"
                  : "border-dash bg-white focus:border-blue"
              }`}
            />
          </div>
          {errors.name?.message && (
            <p className="body-xsm-regular text-red mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="block body-sm-medium text-primary-400">
            Email Address <span className="text-red">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-300 pointer-events-none">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="Enter email address"
              {...register("email")}
              className={`w-full h-10 pl-10 pr-3.5 rounded-lg border body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none transition-colors ${
                errors.email
                  ? "border-red bg-red-14/10 focus:border-red"
                  : "border-dash bg-white focus:border-blue"
              }`}
            />
          </div>
          {errors.email?.message && (
            <p className="body-xsm-regular text-red mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number (Optional) */}
        <div className="space-y-1.5">
          <label className="block body-sm-medium text-primary-400">
            Phone Number <span className="text-primary-300 body-xsm-regular">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-300 pointer-events-none">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              placeholder="Enter phone number"
              {...register("phone")}
              className="w-full h-10 pl-10 pr-3.5 rounded-lg border border-dash bg-white body-sm-regular text-primary-500 placeholder:text-primary-300 focus:outline-none focus:border-blue transition-colors"
            />
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="space-y-1.5">
          <label className="block body-sm-medium text-primary-400">Status</label>
          <Controller
            control={control}
            name="status"
            defaultValue="Active"
            render={({ field }) => (
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      field.value === "Active"
                        ? "bg-[#10B981]"
                        : field.value === "Inactive"
                        ? "bg-[#94A3B8]"
                        : "bg-[#F59E0B]"
                    }`}
                  />
                </div>
                <select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full h-10 pl-8 pr-9 rounded-lg border border-dash bg-white body-sm-medium text-primary-500 appearance-none focus:outline-none focus:border-blue cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
                <ChevronDown className="w-4 h-4 text-primary-300 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
          />
        </div>
      </div>

      {/* Password subsection */}
      <StudentPasswordSection />
    </div>
  );
}
