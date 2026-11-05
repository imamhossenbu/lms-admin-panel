"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/validations/authSchema";
import { authApi, LOGIN_NOTICE_KEY } from "@/lib/api";
import { useAppDispatch } from "@/store/hooks";
import { loadSession } from "@/lib/session";
import { apiErrorMessage } from "@/lib/apiError";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  BookOpen,
  Users,
  BarChart3,
  Sparkles,
} from "lucide-react";

import { AuthCardContainer } from "@/components/auth/AuthCardContainer";
import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";
import { AuthFeature } from "@/components/auth/AuthFeatureList";
import { AuthAlertBanner } from "@/components/auth/AuthAlertBanner";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { TwoFactorStep } from "@/components/auth/login/TwoFactorStep";

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
  /** Set while the account needs its 6-digit authenticator code (second sign-in step). */
  const [challenge, setChallenge] = useState<{ token: string; email: string } | null>(null);

  // Why the last session ended (idle timeout). Kept a few seconds so a reload right after the redirect still
  // shows it; the fixed toast id keeps it to one toast.
  useEffect(() => {
    const notice = sessionStorage.getItem(LOGIN_NOTICE_KEY);
    if (!notice) return;
    toast.error("You were signed out", { id: "login-notice", description: notice });
    const timer = window.setTimeout(() => sessionStorage.removeItem(LOGIN_NOTICE_KEY), 4000);
    return () => window.clearTimeout(timer);
  }, []);

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

  // Coming from an accepted invitation (/login?email=…): prefill the address.
  React.useEffect(() => {
    const email = new URLSearchParams(window.location.search).get("email");
    if (email) {
      setValue("email", email, { shouldValidate: false });
    }
  }, [setValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  };

  /** Stores the session, loads profile + team access, then routes to the dashboard (or to 2FA setup). */
  const finishSignIn = async (token: string, twoFactorSetupRequired: boolean | undefined, toastId: string | number) => {
    localStorage.setItem("admin_token", token);
    const profile = await loadSession(dispatch, token);
    const roleUpper = (profile.role || "").toUpperCase();
    if (roleUpper !== "ADMIN" && roleUpper !== "SUPER_ADMIN") {
      dispatch(logout());
      throw new Error("This portal is only for administrators. Students and instructors sign in from the learning app.");
    }
    if (twoFactorSetupRequired) {
      toast.warning("Set up two-factor authentication", {
        id: toastId,
        description: "Your workspace requires 2FA for admins. Connect an authenticator app to continue.",
      });
      router.push("/settings?section=security");
      return;
    }
    toast.success(`Welcome back, ${profile.name || "Administrator"}!`, { id: toastId, description: "Redirecting to your EduPro dashboard..." });
    router.push("/");
  };

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setIsSubmitting(true);
    const toastId = toast.loading("Signing in to EduPro...", { description: "Verifying your administrator credentials" });
    try {
      const res = await authApi.login({ email: data.email.trim(), password: data.password });
      if (res.twoFactorRequired) {
        setChallenge({ token: res.challengeToken, email: data.email.trim() });
        toast.info("Enter your authentication code", { id: toastId, description: "Open your authenticator app to finish signing in." });
        return;
      }
      await finishSignIn(res.token, res.twoFactorSetupRequired, toastId);
    } catch (err) {
      const message = apiErrorMessage(err, "Authentication failed. Please verify your credentials.");
      setServerError(message);
      toast.error("Authentication Error", { id: toastId, description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitCode = async (code: string) => {
    if (!challenge) return;
    setServerError(null);
    setIsSubmitting(true);
    const toastId = toast.loading("Verifying your code...", { description: "Checking it with your authenticator" });
    try {
      const res = await authApi.twoFactorLogin(challenge.token, code);
      await finishSignIn(res.token, res.twoFactorSetupRequired, toastId);
    } catch (err) {
      const message = apiErrorMessage(err, "That code didn't work. Try the newest code from your app.");
      // An expired 5-minute session means starting over with the password.
      if (/expired|session/i.test(message)) setChallenge(null);
      setServerError(message);
      toast.error("Verification failed", { id: toastId, description: message });
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
          <div className="hidden sm:flex items-center gap-2 body-xsm-regular text-white/80">
            <span className="w-2 h-2 rounded-full bg-brand-orange shadow-sm shadow-brand-orange" />
            <span>Manage</span>
            <span className="text-primary-300">•</span>
            <span>Teach</span>
            <span className="text-primary-300">•</span>
            <span>Grow</span>
          </div>
        }
      />

      {/* Right White Form Panel */}
      <AuthRightPanel
        title={challenge ? "Verify it's you 🔐" : "Welcome back 👋"}
        subtitle={challenge ? "One more step to keep your account safe." : "Sign in to continue to your LMS dashboard."}
      >
        {challenge ? (
          <TwoFactorStep
            email={challenge.email}
            isSubmitting={isSubmitting}
            serverError={serverError}
            onClearError={() => setServerError(null)}
            onSubmit={onSubmitCode}
            onBack={() => {
              setChallenge(null);
              setServerError(null);
            }}
          />
        ) : (
        <>
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
              className="block body-sm-medium text-primary-500 tracking-tight"
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
                className={`w-full h-13 sm:h-13.5 pl-12 pr-4 rounded-xl border bg-white body-regular text-primary-500 placeholder:text-primary-300 focus:outline-none transition-all ${
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
                className="block body-sm-medium text-primary-500 tracking-tight"
              >
                Password
              </label>
              {capsLockActive && (
                <span className="body-2xsm-regular text-yellow bg-yellow-bg px-2 py-0.5 rounded border border-yellow">
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
                className={`w-full h-13 sm:h-13.5 pl-12 pr-12 rounded-xl border bg-white body-regular text-primary-500 placeholder:text-primary-300 focus:outline-none transition-all ${
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
                className="w-4 h-4 rounded border-dash text-brand-orange focus:ring-brand-orange accent-brand-orange cursor-pointer"
              />
              <span className="body-sm-regular text-primary-400">
                Remember me
              </span>
            </label>

            <Link
              href="/forgot-password"
              className="body-sm-medium text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors cursor-pointer"
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

          {/* Self-signup entry point (14-day free trial) */}
          <p className="text-center body-sm-regular text-primary-400">
            New to EduPro?{" "}
            <Link href="/signup" className="body-sm-medium text-brand-orange hover:text-brand-orange-hover hover:underline transition-colors">
              Create an account — start your free trial
            </Link>
          </p>
        </form>
        </>
        )}
      </AuthRightPanel>
    </AuthCardContainer>
  );
}
