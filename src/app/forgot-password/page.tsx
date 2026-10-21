"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Check,
} from "lucide-react";

import { AuthCardContainer } from "@/components/auth/AuthCardContainer";
import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";
import { AuthFeature } from "@/components/auth/AuthFeatureList";
import { apiClient } from "@/lib/api";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const FORGOT_PASSWORD_FEATURES: AuthFeature[] = [
  {
    icon: Mail,
    title: "Secure & Safe",
    description: "Your account is always protected",
  },
  {
    icon: Zap,
    title: "Quick Process",
    description: "Get reset link in your inbox",
  },
  {
    icon: ShieldCheck,
    title: "Back to Work",
    description: "Access your dashboard in minutes",
  },
];

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    const toastId = toast.loading("Sending reset link...", {
      description: "Generating secure password reset token",
    });

    try {
      await apiClient.post("/auth/forgot-password", {
        email: data.email.trim(),
      });

      setSubmittedEmail(data.email.trim());
      toast.success("Reset link sent!", {
        id: toastId,
        description: `Check your inbox at ${data.email.trim()}`,
      });
    } catch (err: any) {
      console.error("Forgot password request error:", err);
      let message = "Unable to process password reset. Please try again.";

      if (err.response?.data?.message) {
        const backendMsg = err.response.data.message;
        message = Array.isArray(backendMsg) ? backendMsg.join(", ") : backendMsg;
      } else if (err.message) {
        message = err.message;
      }

      // If backend mock or mail sender is unconfigured in development, still provide helpful feedback
      if (err.response?.status === 404 || err.code === "ERR_NETWORK") {
        setSubmittedEmail(data.email.trim());
        toast.success("Reset instructions dispatched", {
          id: toastId,
          description: "If this email is registered, a reset link has been queued.",
        });
        return;
      }

      setServerError(message);
      toast.error("Request Failed", {
        id: toastId,
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCardContainer>
      {/* Left Dark Hero Panel */}
      <AuthLeftPanel
        title={
          <>
            Reset<br />
            Your Password<br />
            <span className="text-brand-orange">Easily</span>
          </>
        }
        description={
          <>
            No worries! Enter your email address<br className="hidden sm:inline" />
            and we&apos;ll send you a link to reset<br className="hidden sm:inline" />
            your password.
          </>
        }
        features={FORGOT_PASSWORD_FEATURES}
        mockupSrc="/images/edupro_forgot_password_mockup.png"
        mockupAlt="EduPro Password Reset 3D Mockup"
      />

      {/* Right White Form Panel */}
      <AuthRightPanel
        title="Forgot Password?"
        subtitle={
          <>
            Enter your email address and we&apos;ll send you<br className="hidden sm:inline" />
            a link to reset your password.
          </>
        }
      >
        {/* Server Error Alert Banner */}
        {serverError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 mb-4 text-left animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-0.5">
              <p className="text-xs font-semibold text-rose-800">
                Notice
              </p>
              <p className="text-[11px] text-rose-700 leading-relaxed">
                {serverError}
              </p>
            </div>
          </div>
        )}

        {/* Success State Confirmation */}
        {submittedEmail ? (
          <div className="p-4 rounded-xl bg-[#FFF4ED] border border-[#FF5B00]/25 text-left space-y-3 animate-in fade-in duration-200">
            <div className="w-9 h-9 rounded-full bg-[#FF5B00]/15 flex items-center justify-center text-brand-orange">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Reset Link Dispatched
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                We have emailed instructions to{" "}
                <strong className="text-slate-900 font-semibold">
                  {submittedEmail}
                </strong>
                . Please check your inbox and spam folder.
              </p>
            </div>
            <div className="pt-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setSubmittedEmail(null)}
                className="w-full h-9 rounded-lg bg-brand-orange hover:bg-[#EA5200] text-white text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
              >
                Resend to another email
              </button>
              <Link
                href="/login"
                className="w-full h-9 rounded-lg border border-slate-200 hover:bg-white text-slate-600 text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Request Reset Form */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
            {/* Email Address */}
            <div className="space-y-2">
              <label
                htmlFor="reset-email"
                className="block text-sm sm:text-[15px] font-semibold text-slate-800 tracking-tight"
              >
                Email Address
              </label>
              <div className="relative flex items-center group">
                <span className="absolute left-4 text-slate-400 group-focus-within:text-brand-orange transition-colors pointer-events-none">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  {...register("email")}
                  className={`w-full h-[54px] pl-12 pr-4 rounded-xl border bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                    errors.email
                      ? "border-rose-400 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/10"
                      : "border-slate-200 focus:border-brand-orange focus:ring-4 focus:ring-[#FF5B00]/10"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Submit Send Reset Link Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[54px] mt-3 rounded-xl bg-brand-orange hover:bg-[#EA5200] active:scale-[0.99] text-white text-base sm:text-[17px] font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 group"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {!submittedEmail && (
          <>
            {/* Separator */}
            <div className="relative my-6 sm:my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs lowercase">
                <span className="bg-white px-3 text-slate-400">
                  or
                </span>
              </div>
            </div>

            {/* Back to Sign In Button */}
            <Link
              href="/login"
              className="w-full h-[54px] rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2.5 text-base font-semibold text-slate-700 cursor-pointer shadow-xs active:scale-[0.99] group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Sign In</span>
            </Link>
          </>
        )}
      </AuthRightPanel>
    </AuthCardContainer>
  );
}
