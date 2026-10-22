"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/validations/authSchema";
import { authApi } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  BookOpen,
  Users,
  BarChart3,
  Sparkles,
  X,
} from "lucide-react";

import { AuthCardContainer } from "@/components/auth/AuthCardContainer";
import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";
import { AuthFeature } from "@/components/auth/AuthFeatureList";
import { AuthAlertBanner } from "@/components/auth/AuthAlertBanner";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";

const LOGIN_FEATURES: AuthFeature[] = [
  {
    icon: BookOpen,
    title: "Course Management",
    description: "Create and organize courses easily",
  },
  {
    icon: Users,
    title: "Student & Teacher Management",
    description: "Grow your learning community",
  },
  {
    icon: BarChart3,
    title: "Powerful Analytics",
    description: "Track growth and performance",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Learning",
    description: "Smarter education, better results",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "imam.adsfixter@gmail.com",
      password: "admin123",
      rememberMe: true,
    },
  });

  const handleFillDemo = () => {
    setValue("email", "imam.adsfixter@gmail.com", { shouldValidate: true });
    setValue("password", "admin123", { shouldValidate: true });
    setServerError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    const toastId = toast.loading("Signing in to EduPro...", {
      description: "Verifying your administrator credentials",
    });

    try {
      const loginRes = await authApi.login({
        email: data.email.trim(),
        password: data.password,
      });

      if (!loginRes.token) {
        throw new Error("No authorization token received from gateway.");
      }

      localStorage.setItem("admin_token", loginRes.token);

      const profile = await authApi.getProfile();

      const roleUpper = (profile.role || "").toUpperCase();
      const isAdmin = roleUpper === "ADMIN" || roleUpper === "SUPER_ADMIN";

      if (!isAdmin) {
        localStorage.removeItem("admin_token");
        throw new Error(
          `Unauthorized role: [${profile.role}]. This portal is restricted to system administrators.`
        );
      }

      dispatch(
        setCredentials({
          token: loginRes.token,
          user: profile,
        })
      );

      toast.success(`Welcome back, ${profile.name || "Administrator"}!`, {
        id: toastId,
        description: "Redirecting to your EduPro dashboard...",
      });

      router.push("/");
    } catch (err: any) {
      console.error("Login attempt failed:", err);
      let message = "Authentication failed. Please verify your credentials.";

      if (err.response?.data?.message) {
        const backendMsg = err.response.data.message;
        message = Array.isArray(backendMsg) ? backendMsg.join(", ") : backendMsg;
      } else if (err.message) {
        message = err.message;
      }

      setServerError(message);

      toast.error("Authentication Error", {
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
            Empower<br />
            Learning.<br />
            Build Skills.<br />
            <span className="text-brand-orange">Grow.</span>
          </>
        }
        description={
          <>
            Manage courses, students, learning<br className="hidden sm:inline" />
            and insights—all in one place.
          </>
        }
        features={LOGIN_FEATURES}
        mockupSrc="/images/edupro_mockup_clean_flush.png"
        mockupAlt="EduPro 3D Dashboard Mockup"
        topBadge={
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-brand-orange shadow-sm shadow-[#FF5B00]" />
            <span>Manage</span>
            <span className="text-slate-500">•</span>
            <span>Teach</span>
            <span className="text-slate-500">•</span>
            <span>Grow</span>
          </div>
        }
      />

      {/* Right White Form Panel */}
      <AuthRightPanel
        title="Welcome back 👋"
        subtitle="Sign in to continue to your LMS dashboard."
      >
        {/* Server Error Alert Banner */}
        <AuthAlertBanner
          message={serverError}
          title="Authentication Notice"
          onClose={() => setServerError(null)}
        />

        {/* Credentials Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          {/* Email Address */}
          <div className="space-y-2">
            <label
              htmlFor="email-address"
              className="block body-sm-regular text-primary-500 font-semibold tracking-tight"
            >
              Email Address
            </label>
            <div className="relative flex items-center group">
              <span className="absolute left-4 text-primary-300 group-focus-within:text-brand-orange transition-colors pointer-events-none">
                <Mail className="w-5 h-5" />
              </span>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                {...register("email")}
                className={`w-full h-[52px] sm:h-[54px] pl-12 pr-4 rounded-xl border bg-white body-regular text-primary-500 placeholder:text-primary-300 focus:outline-none transition-all ${
                  errors.email
                    ? "border-red focus:border-red focus:ring-4 focus:ring-red/10 bg-red-14"
                    : "border-dash focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10"
                }`}
              />
            </div>
            {errors.email && (
              <p className="body-xsm-regular text-red flex items-center gap-1 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password-field"
                className="block body-sm-regular text-primary-500 font-semibold tracking-tight"
              >
                Password
              </label>
              {capsLockActive && (
                <span className="body-2xsm-regular text-[#92400e] bg-[#fef3c7] px-2 py-0.5 rounded border border-[#fde68a]">
                  Caps Lock On
                </span>
              )}
            </div>
            <div className="relative flex items-center group">
              <span className="absolute left-4 text-primary-300 group-focus-within:text-brand-orange transition-colors pointer-events-none">
                <Lock className="w-5 h-5" />
              </span>
              <input
                id="password-field"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                onKeyDown={handleKeyDown}
                {...register("password")}
                className={`w-full h-[52px] sm:h-[54px] pl-12 pr-12 rounded-xl border bg-white body-regular text-primary-500 placeholder:text-primary-300 focus:outline-none transition-all ${
                  errors.password
                    ? "border-red focus:border-red focus:ring-4 focus:ring-red/10 bg-red-14"
                    : "border-dash focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-primary-300 hover:text-brand-orange p-1 transition-colors cursor-pointer"
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
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.password.message}</span>
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password Link */}
          <div className="flex items-center justify-between pt-1 pb-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="w-4 h-4 rounded border-dash text-brand-orange focus:ring-brand-orange accent-[#FF5B00] cursor-pointer"
              />
              <span className="body-sm-regular text-primary-400">
                Remember me
              </span>
            </label>

            <Link
              href="/forgot-password"
              className="body-sm-medium font-semibold text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <div className="pt-2">
            <AuthSubmitButton
              isSubmitting={isSubmitting}
              submittingText="Signing In..."
            >
              Sign In
            </AuthSubmitButton>
          </div>
        </form>
      </AuthRightPanel>
    </AuthCardContainer>
  );
}
