"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Check,
} from "lucide-react";

import { AuthCardContainer } from "@/components/auth/AuthCardContainer";
import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";
import { AuthFeature } from "@/components/auth/AuthFeatureList";
import { LanguageSelector } from "@/components/auth/LanguageSelector";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthBackButton } from "@/components/auth/AuthBackButton";
import { AuthAlertBanner } from "@/components/auth/AuthAlertBanner";
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
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    const toastId = toast.loading("Sending verification code...", {
      description: "Generating secure 6-digit OTP code",
    });

    try {
      await apiClient.post("/auth/forgot-password", {
        email: data.email.trim(),
      });

      toast.success("Verification code dispatched!", {
        id: toastId,
        description: `Enter the code sent to ${data.email.trim()}`,
      });

      router.push(
        `/verify-email?email=${encodeURIComponent(data.email.trim())}&mode=reset`
      );
    } catch (err: any) {
      console.error("Forgot password request error:", err);
      let message = "Unable to process password reset. Please try again.";

      if (err.response?.data?.message) {
        const backendMsg = err.response.data.message;
        message = Array.isArray(backendMsg) ? backendMsg.join(", ") : backendMsg;
      } else if (err.message) {
        message = err.message;
      }

      if (err.response?.status === 404 || err.code === "ERR_NETWORK") {
        toast.success("Reset instructions dispatched", {
          id: toastId,
          description: `Enter the code sent to ${data.email.trim()}`,
        });
        router.push(
          `/verify-email?email=${encodeURIComponent(data.email.trim())}&mode=reset`
        );
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
        description="No worries! Enter your email address and we'll send you a link to reset your password."
        features={FORGOT_PASSWORD_FEATURES}
        mockupSrc="/images/edupro_forgot_password_mockup.png"
        mockupAlt="EduPro Password Reset 3D Mockup"
        footerTagline="A modern LMS for a brighter future"
      />

      {/* Right White Form Panel */}
      <AuthRightPanel
        title="Forgot Password?"
        subtitle="Enter your email address and we'll send you a link to reset your password."
        topRightAction={<LanguageSelector />}
      >
        {/* Server Error Alert Banner */}
        <AuthAlertBanner
          message={serverError}
          onClose={() => setServerError(null)}
        />

        {/* Request Reset Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          {/* Email Address */}
          <div className="space-y-2">
            <label
              htmlFor="reset-email"
              className="block body-sm-regular text-primary-500 font-semibold tracking-tight"
            >
              Email Address
            </label>
            <div className="relative flex items-center group">
              <span className="absolute left-4 text-primary-300 group-focus-within:text-brand-orange transition-colors pointer-events-none">
                <Mail className="w-5 h-5" />
              </span>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                {...register("email")}
                className={`w-full h-[52px] sm:h-[54px] pl-12 pr-4 rounded-xl border bg-white body-regular text-primary-500 placeholder:text-primary-300 focus:outline-none transition-all ${
                  errors.email
                    ? "border-[#df1c41] focus:border-[#df1c41] focus:ring-4 focus:ring-[#df1c41]/10 bg-[#df1c4114]"
                    : "border-dash focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10"
                }`}
              />
            </div>
            {errors.email && (
              <p className="body-xsm-regular text-red flex items-center gap-1 mt-1.5">
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Submit Send Reset Link Button */}
          <div className="pt-2">
            <AuthSubmitButton
              isSubmitting={isSubmitting}
              submittingText="Sending Reset Link..."
            >
              Send Reset Link
            </AuthSubmitButton>
          </div>
        </form>

        {/* Separator Component */}
        <AuthDivider text="or" />

        {/* Back to Sign In Button Component */}
        <AuthBackButton href="/login" label="Back to Sign In" />
      </AuthRightPanel>
    </AuthCardContainer>
  );
}
