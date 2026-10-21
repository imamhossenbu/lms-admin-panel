"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/validations/authSchema";
import { authApi } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  BookOpen,
  Users,
  BarChart3,
  Check,
  X,
} from "lucide-react";
import { EduProLogo } from "@/components/ui/EduProLogo";

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoCopied, setDemoCopied] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const handleFillDemo = () => {
    setValue("email", "admin@lms.com", { shouldValidate: true });
    setValue("password", "admin123", { shouldValidate: true });
    setServerError(null);
    setDemoCopied(true);
    setTimeout(() => setDemoCopied(false), 2000);

    toast.info("Demo credentials loaded", {
      description: "admin@lms.com • admin123",
      icon: <Sparkles className="w-4 h-4 text-brand-orange" />,
    });
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
    <div className="min-h-screen w-full bg-[#E5E9F0] flex items-center justify-center p-0 md:p-6 lg:p-8 selection:bg-[#FF5B00] selection:text-white font-sans">
      {/* Main Elevated Card Container */}
      <div className="w-full max-w-[1440px] min-h-[780px] bg-white rounded-none md:rounded-[28px] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-[#E2E8F0] relative">

        {/* ================= LEFT DARK PANEL ================= */}
        <div className="w-full lg:w-[54%] xl:w-[56%] bg-gradient-to-b from-[#182434] via-[#141C27] to-[#121821] text-white relative flex flex-col justify-between overflow-hidden select-none min-h-[680px] lg:min-h-[820px]">
          
          {/* Ambient Lighting Behind Mockup */}
          <div className="absolute top-[160px] right-0 w-[460px] h-[460px] rounded-full bg-[#FF5B00]/15 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-20 w-[350px] h-[350px] rounded-full bg-[#1A253C]/60 blur-[90px] pointer-events-none" />

          {/* Right-Flush Large 3D Mockup Image (Zero ghost text, flush against the right divider) */}
          <div className="hidden lg:flex absolute right-0 bottom-0 top-0 h-full w-[54%] xl:w-[58%] pointer-events-none select-none items-end justify-end overflow-hidden z-0">
            <img
              src="/images/edupro_mockup_clean_flush.png"
              alt="EduPro 3D Dashboard Mockup"
              className="h-[88%] xl:h-[94%] max-h-[720px] w-auto max-w-none object-contain object-right-bottom"
            />
          </div>

          {/* Top Brand Header Row */}
          <div className="relative z-10 flex items-center justify-between p-7 sm:p-10 lg:pl-12 xl:pl-14 lg:pr-8 xl:pr-10 lg:pt-12 xl:pt-14 pb-0">
            <EduProLogo
              variant="light"
              size="md"
              subtitle="LMS Admin Panel"
            />

            {/* Pill: Manage • Teach • Grow */}
            <div className="hidden sm:flex items-center gap-2 body-xsm-medium text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-orange shadow-sm shadow-[#FF5B00]" />
              <span>Manage</span>
              <span className="text-slate-600">•</span>
              <span>Teach</span>
              <span className="text-slate-600">•</span>
              <span>Grow</span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="relative z-10 my-auto py-8 p-7 sm:p-10 lg:pl-12 xl:pl-14 lg:pr-4 xl:pr-4 max-w-full lg:max-w-[360px] xl:max-w-[430px]">
            {/* Hero Title */}
            <div className="space-y-3">
              <h1 className="display-h1 text-white tracking-tight leading-[1.12]">
                Empower<br />
                Learning.<br />
                Build Skills.<br />
                <span className="text-brand-orange">Grow.</span>
              </h1>
              <p className="body-medium text-slate-300 max-w-sm font-normal leading-relaxed">
                Manage courses, students, learning and insights—all in one place.
              </p>
            </div>

            {/* 4 Feature Items */}
            <div className="space-y-3.5 pt-6">
              {/* 1. Course Management */}
              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-white/90 shrink-0 group-hover:bg-[#FF5B00]/20 group-hover:border-[#FF5B00]/40 transition-all">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="body-sm-medium text-white tracking-tight">
                    Course Management
                  </h3>
                  <p className="body-xsm-regular text-slate-400">
                    Create and organize courses easily
                  </p>
                </div>
              </div>

              {/* 2. Student & Teacher Management */}
              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-white/90 shrink-0 group-hover:bg-[#FF5B00]/20 group-hover:border-[#FF5B00]/40 transition-all">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="body-sm-medium text-white tracking-tight">
                    Student & Teacher Management
                  </h3>
                  <p className="body-xsm-regular text-slate-400">
                    Grow your learning community
                  </p>
                </div>
              </div>

              {/* 3. Powerful Analytics */}
              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-white/90 shrink-0 group-hover:bg-[#FF5B00]/20 group-hover:border-[#FF5B00]/40 transition-all">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="body-sm-medium text-white tracking-tight">
                    Powerful Analytics
                  </h3>
                  <p className="body-xsm-regular text-slate-400">
                    Track growth and performance
                  </p>
                </div>
              </div>

              {/* 4. AI-Powered Learning */}
              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-white/90 shrink-0 group-hover:bg-[#FF5B00]/20 group-hover:border-[#FF5B00]/40 transition-all">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="body-sm-medium text-white tracking-tight">
                    AI-Powered Learning
                  </h3>
                  <p className="body-xsm-regular text-slate-400">
                    Smarter education, better results
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile-Only Mockup Display */}
            <div className="lg:hidden mt-6 flex justify-center">
              <img
                src="/images/edupro_mockup_clean_flush.png"
                alt="EduPro 3D Dashboard Mockup"
                className="w-full max-w-[340px] h-auto object-contain"
              />
            </div>
          </div>

          {/* Bottom Footnote */}
          <div className="relative z-10 p-7 sm:p-10 lg:pl-12 xl:pl-14 lg:pb-12 xl:pb-14 pt-0 flex items-center gap-2 body-xsm-regular text-slate-400">
            <span className="w-4 h-[2px] bg-brand-orange rounded-full inline-block" />
            <span>A modern LMS for a brighter future</span>
          </div>
        </div>

        {/* ================= RIGHT WHITE AUTH PANEL ================= */}
        <div className="w-full lg:w-[46%] bg-white p-7 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-between relative overflow-y-auto">
          
          {/* Centered Form Area */}
          <div className="my-auto max-w-[420px] w-full mx-auto py-4">
            
            {/* Header: EduPro Brand Logo */}
            <div className="mb-6">
              <EduProLogo
                variant="orange"
                size="lg"
                subtitle="LMS Admin Panel"
                className="mb-5"
              />

              <h2 className="h2-bold text-primary-500 tracking-tight">
                Welcome back 👋
              </h2>
              <p className="body-sm-regular subtext-500 mt-1.5">
                Sign in to continue to your LMS dashboard.
              </p>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="mb-5 p-3 rounded-xl bg-[#FFF4ED] border border-[#FF5B00]/20 flex items-center justify-between gap-3 text-left">
              <div className="min-w-0">
                <span className="body-xsm-medium font-bold text-brand-orange uppercase tracking-wider block">
                  Quick Demo Access
                </span>
                <span className="body-xsm-regular font-mono text-primary-400 truncate block">
                  admin@lms.com • admin123
                </span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="px-2.5 py-1 rounded-lg bg-brand-orange hover:bg-[#EA5200] text-white body-xsm-medium font-semibold shrink-0 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                {demoCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Loaded</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto Fill</span>
                  </>
                )}
              </button>
            </div>

            {/* Server Error Alert Banner */}
            {serverError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 mb-5 text-left animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <p className="body-sm-medium font-semibold text-rose-800">
                    Authentication Notice
                  </p>
                  <p className="body-xsm-regular text-rose-700 leading-relaxed">
                    {serverError}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setServerError(null)}
                  className="text-rose-400 hover:text-rose-700 p-0.5 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
              
              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email-address"
                  className="block body-sm-medium text-primary-400"
                >
                  Email Address
                </label>
                <div className="relative flex items-center group">
                  <span className="absolute left-3.5 text-primary-300 group-focus-within:text-brand-orange transition-colors pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="email-address"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    {...register("email")}
                    className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-white body-sm-regular text-primary-500 placeholder:text-[#969696] focus:outline-none transition-all ${
                      errors.email
                        ? "border-rose-400 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/10"
                        : "border-[#E2E8F0] focus:border-brand-orange focus:ring-4 focus:ring-[#FF5B00]/10"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="body-xsm-regular text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email.message}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password-field"
                    className="block body-sm-medium text-primary-400"
                  >
                    Password
                  </label>
                  {capsLockActive && (
                    <span className="body-xsm-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Caps Lock On
                    </span>
                  )}
                </div>
                <div className="relative flex items-center group">
                  <span className="absolute left-3.5 text-primary-300 group-focus-within:text-brand-orange transition-colors pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="password-field"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    onKeyDown={handleKeyDown}
                    {...register("password")}
                    className={`w-full h-11 pl-10 pr-11 rounded-xl border bg-white body-sm-regular text-primary-500 placeholder:text-[#969696] focus:outline-none transition-all ${
                      errors.password
                        ? "border-rose-400 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/10"
                        : "border-[#E2E8F0] focus:border-brand-orange focus:ring-4 focus:ring-[#FF5B00]/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-primary-300 hover:text-primary-500 p-1 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="body-xsm-regular text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.password.message}</span>
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="w-4 h-4 rounded border-slate-300 text-brand-orange focus:ring-brand-orange accent-[#FF5B00] cursor-pointer"
                  />
                  <span className="body-sm-regular text-primary-400">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    toast.info("Password Reset", {
                      description: "Please contact support or system admin to reset your credentials.",
                    })
                  }
                  className="body-sm-medium text-brand-orange hover:underline transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 mt-2 rounded-xl bg-brand-orange hover:bg-[#EA5200] active:scale-[0.99] text-white body-medium font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-orange-500/20 group"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="body-medium">Signing In...</span>
                  </>
                ) : (
                  <>
                    <span className="body-medium">Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EDEDED]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 body-xsm-medium subtext-500 tracking-wider">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            {/* Social Login (Google Only) */}
            <button
              type="button"
              onClick={() =>
                toast.info("OAuth Sign-In", {
                  description: "Google Single Sign-On initiated.",
                })
              }
              className="w-full h-11 rounded-xl border border-[#EDEDED] hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2.5 body-sm-medium text-primary-400 cursor-pointer shadow-2xs"
            >
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span>Continue with Google</span>
            </button>

            {/* Create Account Link */}
            <div className="pt-6 text-center body-sm-regular subtext-500">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() =>
                  toast.info("Registration", {
                    description: "Administrator registrations require institutional invite.",
                  })
                }
                className="body-sm-medium text-brand-orange hover:underline cursor-pointer"
              >
                Create account
              </button>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="text-center body-xsm-regular subtext-500 pt-2">
            © 2026 EduPro LMS. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
}
