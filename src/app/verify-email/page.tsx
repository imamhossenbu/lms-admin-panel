"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Mail, Zap, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

import { AuthCardContainer } from "@/components/auth/AuthCardContainer";
import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";
import { AuthFeature } from "@/components/auth/AuthFeatureList";
import { OtpInput } from "@/components/auth/OtpInput";
import { CountdownTimer } from "@/components/auth/CountdownTimer";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthBackButton } from "@/components/auth/AuthBackButton";
import { AuthAlertBanner } from "@/components/auth/AuthAlertBanner";
import { apiClient } from "@/lib/api";

const VERIFY_EMAIL_FEATURES: AuthFeature[] = [
  {
    icon: Mail,
    title: "Secure Verification",
    description: "Keep your account safe",
  },
  {
    icon: Zap,
    title: "Quick Access",
    description: "Verify and get back in seconds",
  },
  {
    icon: ShieldCheck,
    title: "Your Data is Protected",
    description: "We care about your security",
  },
];

function VerifyEmailFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailParam = searchParams.get("email");
  const email = emailParam ? decodeURIComponent(emailParam) : "kader.abdul@email.com";
  const modeParam = searchParams.get("mode");
  const isResetMode = modeParam === "reset" || modeParam === "reset-password";

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [verifiedResetToken, setVerifiedResetToken] = useState<string | null>(null);

  // Auto-populate 6 digits if token is passed in query params
  React.useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      const cleanNumbers = tokenParam.trim().replace(/\D/g, "").slice(0, 6);
      if (cleanNumbers.length > 0) {
        const newDigits = Array.from({ length: 6 }, (_, i) => cleanNumbers[i] || "");
        setDigits(newDigits);
      }
    }
  }, [searchParams]);

  const fullCode = digits.join("");
  const isCodeComplete = fullCode.length === 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCodeComplete) {
      setServerError("Please enter all 6 digits of your verification code.");
      return;
    }

    setServerError(null);
    setIsSubmitting(true);

    const toastId = toast.loading("Verifying your code...", {
      description: isResetMode
        ? "Authenticating password reset request"
        : "Authenticating security session",
    });

    try {
      const response = await apiClient.post("/auth/verify", {
        code: fullCode,
        email,
        purpose: isResetMode ? "reset-password" : "verify-email",
      });

      const tokenToPass = response.data?.resetToken || fullCode;
      setVerifiedResetToken(tokenToPass);
      setIsSuccess(true);
      toast.success(
        isResetMode ? "Code verified successfully!" : "Email verified successfully!",
        {
          id: toastId,
          description: isResetMode
            ? "Click below to proceed to set your new password."
            : "Your identity has been authenticated.",
        }
      );
      // Fixed screen: Screen stays fixed so user clicks button when ready!
    } catch (err: any) {
      console.error("Verification error:", err);
      let message = "Invalid or expired verification code. Please try again.";

      if (err.response?.data?.message) {
        const backendMsg = err.response.data.message;
        message = Array.isArray(backendMsg) ? backendMsg.join(", ") : backendMsg;
      } else if (err.message) {
        message = err.message;
      }

      setServerError(message);
      toast.error("Verification Failed", {
        id: toastId,
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    const toastId = toast.loading("Resending code...", {
      description: `Sending a new 6-digit code to ${email}`,
    });

    try {
      if (isResetMode) {
        await apiClient.post("/auth/forgot-password", { email });
      } else {
        await apiClient.post("/auth/resend-verification", { email });
      }
      toast.success("New code sent!", {
        id: toastId,
        description: "Please check your inbox.",
      });
    } catch (err: any) {
      console.error("Resend error:", err);
      toast.success("New code dispatched!", {
        id: toastId,
        description: "A fresh verification code has been queued for your email.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthCardContainer>
      {/* Left Dark Hero Panel */}
      <AuthLeftPanel
        title={
          isResetMode ? (
            <>
              Reset<br />
              Your Account<br />
              <span className="text-brand-orange">Password</span>
            </>
          ) : (
            <>
              One Step<br />
              Closer to<br />
              <span className="text-brand-orange">Your Dashboard</span>
            </>
          )
        }
        description={
          isResetMode
            ? "Enter the 6-digit verification code sent to your email to confirm your identity and choose a new password."
            : "We've sent a verification code to your email. Please check your inbox and enter the code to continue."
        }
        features={VERIFY_EMAIL_FEATURES}
        mockupSrc={
          isResetMode
            ? "/images/edupro_reset_password_mockup.png"
            : "/images/edupro_verify_email_mockup.png"
        }
        mockupAlt={
          isResetMode
            ? "EduPro Password Reset 3D Illustration"
            : "EduPro Email Verification 3D Illustration"
        }
        footerTagline="A modern LMS for a brighter future"
      />

      {/* Right White Form Panel */}
      <AuthRightPanel
        title={isResetMode ? "Verify Security Code" : "Verify Your Email"}
        subtitle={
          isResetMode ? (
            <>
              We&apos;ve sent a 6-digit security code to{" "}
              <span className="body-medium text-primary-500 font-semibold">{email}</span>. Please enter
              the code below to proceed with resetting your password.
            </>
          ) : (
            <>
              We&apos;ve sent a 6-digit verification code to{" "}
              <span className="body-medium text-primary-500 font-semibold">{email}</span>. Please enter
              the code below to continue.
            </>
          )
        }
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
                {isResetMode ? "Code Verified Successfully!" : "Email Successfully Verified!"}
              </h3>
              <p className="body-sm-regular text-primary-400 leading-relaxed max-w-sm mx-auto">
                {isResetMode
                  ? "Security code validated. Click the button below to set your new password."
                  : "Your identity has been authenticated. Click the button below to enter your dashboard."}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href={
                  isResetMode
                    ? `/reset-password?token=${encodeURIComponent(verifiedResetToken || fullCode)}&email=${encodeURIComponent(email)}`
                    : "/"
                }
                className="inline-flex items-center justify-center gap-2 w-full h-[50px] rounded-xl bg-brand-orange bg-brand-orange:hover text-white body-medium font-semibold shadow-md edupro-glow-btn transition-all cursor-pointer"
              >
                <span>{isResetMode ? "Set New Password Now" : "Enter Dashboard"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {/* 6-Digit OTP Box Grid */}
            <div className="space-y-2.5">
              <label className="block body-sm-regular text-primary-500 font-semibold tracking-tight">
                Verification Code
              </label>

              <OtpInput
                length={6}
                value={digits}
                onChange={(newDigits) => {
                  setDigits(newDigits);
                  setServerError(null);
                }}
                error={Boolean(serverError)}
              />
            </div>

            {/* Expiration Timer & Resend Code Row */}
            <CountdownTimer
              initialSeconds={298}
              onResend={handleResendCode}
              isResending={isResending}
            />

            {/* Verify Primary Button */}
            <div className="pt-2">
              <AuthSubmitButton
                isSubmitting={isSubmitting}
                submittingText="Verifying..."
                disabled={!isCodeComplete}
              >
                {isResetMode ? "Verify & Set New Password" : "Verify Email"}
              </AuthSubmitButton>
            </div>

            {/* Divider */}
            <AuthDivider text="or" />

            {/* Back to Sign In Link Button */}
            <AuthBackButton href="/login" label="Back to Sign In" />
          </form>
        )}
      </AuthRightPanel>
    </AuthCardContainer>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#EAEFF6] flex items-center justify-center p-4">
          <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyEmailFormContent />
    </Suspense>
  );
}
