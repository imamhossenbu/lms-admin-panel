"use client";

import React, { useState, useEffect } from "react";
import { User, Edit2, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { AppSelect } from "@/components/ui/AppSelect";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { StudentFullDetails } from "./mockStudentDetails";

interface StudentInfoOverviewCardProps {
  student: StudentFullDetails;
  onEdit?: () => void;
  onSave?: (updated: Partial<StudentFullDetails>) => void;
}

export function StudentInfoOverviewCard({
  student,
  onEdit,
  onSave,
}: StudentInfoOverviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState(student.phone);
  const [status, setStatus] = useState<"Active" | "Inactive" | "Suspended">(student.status);

  // Keep in sync if parent student prop changes
  useEffect(() => {
    setName(student.name);
    setEmail(student.email);
    setPhone(student.phone);
    setStatus(student.status);
  }, [student]);

  const handleStartEditing = () => {
    setIsEditing(true);
    onEdit?.();
  };

  const handleCancel = () => {
    setName(student.name);
    setEmail(student.email);
    setPhone(student.phone);
    setStatus(student.status);
    setIsEditing(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Full Name is required");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Valid email address is required");
      return;
    }

    onSave?.({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      status,
      initials: name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    });

    toast.success("Student information updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl border border-dash p-6 shadow-2xs text-left h-full flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="title-medium font-bold text-primary-500">
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
          <SecondaryButton
            size="sm"
            onClick={handleStartEditing}
            leftIcon={<Edit2 className="w-3.5 h-3.5 text-primary-400" />}
          >
            Edit
          </SecondaryButton>
        ) : (
          <div className="flex items-center gap-2">
            <SecondaryButton
              size="sm"
              onClick={handleCancel}
              leftIcon={<X className="w-3.5 h-3.5" />}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              size="sm"
              onClick={handleSave}
              leftIcon={<Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            >
              Save
            </PrimaryButton>
          </div>
        )}
      </div>

      {/* Mode 1: Display Mode with Balanced Vertical Padding */}
      {!isEditing ? (
        <div className="divide-y divide-dash flex-1 flex flex-col justify-between pt-1">
          <div className="flex items-center justify-between py-3.5">
            <span className="body-sm-regular text-primary-400">Full Name</span>
            <span className="body-sm-medium font-semibold text-primary-500">
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
              {student.phone} <span className="text-primary-300 ml-1">—</span>
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
                  ? "warning"
                  : "red"
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
            <span className="body-sm-medium font-semibold text-primary-500 font-mono">
              {student.studentIdCode}
            </span>
          </div>
        </div>
      ) : (
        /* Mode 2: In-place Inline Edit Form */
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="block body-xsm-medium text-primary-400">
              Full Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-dash bg-[#F8FAFC] body-sm-regular text-primary-500 focus:outline-none focus:border-blue transition-colors"
              placeholder="Student full name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block body-xsm-medium text-primary-400">
              Email Address <span className="text-red">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-dash bg-[#F8FAFC] body-sm-regular text-primary-500 focus:outline-none focus:border-blue transition-colors"
              placeholder="student@example.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block body-xsm-medium text-primary-400">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-dash bg-[#F8FAFC] body-sm-regular text-primary-500 focus:outline-none focus:border-blue transition-colors"
              placeholder="+880 1712 345678"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block body-xsm-medium text-primary-400">
              Status
            </label>
            <AppSelect
              value={status}
              onValueChange={(val) =>
                setStatus(val as "Active" | "Inactive" | "Suspended")
              }
              className="w-full"
              triggerClassName="w-full h-9 bg-[#F8FAFC]"
              options={[
                {
                  value: "Active",
                  label: "Active",
                  icon: (
                    <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />
                  ),
                },
                {
                  value: "Inactive",
                  label: "Inactive",
                  icon: (
                    <span className="w-2 h-2 rounded-full bg-[#94A3B8] inline-block" />
                  ),
                },
                {
                  value: "Suspended",
                  label: "Suspended",
                  icon: (
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B] inline-block" />
                  ),
                },
              ]}
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
