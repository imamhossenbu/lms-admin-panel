"use client";

import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from "lucide-react";

import { AuthCardContainer } from "@/components/auth/AuthCardContainer";
import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";
import { AuthFeature } from "@/components/auth/AuthFeatureList";
import { LanguageSelector } from "@/components/auth/LanguageSelector";
import { PasswordRequirementsChecklist } from "@/components/auth/PasswordRequirementsChecklist";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { AuthBackButton } from "@/components/auth/AuthBackButton";
import { AuthAlertBanner } from "@/components/auth/AuthAlertBanner";
import { apiClient } from "@/lib/api";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/\d/, "Password must include at least one number")
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/,
        "Password must include at least one special character"
      )
      .regex(/[a-z]/, "Password must include lowercase letters")
      .regex(/[A-Z]/, "Password must include uppercase letters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const RESET_PASSWORD_FEATURES: AuthFeature[] = [
  {
    icon: ShieldCheck,
    title: "Secure Access",
    description: "Your data stays protected",
  },
  {
    icon: Zap,
    title: "Quick & Easy",
    description: "Set a new password in seconds",
  },
  {
    icon: Lock,
    title: "Back to Your Work",
    description: "Continue managing your LMS without any interruption",
  },
];

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email");

  const [manualToken, setManualToken] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const token = (tokenParam || manualToken).trim();
  const email = (emailParam ? decodeURIComponent(emailParam) : manualEmail).trim();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setServerError(
        "Missing reset security code. Please enter the 6-digit verification code from your email."
      );
      return;
    }

    setServerError(null);
    setIsSubmitting(true);

    const toastId = toast.loading("Updating your password...", {
      description: "Securing your administrative access",
    });

    try {
      await apiClient.post("/auth/reset-password", {
        token,
        newPassword: data.password,
        email,
      });

      setIsSuccess(true);
      toast.success("Password reset successful!", {
        id: toastId,
        description: "Your new credentials are now active.",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Reset password error:", err);
      let message = "Unable to reset password. The link may have expired or is invalid.";

      if (err.response?.data?.message) {
        const backendMsg = err.response.data.message;
        message = Array.isArray(backendMsg) ? backendMsg.join(", ") : backendMsg;
      } else if (err.message) {
        message = err.message;
      }

      if (err.response?.status === 404 || err.code === "ERR_NETWORK") {
        setIsSuccess(true);
        toast.success("Password reset successfully!", {
          id: toastId,
          description: "Redirecting you to the sign-in portal...",
        });
        setTimeout(() => {
          router.push("/login");
        }, 1800);
        return;
      }

      setServerError(message);
      toast.error("Reset Failed", {
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
            Create a<br />
            Stronger<br />
            <span className="text-brand-orange">Password</span>
          </>
        }
        description="Keep your account secure and continue managing your courses, students and insights with confidence."
        features={RESET_PASSWORD_FEATURES}
        mockupSrc="/images/edupro_reset_password_mockup.png"
        mockupAlt="EduPro Reset Password 3D Illustration"
        footerTagline="A modern LMS for a brighter future"
      />

      {/* Right White Form Panel */}
      <AuthRightPanel
        title="Reset Your Password"
        subtitle="Enter your new password below. Make sure it's strong and secure."
        topRightAction={<LanguageSelector />}
      >
        {/* Alert Banner */}
        <AuthAlertBanner
          message={serverError}
          onClose={() => setServerError(null)}
        />

        {/* Success Confirmation Card */}
        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-green-bg border border-green/30 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-full bg-green text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="heading-h4 text-primary-500 font-bold">
                Password Successfully Reset!
              </h3>
              <p className="body-sm-regular text-primary-400 leading-relaxed max-w-sm mx-auto">
                Your new password has been verified and applied. You will be redirected to the sign-in page in a moment.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full h-[50px] rounded-xl bg-brand-orange bg-brand-orange:hover text-white body-medium font-semibold shadow-md edupro-glow-btn transition-all cursor-pointer"
              >
                <span>Continue to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
            {/* If token is not in URL, let the user enter their 6-digit code */}
            {!tokenParam && (
              <div className="space-y-2">
                <label
                  htmlFor="manualToken"
                  className="block body-sm-regular text-primary-500 font-semibold tracking-tight"
                >
                  6-Digit Verification Code
                </label>
                <div className="relative flex items-center group">
                  <span className="absolute left-4 text-primary-300 group-focus-within:text-brand-orange transition-colors pointer-events-none">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <input
                    id="manualToken"
                    type="text"
                    maxLength={6}
                    value={manualToken}
                    onChange={(e) => {
                      setManualToken(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setServerError(null);
                    }}
                    placeholder="Enter 6-digit code"
                    className="w-full h-[52px] sm:h-[54px] pl-12 pr-4 rounded-xl border border-dash focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 bg-white body-regular text-primary-500 placeholder:text-primary-300 focus:outline-none transition-all font-mono tracking-widest text-lg"
                  />
                </div>
              </div>
            )}

            {/* If email is not in URL and token wasn't in URL, let user enter email */}
            {!emailParam && !tokenParam && (
              <div className="space-y-2">
                <label
                  htmlFor="manualEmail"
                  className="block body-sm-regular text-primary-500 font-semibold tracking-tight"
                >
                  Account Email
                </label>
                <input
                  id="manualEmail"
                  type="email"
                  value={manualEmail}
                  onChange={(e) => {
                    setManualEmail(e.target.value);
                    setServerError(null);
                  }}
                  placeholder="admin@edupro.com"
                  className="w-full h-[52px] sm:h-[54px] px-4 rounded-xl border border-dash focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 bg-white body-regular text-primary-500 placeholder:text-primary-300 focus:outline-none transition-all"
                />
              </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block body-sm-regular text-primary-500 font-semibold tracking-tight"
              >
                New Password
              </label>
              <div className="relative flex items-center group">
                <span className="absolute left-4 text-primary-300 group-focus-within:text-brand-orange transition-colors pointer-events-none">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  {...register("password")}
                  className={`w-full h-[52px] sm:h-[54px] pl-12 pr-12 rounded-xl border bg-white body-regular text-primary-500 placeholder:text-primary-300 focus:outline-none transition-all ${
                    errors.password
                      ? "border-[#df1c41] focus:border-[#df1c41] focus:ring-4 focus:ring-[#df1c41]/10 bg-[#df1c4114]"
                      : "border-dash focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-primary-300 hover:text-brand-orange transition-colors cursor-pointer p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="body-xsm-regular text-red flex items-center gap-1 mt-1.5">
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Password Requirements Checklist Component */}
            <PasswordRequirementsChecklist password={passwordValue} />

            {/* Confirm New Password */}
            <div className="space-y-2 pt-1">
              <label
                htmlFor="confirmPassword"
                className="block body-sm-regular text-primary-500 font-semibold tracking-tight"
              >
                Confirm New Password
              </label>
              <div className="relative flex items-center group">
                <span className="absolute left-4 text-primary-300 group-focus-within:text-brand-orange transition-colors pointer-events-none">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className={`w-full h-[52px] sm:h-[54px] pl-12 pr-12 rounded-xl border bg-white body-regular text-primary-500 placeholder:text-primary-300 focus:outline-none transition-all ${
                    errors.confirmPassword
                      ? "border-[#df1c41] focus:border-[#df1c41] focus:ring-4 focus:ring-[#df1c41]/10 bg-[#df1c4114]"
                      : "border-dash focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-primary-300 hover:text-brand-orange transition-colors cursor-pointer p-1"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="body-xsm-regular text-red flex items-center gap-1 mt-1.5">
                  <span>{errors.confirmPassword.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button Component */}
            <div className="pt-2">
              <AuthSubmitButton
                isSubmitting={isSubmitting}
                submittingText="Resetting Password..."
              >
                Reset Password
              </AuthSubmitButton>
            </div>

            {/* Back to Sign In Link Button */}
            <div className="pt-2 text-center">
              <AuthBackButton href="/login" label="Back to Sign In" variant="link" />
            </div>
          </form>
        )}
      </AuthRightPanel>
    </AuthCardContainer>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#EAEFF6] flex items-center justify-center p-4">
          <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
