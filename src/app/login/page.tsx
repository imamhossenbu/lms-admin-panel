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
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Cpu,
  Zap,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
} from "lucide-react";

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
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const handleFillDemo = () => {
    setValue("email", "admin@lms.com", { shouldValidate: true });
    setValue("password", "admin123", { shouldValidate: true });
    setServerError(null);
    toast.info("Demo credentials loaded", {
      description: "Email: admin@lms.com | Password: admin123",
      icon: <Sparkles className="w-4 h-4 text-[#1C4D8D]" />,
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

    const toastId = toast.loading("Verifying administrative credentials...", {
      description: "Connecting to secure authentication gateway",
    });

    try {
      // 1. Post to NestJS auth/login
      const loginRes = await authApi.login({
        email: data.email.trim(),
        password: data.password,
      });

      if (!loginRes.token) {
        throw new Error("No authorization token received from gateway.");
      }

      // Temporarily store token so getProfile request interceptor can use it
      localStorage.setItem("admin_token", loginRes.token);

      // 2. Fetch authenticated admin profile from user/me
      const profile = await authApi.getProfile();

      // 3. Verify user has administrator privileges
      const roleUpper = (profile.role || "").toUpperCase();
      const isAdmin = roleUpper === "ADMIN" || roleUpper === "SUPER_ADMIN";

      if (!isAdmin) {
        localStorage.removeItem("admin_token");
        throw new Error(
          `Unauthorized role: [${profile.role}]. This portal is restricted to system administrators.`
        );
      }

      // 4. Save credentials to Redux store & LocalStorage
      dispatch(
        setCredentials({
          token: loginRes.token,
          user: profile,
        })
      );

      toast.success(`Welcome back, ${profile.name || "Administrator"}!`, {
        id: toastId,
        description: "Administrative telemetry session initialized.",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      });

      // 5. Navigate to Dashboard
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
        icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#071326] text-white selection:bg-[#1C4D8D] selection:text-[#BDE8F5]">
      {/* ================= LEFT SHOWCASE PANEL (Desktop) ================= */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative overflow-hidden flex-col justify-between p-12 xl:p-16 border-r border-[#1C355E]/60 bg-gradient-to-br from-[#071326] via-[#0B1E3F] to-[#0F2854]">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1C4D8D]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-[#4988C4]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-80 h-80 bg-[#BDE8F5]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle Tech Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Top Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1C4D8D] to-[#4988C4] flex items-center justify-center shadow-lg shadow-[#1C4D8D]/40 border border-[#BDE8F5]/30">
              <GraduationCap className="w-7 h-7 text-[#BDE8F5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  LMS AI
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#1C4D8D]/60 text-[#BDE8F5] border border-[#4988C4]/40 uppercase tracking-wider">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-[#BDE8F5]/70">
                Institutional Administration & Telemetry
              </p>
            </div>
          </div>
        </div>

        {/* Middle Feature Hero Content */}
        <div className="relative z-10 my-auto py-8 max-w-xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C355E]/60 border border-[#4988C4]/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#BDE8F5]" />
            <span className="text-xs font-medium text-[#BDE8F5]">
              AI Infrastructure v2.4 • Gemini & Groq Ready
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
              Next-Generation Learning Intelligence Suite.
            </h1>
            <p className="text-base xl:text-lg text-slate-300 leading-relaxed">
              Comprehensive administrative portal for automated curriculum
              generation, student authentication telemetry, revenue orchestration,
              and live institutional analytics.
            </p>
          </div>

          {/* Telemetry Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md hover:bg-white/[0.07] transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#1C4D8D]/40 border border-[#4988C4]/40 flex items-center justify-center text-[#BDE8F5]">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-white">
                  Neural Curriculum
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated outline & quiz generation evaluated with sub-second
                latency.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md hover:bg-white/[0.07] transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-white">
                  RBAC Cryptography
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Role-based access tokens with instantaneous permission
                invalidation.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-[#1C355E]/60 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Telemetry Gateway: Online</span>
          </div>
          <span className="text-slate-500">
            Node: sgp1 • 256-bit SSL Protected
          </span>
        </div>
      </div>

      {/* ================= RIGHT FORM PANEL ================= */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-[#071326] relative">
        {/* Background glow in mobile */}
        <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#1C4D8D]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Mobile Brand Header */}
        <div className="lg:hidden flex items-center justify-between pb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1C4D8D] to-[#4988C4] flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-[#BDE8F5]" />
            </div>
            <span className="font-bold text-white text-lg">LMS AI</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-md bg-[#1C355E] text-[#BDE8F5] border border-[#4988C4]/30 font-medium">
            Admin v2.4
          </span>
        </div>

        {/* Center Container for Login Form */}
        <div className="my-auto max-w-md w-full mx-auto space-y-7">
          {/* Form Header */}
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1C4D8D]/30 border border-[#4988C4]/40 text-[#BDE8F5] text-xs font-semibold mb-1">
              <KeyRound className="w-3.5 h-3.5 text-[#BDE8F5]" />
              <span>Admin Gateway</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Administrative Sign In
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enter your institutional credentials to authenticate and manage
              system resources.
            </p>
          </div>

          {/* Quick Demo Pill Helper */}
          <div className="p-3 rounded-xl bg-[#0B1E3F]/80 border border-[#1C355E] flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#1C4D8D]/50 flex items-center justify-center shrink-0 text-[#BDE8F5]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-medium text-white truncate">
                  Need rapid demo access?
                </p>
                <p className="text-[11px] text-[#BDE8F5]/80 font-mono truncate">
                  admin@lms.com • admin123
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-2.5 py-1.5 rounded-lg bg-[#1C4D8D] hover:bg-[#163e72] active:scale-95 text-xs font-semibold text-white transition-all shrink-0 cursor-pointer shadow-sm border border-[#4988C4]/40"
            >
              Auto Fill
            </button>
          </div>

          {/* Server Error Alert Banner */}
          {serverError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 animate-in fade-in duration-200 text-left">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-rose-300">
                  Authentication Failed
                </p>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {serverError}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
              >
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@lms.com"
                  {...register("email")}
                  className={`w-full h-11 pl-10 pr-3.5 rounded-xl bg-[#0B1E3F]/70 border text-white text-sm placeholder:text-slate-500 focus:outline-none transition-all duration-200 ${
                    errors.email
                      ? "border-rose-500/80 focus:ring-2 focus:ring-rose-500/30"
                      : "border-[#1C355E] focus:border-[#4988C4] focus:ring-2 focus:ring-[#1C4D8D]/40"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  Security Password
                </label>
                {capsLockActive && (
                  <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Caps Lock Active
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  onKeyDown={handleKeyDown}
                  {...register("password")}
                  className={`w-full h-11 pl-10 pr-11 rounded-xl bg-[#0B1E3F]/70 border text-white text-sm placeholder:text-slate-500 focus:outline-none transition-all duration-200 ${
                    errors.password
                      ? "border-rose-500/80 focus:ring-2 focus:ring-rose-500/30"
                      : "border-[#1C355E] focus:border-[#4988C4] focus:ring-2 focus:ring-[#1C4D8D]/40"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Remember Me & Support */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="w-4 h-4 rounded border-[#1C355E] bg-[#0B1E3F] text-[#1C4D8D] focus:ring-offset-[#071326] focus:ring-[#1C4D8D] cursor-pointer"
                />
                <span className="text-xs text-slate-300">
                  Remember this workstation
                </span>
              </label>

              <button
                type="button"
                onClick={() =>
                  toast.info("Password Reset", {
                    description:
                      "To reset institutional credentials, contact the Master DevOps Administrator or invoke backend auth/forgot-password.",
                  })
                }
                className="text-xs text-[#BDE8F5]/80 hover:text-[#BDE8F5] underline underline-offset-4 transition-colors cursor-pointer"
              >
                Reset password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-[#1C4D8D] to-[#4988C4] hover:from-[#163e72] hover:to-[#3b74ab] active:scale-[0.99] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#1C4D8D]/30 hover:shadow-[#1C4D8D]/50 border border-[#BDE8F5]/20 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="w-4 h-4 text-[#BDE8F5]" />
                </>
              )}
            </button>
          </form>

          {/* Security Assurance Footer */}
          <div className="pt-4 border-t border-[#1C355E]/60 flex items-center justify-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Encrypted Admin Session</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} LMS AI Learning Systems Inc. Unauthorized
          entry prohibited.
        </div>
      </div>
    </div>
  );
}
