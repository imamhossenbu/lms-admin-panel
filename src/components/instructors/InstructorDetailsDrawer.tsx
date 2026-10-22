"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  Users,
  DollarSign,
  Star,
  ChevronRight,
  Trash2,
  Edit2,
  Check,
  Send,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { InstructorItem, InstructorStatus } from "@/types/instructor";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Avatar } from "@/components/ui/Avatar";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { toast } from "sonner";
import Image from "next/image";

interface InstructorDetailsDrawerProps {
  isOpen: boolean;
  instructor: InstructorItem | null;
  initialEditMode?: boolean;
  onClose: () => void;
  onUpdateInstructor: (
    instructorId: string,
    updatedData: {
      name: string;
      email: string;
      phone: string;
      title: string;
      expertise: string;
      bio: string;
      status: InstructorStatus;
    }
  ) => void;
  onDeleteInstructor: (instructor: InstructorItem) => void;
}

type TabKey = "overview" | "courses" | "students" | "revenue" | "settings";

export function InstructorDetailsDrawer({
  isOpen,
  instructor,
  initialEditMode = false,
  onClose,
  onUpdateInstructor,
  onDeleteInstructor,
}: InstructorDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendMessageOpen, setIsSendMessageOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");

  // Form states for inline editing
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formExpertise, setFormExpertise] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formStatus, setFormStatus] = useState<InstructorStatus>("Active");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (instructor) {
      setFormName(instructor.name);
      setFormEmail(instructor.email);
      setFormPhone(instructor.phone);
      setFormTitle(instructor.title);
      setFormExpertise(instructor.expertise);
      setFormBio(instructor.bio);
      setFormStatus(instructor.status);
      setErrors({});
      setIsEditingInfo(initialEditMode);
      setShowDeleteConfirm(false);
      setIsSendMessageOpen(false);
    }
  }, [instructor, isOpen, initialEditMode]);

  if (!instructor) return null;

  const handleStartEdit = () => {
    setFormName(instructor.name);
    setFormEmail(instructor.email);
    setFormPhone(instructor.phone);
    setFormTitle(instructor.title);
    setFormExpertise(instructor.expertise);
    setFormBio(instructor.bio);
    setFormStatus(instructor.status);
    setErrors({});
    setIsEditingInfo(true);
  };

  const handleCancelEdit = () => {
    setIsEditingInfo(false);
    setErrors({});
  };

  const handleSaveEdit = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!formName.trim() || formName.trim().length < 2) {
      newErrors.name = "Instructor name must be at least 2 characters";
    }
    if (!formEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) {
      newErrors.email = "Please provide a valid email address";
    }
    if (!formPhone.trim() || formPhone.trim().length < 8) {
      newErrors.phone = "Phone number must be at least 8 digits";
    }
    if (!formBio.trim() || formBio.trim().length < 10) {
      newErrors.bio = "Bio must be at least 10 characters long";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving changes...");

    await new Promise((resolve) => setTimeout(resolve, 350));

    onUpdateInstructor(instructor.id, {
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      title: formTitle.trim() || `${formExpertise} Instructor`,
      expertise: formExpertise.trim() || instructor.expertise,
      bio: formBio.trim(),
      status: formStatus,
    });

    toast.success("Instructor Updated", {
      id: toastId,
      description: `Information for "${formName.trim()}" has been updated.`,
    });

    setIsSaving(false);
    setIsEditingInfo(false);
  };

  const handleDelete = () => {
    onDeleteInstructor(instructor);
  };

  const handleSendMessage = () => {
    if (!messageSubject.trim() || !messageBody.trim()) {
      toast.error("Missing Information", {
        description: "Please enter both subject and message body.",
      });
      return;
    }
    toast.success("Message Dispatched", {
      description: `Message "${messageSubject}" sent to ${instructor.email}.`,
    });
    setIsSendMessageOpen(false);
    setMessageSubject("");
    setMessageBody("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end text-left">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] cursor-pointer"
          />

          {/* Drawer Panel matching screenshot */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-dash"
          >
            {/* 1. Header Bar */}
            <div className="px-5 py-4 border-b border-dash flex items-center justify-between bg-white">
              <h3 className="title-medium text-primary-500 font-bold">
                Instructor Details
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-300 hover:text-primary-500 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Instructor Profile Summary */}
            <div className="p-5 border-b border-dash bg-white">
              <div className="flex items-center gap-4">
                <Avatar
                  src={instructor.avatarUrl}
                  name={instructor.name}
                  size={56}
                  className="rounded-full ring-2 ring-dash shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="title-sm text-primary-500 font-bold truncate">
                      {instructor.name}
                    </h2>
                    <ToneBadge
                      tone={instructor.status === "Active" ? "green" : "red"}
                      size="sm"
                    >
                      {instructor.status}
                    </ToneBadge>
                  </div>
                  <p className="body-sm-regular text-primary-400 truncate mt-0.5">
                    {instructor.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 body-2xsm-regular text-primary-400">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-bold text-primary-500">
                        {instructor.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-primary-300">
                      ({instructor.reviewsCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Navigation Tabs */}
            <div className="px-5 border-b border-dash flex items-center gap-6 bg-white overflow-x-auto scrollbar-none">
              {(
                [
                  { key: "overview", label: "Overview" },
                  { key: "courses", label: "Courses" },
                  { key: "students", label: "Students" },
                  { key: "revenue", label: "Revenue" },
                  { key: "settings", label: "Settings" },
                ] as const
              ).map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-3 body-sm-medium font-semibold relative transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "text-brand-orange"
                        : "text-primary-400 hover:text-primary-500"
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="active-instructor-tab-pill"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 4. Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* 4 Stat Metric Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Courses */}
                    <div className="p-3.5 rounded-xl border border-dash bg-white shadow-2xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="heading-h5 text-primary-500 font-bold block leading-none">
                          {instructor.coursesCount}
                        </span>
                        <span className="body-2xsm-regular text-primary-300 block mt-1">
                          Courses
                        </span>
                      </div>
                    </div>

                    {/* Students */}
                    <div className="p-3.5 rounded-xl border border-dash bg-white shadow-2xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="heading-h5 text-primary-500 font-bold block leading-none">
                          {instructor.studentsCount}
                        </span>
                        <span className="body-2xsm-regular text-primary-300 block mt-1">
                          Students
                        </span>
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="p-3.5 rounded-xl border border-dash bg-white shadow-2xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-bg text-green flex items-center justify-center shrink-0">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="heading-h5 text-primary-500 font-bold block leading-none">
                          {instructor.totalRevenue}
                        </span>
                        <span className="body-2xsm-regular text-primary-300 block mt-1">
                          Total Revenue
                        </span>
                      </div>
                    </div>

                    {/* Avg. Rating */}
                    <div className="p-3.5 rounded-xl border border-dash bg-white shadow-2xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                        <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                      </div>
                      <div>
                        <span className="heading-h5 text-primary-500 font-bold block leading-none">
                          {instructor.rating.toFixed(1)}
                        </span>
                        <span className="body-2xsm-regular text-primary-300 block mt-1">
                          Avg. Rating
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information Card with edge-to-edge header border */}
                  <div className="rounded-xl border border-dash bg-white shadow-2xs overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-dash bg-white">
                      <h4 className="title-sm text-primary-500 font-bold">
                        Personal Information
                      </h4>
                      {!isEditingInfo ? (
                        <button
                          type="button"
                          onClick={handleStartEdit}
                          className="body-sm-medium text-primary-400 hover:text-brand-orange transition-colors cursor-pointer flex items-center gap-1"
                          title="Edit Information"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-brand-orange" />
                          <span>Edit</span>
                        </button>
                      ) : (
                        <span className="body-2xsm-regular px-2 py-0.5 rounded bg-brand-orange-light text-brand-orange font-semibold">
                          Editing Mode
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      {!isEditingInfo ? (
                        /* Read-Only View matching screenshot */
                        <div className="space-y-2.5 body-sm-regular text-left">
                          <div className="flex items-start justify-between">
                            <span className="text-primary-300 w-28 shrink-0">Full Name</span>
                            <span className="text-primary-500 font-medium text-right flex-1">
                              {instructor.name}
                            </span>
                          </div>

                          <div className="flex items-start justify-between">
                            <span className="text-primary-300 w-28 shrink-0">Email</span>
                            <span className="text-primary-500 font-medium font-mono text-[13px] text-right flex-1 truncate">
                              {instructor.email}
                            </span>
                          </div>

                          <div className="flex items-start justify-between">
                            <span className="text-primary-300 w-28 shrink-0">Phone</span>
                            <span className="text-primary-500 font-medium text-right flex-1">
                              {instructor.phone}
                            </span>
                          </div>

                          <div className="flex items-start justify-between">
                            <span className="text-primary-300 w-28 shrink-0">Bio</span>
                            <span className="text-primary-400 body-2xsm-regular leading-relaxed text-right flex-1 max-w-[280px]">
                              {instructor.bio}
                            </span>
                          </div>

                          <div className="flex items-start justify-between">
                            <span className="text-primary-300 w-28 shrink-0">Expertise</span>
                            <div className="flex flex-wrap items-center justify-end gap-1.5 flex-1">
                              {instructor.skills.slice(0, 4).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-0.5 rounded-md border border-dash bg-slate-50 body-2xsm-regular text-primary-400 font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                              {instructor.skills.length > 4 && (
                                <span className="px-1.5 py-0.5 rounded-md border border-dash bg-slate-50 body-2xsm-regular text-primary-300">
                                  +{instructor.skills.length - 4}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-start justify-between">
                            <span className="text-primary-300 w-28 shrink-0">Join Date</span>
                            <span className="text-primary-500 font-medium text-right flex-1">
                              {instructor.joinDate}
                            </span>
                          </div>

                          <div className="flex items-start justify-between">
                            <span className="text-primary-300 w-28 shrink-0">Status</span>
                            <div className="text-right flex-1">
                              <ToneBadge
                                tone={instructor.status === "Active" ? "green" : "red"}
                                size="sm"
                              >
                                {instructor.status}
                              </ToneBadge>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Inline Edit View */
                        <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                          <div>
                            <label className="block body-2xsm-regular text-primary-400 mb-1">
                              Full Name <span className="text-red">*</span>
                            </label>
                            <input
                              type="text"
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              className="w-full h-9 px-3 rounded-lg border border-dash body-sm-regular text-primary-500 focus:outline-none focus:border-brand-orange bg-white"
                              placeholder="Instructor name"
                            />
                            {errors.name && (
                              <span className="body-2xsm-regular text-red mt-0.5 block">
                                {errors.name}
                              </span>
                            )}
                          </div>

                          <div>
                            <label className="block body-2xsm-regular text-primary-400 mb-1">
                              Email Address <span className="text-red">*</span>
                            </label>
                            <input
                              type="email"
                              value={formEmail}
                              onChange={(e) => setFormEmail(e.target.value)}
                              className="w-full h-9 px-3 rounded-lg border border-dash body-sm-regular text-primary-500 focus:outline-none focus:border-brand-orange bg-white font-mono text-[13px]"
                              placeholder="email@example.com"
                            />
                            {errors.email && (
                              <span className="body-2xsm-regular text-red mt-0.5 block">
                                {errors.email}
                              </span>
                            )}
                          </div>

                          <div>
                            <label className="block body-2xsm-regular text-primary-400 mb-1">
                              Phone Number <span className="text-red">*</span>
                            </label>
                            <input
                              type="text"
                              value={formPhone}
                              onChange={(e) => setFormPhone(e.target.value)}
                              className="w-full h-9 px-3 rounded-lg border border-dash body-sm-regular text-primary-500 focus:outline-none focus:border-brand-orange bg-white"
                              placeholder="+880 1..."
                            />
                            {errors.phone && (
                              <span className="body-2xsm-regular text-red mt-0.5 block">
                                {errors.phone}
                              </span>
                            )}
                          </div>

                          <div>
                            <label className="block body-2xsm-regular text-primary-400 mb-1">
                              Bio <span className="text-red">*</span>
                            </label>
                            <textarea
                              rows={3}
                              value={formBio}
                              onChange={(e) => setFormBio(e.target.value)}
                              className="w-full p-2.5 rounded-lg border border-dash body-sm-regular text-primary-500 focus:outline-none focus:border-brand-orange bg-white resize-none"
                              placeholder="Brief professional background..."
                            />
                            {errors.bio && (
                              <span className="body-2xsm-regular text-red mt-0.5 block">
                                {errors.bio}
                              </span>
                            )}
                          </div>

                          <div>
                            <label className="block body-2xsm-regular text-primary-400 mb-1.5">
                              Status <span className="text-red">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setFormStatus("Active")}
                                className={`py-1.5 px-3 rounded-lg body-sm-medium font-semibold border transition-all cursor-pointer ${
                                  formStatus === "Active"
                                    ? "bg-green-bg text-green border-green"
                                    : "bg-white text-primary-400 border-dash hover:bg-slate-50"
                                }`}
                              >
                                Active
                              </button>
                              <button
                                type="button"
                                onClick={() => setFormStatus("Inactive")}
                                className={`py-1.5 px-3 rounded-lg body-sm-medium font-semibold border transition-all cursor-pointer ${
                                  formStatus === "Inactive"
                                    ? "bg-red-14 text-red border-red"
                                    : "bg-white text-primary-400 border-dash hover:bg-slate-50"
                                }`}
                              >
                                Inactive
                              </button>
                            </div>
                          </div>

                          {/* Inline Edit Action Buttons */}
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-dash">
                            <SecondaryButton
                              onClick={handleCancelEdit}
                              disabled={isSaving}
                              size="sm"
                            >
                              Cancel
                            </SecondaryButton>
                            <PrimaryButton
                              onClick={handleSaveEdit}
                              isLoading={isSaving}
                              leftIcon={<Check className="w-3.5 h-3.5" />}
                              size="sm"
                            >
                              Save Changes
                            </PrimaryButton>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Courses Card with edge-to-edge header border */}
                  <div className="rounded-xl border border-dash bg-white shadow-2xs overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-dash bg-white">
                      <h4 className="title-sm text-primary-500 font-bold">
                        Recent Courses
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveTab("courses")}
                        className="body-sm-medium text-brand-orange font-bold hover:text-brand-orange-hover hover:underline transition-colors cursor-pointer"
                      >
                        View All
                      </button>
                    </div>

                    <div className="p-4 space-y-3">
                      {instructor.courses.length > 0 ? (
                        instructor.courses.slice(0, 3).map((course) => (
                          <div
                            key={course.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                            onClick={() => setActiveTab("courses")}
                          >
                            <div className="w-11 h-11 rounded-lg bg-slate-100 overflow-hidden relative shrink-0">
                              {course.thumbnailUrl ? (
                                <Image
                                  src={course.thumbnailUrl}
                                  alt={course.title}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              ) : (
                                <BookOpen className="w-5 h-5 text-primary-300 m-auto mt-3" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="body-sm-medium text-primary-500 font-semibold truncate block group-hover:text-brand-orange transition-colors">
                                {course.title}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5 body-2xsm-regular text-primary-400">
                                <span>{course.studentsCount} students</span>
                                <span className="text-primary-300">•</span>
                                <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                                  <Star className="w-3 h-3 fill-amber-500" />
                                  {course.rating.toFixed(1)} ({course.reviewsCount})
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-primary-300 group-hover:text-primary-500 transition-colors shrink-0" />
                          </div>
                        ))
                      ) : (
                        <p className="body-sm-regular text-primary-300 text-center py-4">
                          No courses published yet.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Send Message Form Drawer Overlay */}
                  {isSendMessageOpen && (
                    <div className="p-4 rounded-xl border border-brand-orange/30 bg-brand-orange-light/20 space-y-3 animate-in fade-in duration-200 text-left">
                      <div className="flex items-center justify-between">
                        <span className="body-sm-medium text-primary-500 font-bold flex items-center gap-1.5">
                          <Mail className="w-4 h-4 text-brand-orange" />
                          <span>Direct Message to {instructor.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsSendMessageOpen(false)}
                          className="text-primary-300 hover:text-primary-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={messageSubject}
                        onChange={(e) => setMessageSubject(e.target.value)}
                        placeholder="Subject..."
                        className="w-full h-8 px-3 rounded-lg border border-dash body-sm-regular text-primary-500 focus:outline-none focus:border-brand-orange bg-white"
                      />
                      <textarea
                        rows={3}
                        value={messageBody}
                        onChange={(e) => setMessageBody(e.target.value)}
                        placeholder="Write message to instructor..."
                        className="w-full p-2.5 rounded-lg border border-dash body-sm-regular text-primary-500 focus:outline-none focus:border-brand-orange bg-white resize-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <SecondaryButton
                          onClick={() => setIsSendMessageOpen(false)}
                          size="sm"
                        >
                          Cancel
                        </SecondaryButton>
                        <PrimaryButton
                          onClick={handleSendMessage}
                          leftIcon={<Send className="w-3.5 h-3.5" />}
                          size="sm"
                        >
                          Send Email
                        </PrimaryButton>
                      </div>
                    </div>
                  )}

                  {/* Dual Action Buttons matching screenshot: Remove Instructor & Send Message */}
                  <div className="pt-2 grid grid-cols-2 gap-3">
                    {showDeleteConfirm ? (
                      <div className="col-span-2 p-3 rounded-xl border border-red/30 bg-red-14/10 space-y-2 animate-in fade-in duration-150">
                        <p className="body-sm-medium text-red font-semibold">
                          Confirm removal of this instructor?
                        </p>
                        <p className="body-2xsm-regular text-primary-400">
                          This will deactivate their portal access and unassign their courses.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleDelete}
                            className="px-3 py-1.5 rounded-lg bg-red text-white body-sm-medium font-semibold hover:bg-red-dark transition-colors cursor-pointer"
                          >
                            Yes, Remove
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-3 py-1.5 rounded-lg border border-dash bg-white text-primary-400 body-sm-medium hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="py-2.5 px-3 rounded-xl border border-red text-red hover:bg-red-14 body-sm-medium font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red shrink-0" />
                        <span className="truncate">Remove Instructor</span>
                      </button>
                    )}

                    {!showDeleteConfirm && (
                      <button
                        type="button"
                        onClick={() => setIsSendMessageOpen((prev) => !prev)}
                        className="py-2.5 px-3 rounded-xl bg-brand-orange text-white hover:bg-brand-orange-hover body-sm-medium font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Send className="w-4 h-4 shrink-0" />
                        <span className="truncate">Send Message</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: COURSES */}
              {activeTab === "courses" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="title-sm text-primary-500 font-bold">
                      Published Courses ({instructor.courses.length})
                    </span>
                  </div>

                  {instructor.courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-3.5 rounded-xl border border-dash bg-white shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden relative shrink-0">
                            {course.thumbnailUrl ? (
                              <Image
                                src={course.thumbnailUrl}
                                alt={course.title}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <BookOpen className="w-6 h-6 text-primary-300 m-auto mt-3" />
                            )}
                          </div>
                          <div>
                            <span className="body-sm-medium text-primary-500 font-bold block">
                              {course.title}
                            </span>
                            <span className="body-2xsm-regular text-primary-300">
                              {course.category} • {course.lessonsCount || 24} Lessons
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-dash text-center">
                        <div className="p-2 rounded-lg bg-slate-50">
                          <span className="body-2xsm-regular text-primary-300 block">Students</span>
                          <span className="body-sm-medium text-primary-500 font-bold">
                            {course.studentsCount}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50">
                          <span className="body-2xsm-regular text-primary-300 block">Rating</span>
                          <span className="body-sm-medium text-amber-500 font-bold flex items-center justify-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-500" />
                            {course.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50">
                          <span className="body-2xsm-regular text-primary-300 block">Revenue</span>
                          <span className="body-sm-medium text-green font-bold">
                            {course.revenue}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: STUDENTS */}
              {activeTab === "students" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="title-sm text-primary-500 font-bold">
                      Enrolled Students ({instructor.studentsCount})
                    </span>
                  </div>

                  {(instructor.recentStudents || []).length > 0 ? (
                    (instructor.recentStudents || []).map((std) => (
                      <div
                        key={std.id}
                        className="p-3 rounded-xl border border-dash bg-white shadow-2xs flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Avatar
                            src={std.avatarUrl}
                            name={std.name}
                            size={34}
                            className="rounded-full ring-1 ring-dash shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="body-sm-medium text-primary-500 font-bold truncate block">
                              {std.name}
                            </span>
                            <span className="body-2xsm-regular text-primary-300 truncate block">
                              {std.courseTitle}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="body-2xsm-regular text-primary-400 block font-semibold">
                            {std.progress}% Complete
                          </span>
                          <span className="body-2xsm-regular text-primary-300 block">
                            Joined {std.joinDate}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center rounded-xl border border-dash bg-slate-50">
                      <p className="body-sm-regular text-primary-400">
                        {instructor.studentsCount} active students currently enrolled across {instructor.coursesCount} courses.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: REVENUE */}
              {activeTab === "revenue" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-dash bg-white shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-dash">
                      <h4 className="title-sm text-primary-500 font-bold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green" />
                        <span>Revenue Breakdown</span>
                      </h4>
                      <ToneBadge tone="green" size="sm">
                        80% Payout Share
                      </ToneBadge>
                    </div>

                    <div className="space-y-2.5 body-sm-regular">
                      <div className="flex items-center justify-between">
                        <span className="text-primary-300">Lifetime Gross Sales</span>
                        <span className="text-primary-500 font-bold">{instructor.totalRevenue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-300">Instructor Share (80%)</span>
                        <span className="text-green font-bold">
                          ${Math.round(instructor.numericRevenue * 0.8).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-300">Platform Fee (20%)</span>
                        <span className="text-primary-400 font-medium">
                          ${Math.round(instructor.numericRevenue * 0.2).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-dash">
                        <span className="text-primary-500 font-semibold">Next Scheduled Payout</span>
                        <span className="text-primary-500 font-bold">Nov 01, 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SETTINGS */}
              {activeTab === "settings" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-dash bg-white shadow-2xs space-y-3 text-left">
                    <h4 className="title-sm text-primary-500 font-bold pb-2 border-b border-dash">
                      Instructor Preferences & Permissions
                    </h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="body-sm-medium text-primary-500 font-semibold block">
                            Direct Course Publishing
                          </span>
                          <span className="body-2xsm-regular text-primary-300">
                            Allow publishing lessons without admin pre-review
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 accent-brand-orange rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-dash">
                        <div>
                          <span className="body-sm-medium text-primary-500 font-semibold block">
                            Student Direct Messaging
                          </span>
                          <span className="body-2xsm-regular text-primary-300">
                            Permit students to message instructor privately
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 accent-brand-orange rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-dash">
                        <div>
                          <span className="body-sm-medium text-primary-500 font-semibold block">
                            Automated Payouts
                          </span>
                          <span className="body-2xsm-regular text-primary-300">
                            Direct monthly wire to instructor bank account
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 accent-brand-orange rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default InstructorDetailsDrawer;
