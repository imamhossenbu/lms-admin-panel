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
  Server,
  Activity,
  Check,
  X,
} from "lucide-react";

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
      description: "Email: admin@lms.com • Password: admin123",
      icon: <Sparkles className="w-4 h-4 text-blue-600" />,
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
      description: "Connecting to secure institutional gateway",
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

      // Temporarily store token for getProfile request interceptor
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] antialiased selection:bg-blue-600 selection:text-white">
      {/* ================= LEFT SHOWCASE PANEL (High-Tech Enterprise Branding) ================= */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative overflow-hidden flex-col justify-between p-12 xl:p-16 bg-gradient-to-br from-[#071733] via-[#0E2854] to-[#163F7A] text-white select-none">
        {/* Ambient Atmospheric Lighting */}
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-[420px] h-[420px] bg-sky-400/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-[380px] h-[380px] bg-indigo-600/25 rounded-full blur-[110px] pointer-events-none" />

        {/* Technical Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1.2px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#14396E] to-[#2563EB] flex items-center justify-center shadow-lg shadow-blue-950/40 border border-white/20 shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="h6-medium font-bold text-white tracking-tight">
                  LMS AI
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-200 body-xsm-medium tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Enterprise v2.4
                </span>
              </div>
              <p className="body-xsm-regular text-sky-200/80 mt-0.5">
                Institutional Administration & AI Telemetry
              </p>
            </div>
          </div>
        </div>

        {/* Middle Feature Hero Content */}
        <div className="relative z-10 my-auto py-10 max-w-xl space-y-8">
          {/* AI Banner Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md shadow-inner">
            <Sparkles className="w-4 h-4 text-sky-300" />
            <span className="body-sm-medium text-sky-100">
              AI Neural Infrastructure • Gemini 3.8 Flash & Groq Dual-Engine
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="h6-medium font-extrabold text-white tracking-tight text-3xl xl:text-4xl leading-[1.2]">
              Next-Generation Learning Intelligence Suite.
            </h1>
            <p className="body-medium text-slate-200 leading-relaxed font-normal">
              Unified administrative command center for automated curriculum
              generation, student authentication telemetry, revenue orchestration,
              and live institutional analytics.
            </p>
          </div>

          {/* Telemetry Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Card 1: Neural Curriculum */}
            <div className="rounded-2xl p-4 bg-white/[0.07] hover:bg-white/[0.11] border border-white/15 backdrop-blur-md transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="body-sm-medium font-semibold text-white">
                    Neural Curriculum
                  </span>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 body-xsm-medium font-semibold">
                  Active
                </span>
              </div>
              <p className="body-xsm-regular text-slate-300 leading-relaxed">
                Automated syllabus & quiz compilation evaluated with sub-second
                inference latency.
              </p>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between body-xsm-regular text-slate-300">
                <span className="font-mono">1,420+ Compiled</span>
                <span className="text-emerald-300 font-medium">99.98% Uptime</span>
              </div>
            </div>

            {/* Card 2: RBAC Cryptography */}
            <div className="rounded-2xl p-4 bg-white/[0.07] hover:bg-white/[0.11] border border-white/15 backdrop-blur-md transition-all duration-300 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="body-sm-medium font-semibold text-white">
                    RBAC Cryptography
                  </span>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-400/15 border border-blue-400/30 text-sky-300 body-xsm-medium font-semibold font-mono">
                  256-Bit
                </span>
              </div>
              <p className="body-xsm-regular text-slate-300 leading-relaxed">
                Role-based access tokens with instantaneous cryptographic
                permission invalidation.
              </p>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between body-xsm-regular text-slate-300">
                <span className="font-mono">Zero-Trust Tokens</span>
                <span className="text-sky-300 font-medium">SOC 2 Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/15">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="body-xsm-medium text-emerald-300 tracking-wide">
              Telemetry Gateway: Operational
            </span>
          </div>
          <div className="flex items-center gap-2 body-xsm-regular text-slate-300 font-mono">
            <Server className="w-3.5 h-3.5 text-slate-300" />
            <span>Node: sgp1 • ISO 27001 Certified</span>
          </div>
        </div>
      </div>

      {/* ================= RIGHT AUTHENTICATION PANEL ================= */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen relative bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-50">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between pb-5 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F2854] flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <span className="body-medium font-bold text-primary-500 tracking-tight block">
                LMS AI
              </span>
              <span className="body-xsm-regular subtext-500">Admin Gateway</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#1C4D8D] body-xsm-medium border border-[#BDE8F5]">
            Enterprise v2.4
          </span>
        </div>

        {/* Centered Elevated Auth Card */}
        <div className="my-auto max-w-[460px] w-full mx-auto">
          <div className="bg-white rounded-[16px] border border-[#EDEDED] p-7 sm:p-9 shadow-md">
            {/* Header */}
            <div className="text-left mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FC] border border-[#BDE8F5]/60 text-[#1C4D8D] body-xsm-medium font-semibold tracking-wider uppercase mb-3">
                <KeyRound className="w-3.5 h-3.5 text-[#1C4D8D] shrink-0" />
                <span>ADMIN GATEWAY</span>
              </div>
              <h2 className="h6-medium text-primary-500 font-bold">
                Administrative Sign In
              </h2>
              <p className="body-sm-regular subtext-500 mt-1.5">
                Enter your institutional credentials to authenticate and manage
                system telemetry.
              </p>
            </div>

            {/* Quick Demo Credentials Box */}
            <div className="p-3.5 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED] flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-[8px] bg-[#EBF4FC] border border-[#BDE8F5]/60 flex items-center justify-center shrink-0 text-[#1C4D8D]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="truncate text-left">
                  <p className="body-sm-medium text-primary-500 font-semibold truncate">
                    Rapid Demo Access
                  </p>
                  <p className="body-xsm-medium text-[#1C4D8D] font-mono font-semibold truncate mt-0.5">
                    admin@lms.com • admin123
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="px-3 h-[32px] rounded-[6px] bg-[#1C4D8D] hover:bg-[#163e72] active:scale-95 body-xsm-medium font-semibold text-white transition-all shrink-0 cursor-pointer shadow-2xs flex items-center gap-1.5"
                title="Populate demo credentials"
              >
                {demoCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Loaded!</span>
                  </>
                ) : (
                  <>
                    <span>Auto Fill</span>
                  </>
                )}
              </button>
            </div>

            {/* Server Error Alert Banner */}
            {serverError && (
              <div className="p-3.5 rounded-[8px] bg-rose-50 border border-rose-200 flex items-start gap-3 mb-5 text-left transition-all animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <p className="body-sm-medium text-rose-800 font-semibold">
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
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-email"
                  className="body-sm-regular text-primary-400 block"
                >
                  Admin Email Address
                </label>
                <div className="relative flex items-center group">
                  <span className="absolute left-3.5 text-primary-300 group-focus-within:text-[#1C4D8D] transition-colors pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@lms.com"
                    {...register("email")}
                    className={`w-full h-[40px] pl-10 pr-4 rounded-[8px] border bg-white body-sm-regular text-primary-500 placeholder:text-[#969696] focus:outline-none transition-colors ${
                      errors.email
                        ? "border-rose-400 focus:border-rose-600"
                        : "border-[#EDEDED] focus:border-[#1C4D8D]"
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

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="admin-password"
                    className="body-sm-regular text-primary-400 block"
                  >
                    Security Password
                  </label>
                  {capsLockActive && (
                    <span className="body-xsm-medium text-amber-800 font-semibold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      Caps Lock Active
                    </span>
                  )}
                </div>
                <div className="relative flex items-center group">
                  <span className="absolute left-3.5 text-primary-300 group-focus-within:text-[#1C4D8D] transition-colors pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    onKeyDown={handleKeyDown}
                    {...register("password")}
                    className={`w-full h-[40px] pl-10 pr-11 rounded-[8px] border bg-white body-sm-regular text-primary-500 placeholder:text-[#969696] focus:outline-none transition-colors ${
                      errors.password
                        ? "border-rose-400 focus:border-rose-600"
                        : "border-[#EDEDED] focus:border-[#1C4D8D]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-primary-300 hover:text-primary-500 p-1 transition-colors cursor-pointer"
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
                  <p className="body-xsm-regular text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.password.message}</span>
                  </p>
                )}
              </div>

              {/* Workstation & Reset Password Row */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="w-4 h-4 rounded border-[#EDEDED] text-[#1C4D8D] focus:ring-[#1C4D8D] cursor-pointer accent-[#1C4D8D]"
                  />
                  <span className="body-sm-regular text-primary-500">
                    Remember workstation
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    toast.info("Password Reset Information", {
                      description:
                        "To reset institutional credentials, contact DevOps or submit via backend auth/forgot-password.",
                    })
                  }
                  className="body-sm-medium text-[#1C4D8D] hover:underline transition-colors cursor-pointer"
                >
                  Reset password?
                </button>
              </div>

              {/* High-Contrast, Premium Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[40px] mt-2 rounded-[8px] bg-[#1C4D8D] hover:bg-[#163e72] text-white body-sm-medium flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group shadow-2xs"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="body-sm-medium">
                      Verifying Session...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="body-sm-medium">
                      Authenticate & Enter
                    </span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Security Footnote inside Card */}
            <div className="pt-5 mt-5 border-t border-[#EDEDED] flex items-center justify-center gap-2 body-xsm-regular subtext-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>256-Bit TLS Encrypted Administrative Portal</span>
            </div>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="pt-6 text-center body-xsm-regular subtext-500">
          © 2026 LMS AI Learning Systems Inc. Unauthorized entry prohibited.
        </div>
      </div>
    </div>
  );
}
