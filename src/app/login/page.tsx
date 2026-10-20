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
import { ToneBadge } from "@/components/ui/ToneBadge";
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
  Fingerprint,
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
      icon: <Sparkles className="w-4 h-4 text-brand-primary" />,
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC]">
      {/* ================= LEFT SHOWCASE PANEL (High-Tech Enterprise Branding) ================= */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative overflow-hidden flex-col justify-between p-12 xl:p-16 bg-gradient-to-br from-[#0F2854] via-[#14396E] to-[#1C4D8D] text-white select-none">
        {/* Ambient Atmospheric Lighting */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#4988C4]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-[#BDE8F5]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 w-80 h-80 bg-[#1C4D8D]/40 rounded-full blur-3xl pointer-events-none" />

        {/* Tech Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1.2px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#1C4D8D] flex items-center justify-center shadow-lg border border-[#BDE8F5]/40 shrink-0">
              <GraduationCap className="w-7 h-7 text-[#BDE8F5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="h5-medium font-bold text-white tracking-tight">
                  LMS AI
                </span>
                <ToneBadge tone="ice" size="sm" className="font-semibold uppercase tracking-wider text-[11px]">
                  Enterprise v2.4
                </ToneBadge>
              </div>
              <p className="body-xsm-regular text-[#BDE8F5]/90">
                Institutional Administration & AI Telemetry
              </p>
            </div>
          </div>
        </div>

        {/* Middle Feature Hero Content */}
        <div className="relative z-10 my-auto py-8 max-w-xl space-y-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-xs">
            <Sparkles className="w-4 h-4 text-[#BDE8F5]" />
            <span className="body-sm-medium text-[#BDE8F5]">
              AI Neural Infrastructure • Gemini 3.8 Flash & Groq Ready
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="h1-bold text-white tracking-tight leading-[1.15]">
              Next-Generation Learning Intelligence Suite.
            </h1>
            <p className="body-l-regular text-[#E2E8F0] leading-relaxed">
              Unified administrative control center for automated curriculum
              generation, student authentication telemetry, revenue orchestration,
              and live institutional analytics.
            </p>
          </div>

          {/* Telemetry Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Card 1 */}
            <div className="glass-card-dark rounded-xl p-4 transition-all hover:bg-white/[0.1]">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1C4D8D]/60 border border-[#BDE8F5]/30 flex items-center justify-center text-[#BDE8F5]">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="title-sm text-white">Neural Curriculum</span>
                </div>
                <ToneBadge tone="ice" size="sm">Active</ToneBadge>
              </div>
              <p className="body-sm-regular text-[#BDE8F5]/90 leading-relaxed">
                Automated syllabus & quiz compilation evaluated with sub-second
                inference latency.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card-dark rounded-xl p-4 transition-all hover:bg-white/[0.1]">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="title-sm text-white">RBAC Cryptography</span>
                </div>
                <ToneBadge tone="success" size="sm">256-Bit</ToneBadge>
              </div>
              <p className="body-sm-regular text-[#BDE8F5]/90 leading-relaxed">
                Role-based access tokens with instantaneous cryptographic
                permission invalidation.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/15">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
            <span className="body-sm-medium text-white">Telemetry Gateway: Online</span>
          </div>
          <div className="flex items-center gap-2 body-xsm-regular text-[#BDE8F5]/80">
            <Server className="w-3.5 h-3.5" />
            <span>Node: sgp1 • ISO 27001 Certified</span>
          </div>
        </div>
      </div>

      {/* ================= RIGHT AUTHENTICATION PANEL ================= */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen relative bg-[#F8FAFC]">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between pb-6 border-b border-dash mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-brand-ice" />
            </div>
            <span className="h6-medium font-bold text-brand-navy">LMS AI</span>
          </div>
          <ToneBadge tone="primary" size="sm">Admin Portal</ToneBadge>
        </div>

        {/* Centered Elevated Auth Card */}
        <div className="my-auto max-w-[460px] w-full mx-auto">
          <div className="glass-card-light rounded-2xl p-7 sm:p-9">
            {/* Header */}
            <div className="text-left mb-6">
              <ToneBadge tone="primary" size="md" className="font-semibold mb-2.5">
                <KeyRound className="w-3.5 h-3.5 text-brand-primary mr-1" />
                ADMIN GATEWAY
              </ToneBadge>
              <h2 className="h2-bold text-brand-navy tracking-tight mt-1 mb-1.5">
                Administrative Sign In
              </h2>
              <p className="body-sm-regular text-muted leading-relaxed">
                Enter your institutional credentials to authenticate and manage
                system telemetry.
              </p>
            </div>

            {/* Quick Demo Credentials Box */}
            <div className="p-3.5 rounded-xl bg-brand-ice-soft border border-brand-accent/30 flex items-center justify-between gap-3 mb-6 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 text-brand-primary">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="truncate text-left">
                  <p className="body-sm-medium text-brand-navy font-semibold truncate">
                    Rapid Demo Access
                  </p>
                  <p className="body-xsm-regular text-brand-primary font-mono truncate">
                    admin@lms.com • admin123
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="px-3 py-1.5 rounded-lg bg-brand-primary hover:bg-[#163e72] active:scale-95 body-xsm-medium font-semibold text-white transition-all shrink-0 cursor-pointer shadow-sm border border-transparent"
              >
                Auto Fill
              </button>
            </div>

            {/* Server Error Alert Banner */}
            {serverError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 mb-5 animate-in fade-in duration-200 text-left">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="body-sm-medium font-semibold text-rose-800">
                    Authentication Failed
                  </p>
                  <p className="body-xsm-regular text-rose-700 leading-relaxed">
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
                  className="body-sm-medium text-brand-navy block"
                >
                  Admin Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-muted pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@lms.com"
                    {...register("email")}
                    className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-white text-brand-navy body-sm-regular placeholder:text-slate-400 focus:outline-none transition-all shadow-xs ${
                      errors.email
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-200 focus:border-rose-500"
                        : "border-dash focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-primary"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="body-xsm-medium text-rose-600 flex items-center gap-1 mt-1">
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
                    className="body-sm-medium text-brand-navy block"
                  >
                    Security Password
                  </label>
                  {capsLockActive && (
                    <span className="body-xsm-medium text-amber-700 font-semibold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      Caps Lock Active
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-muted pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    onKeyDown={handleKeyDown}
                    {...register("password")}
                    className={`w-full h-11 pl-10 pr-11 rounded-xl border bg-white text-brand-navy body-sm-regular placeholder:text-slate-400 focus:outline-none transition-all shadow-xs ${
                      errors.password
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-200 focus:border-rose-500"
                        : "border-dash focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-muted hover:text-brand-navy transition-colors cursor-pointer"
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
                  <p className="body-xsm-medium text-rose-600 flex items-center gap-1 mt-1">
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
                    className="w-4 h-4 rounded border-dash text-brand-primary focus:ring-brand-primary cursor-pointer accent-[#1C4D8D]"
                  />
                  <span className="body-sm-regular text-brand-navy">
                    Remember workstation
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    toast.info("Password Reset Information", {
                      description:
                        "To reset institutional credentials, contact the DevOps Administrator or submit via backend auth/forgot-password.",
                    })
                  }
                  className="body-sm-medium text-brand-primary hover:text-brand-navy underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Reset password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent hover:from-[#163e72] hover:to-[#3874ab] active:scale-[0.99] text-white body-medium font-semibold flex items-center justify-center gap-2 shadow-md shadow-brand-primary/20 hover:shadow-brand-primary/35 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating Session...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate & Enter</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>

            {/* Security Footnote */}
            <div className="pt-5 mt-5 border-t border-dash flex items-center justify-center gap-2 text-muted body-xsm-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit TLS Encrypted Administrative Portal</span>
            </div>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="pt-6 text-center body-xsm-regular text-muted">
          © {new Date().getFullYear()} LMS AI Learning Systems Inc. Unauthorized
          entry prohibited.
        </div>
      </div>
    </div>
  );
}
