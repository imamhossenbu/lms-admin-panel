"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FormProvider, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Rocket } from "lucide-react";
import { sortPlans } from "@/lib/saasStats";
import { signupSchema, type SignupFormValues } from "@/validations/saasSchema";
import { fetchPublicPlans, signupInstitution } from "@/lib/saasStorage";
import type { Plan } from "@/types/saas";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { errorMessage } from "@/components/billing/shared/billingFormat";
import { SignupStepper } from "./SignupStepper";
import { AccountStep } from "./AccountStep";
import { InstitutionStep } from "./InstitutionStep";
import { PlanStep } from "./PlanStep";
import { SignupDoneStep } from "./SignupDoneStep";
import { useSlugAvailability } from "./useSlugAvailability";
import {
  clearSignupSession,
  loadSignupSession,
  saveSignupSession,
  SIGNUP_DEFAULTS,
  SIGNUP_STEPS,
  STEP_FIELDS,
  stepOfField,
  type SignupDraft,
  type SignupResult,
  type SignupSession,
  type SignupStep,
} from "./signupSteps";

const TITLES: Record<SignupStep, { title: string; subtitle: string }> = {
  1: { title: "Create your account", subtitle: "You'll be the owner and first admin of your academy." },
  2: { title: "Tell us about your institution", subtitle: "Pick a name and the web address students will visit." },
  3: { title: "Choose your plan", subtitle: "Try everything free for 14 days — no card required." },
  4: { title: "You're all set", subtitle: "Your academy has been created." },
};

/**
 * Public self-signup wizard. Resumes on the last step from sessionStorage (the password is never
 * stored), Previous is always allowed, the stepper never skips ahead of the furthest reached step.
 */
/** `?plan=growth&cycle=YEARLY` from the marketing site's pricing page pre-selects the plan step. */
function planFromUrl(): Partial<SignupDraft> {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const plan = q.get("plan");
  const cycle = q.get("cycle")?.toUpperCase();
  return {
    ...(plan && /^[a-z0-9-]{2,40}$/.test(plan) ? { planId: plan } : {}),
    ...(cycle === "MONTHLY" || cycle === "YEARLY" ? { cycle } : {}),
  };
}

export function SignupWizard() {
  const [initial] = useState<SignupSession | null>(() => loadSignupSession());
  const [step, setStep] = useState<SignupStep>(initial?.step ?? 1);
  const [maxStep, setMaxStep] = useState<SignupStep>(initial?.maxStep ?? 1);
  const [slugTouched, setSlugTouched] = useState(initial?.slugTouched ?? false);
  const [result, setResult] = useState<SignupResult | null>(initial?.result ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Public, non-archived paid plans from the API (null while loading).
  const [allPlans, setAllPlans] = useState<Plan[] | null>(null);
  useEffect(() => {
    fetchPublicPlans()
      .then(setAllPlans)
      .catch((err) => {
        setAllPlans([]);
        toast.error("Couldn't load plans", { description: errorMessage(err, "Please refresh the page to try again.") });
      });
  }, []);
  const plans = useMemo(() => sortPlans(allPlans ?? []).filter((p) => p.isPublic && !p.archived && p.priceMonthly > 0), [allPlans]);

  const form = useForm<SignupDraft>({
    resolver: zodResolver(signupSchema) as never,
    mode: "onTouched",
    defaultValues: { ...SIGNUP_DEFAULTS, ...(initial?.values ?? {}), ...planFromUrl(), password: "" },
  });
  const values = useWatch({ control: form.control });
  const slugCheck = useSlugAvailability(values.slug ?? "");

  // Persist progress (minus password) so a reload resumes on the same step.
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = { ...SIGNUP_DEFAULTS, ...values };
    saveSignupSession({ step, maxStep, slugTouched, result, values: rest });
  }, [values, step, maxStep, slugTouched, result]);

  const goTo = (next: SignupStep) => {
    setStep(next);
    setMaxStep((m) => (next > m ? next : m));
  };

  const next = async () => {
    if (step === 4) return;
    const ok = await form.trigger(STEP_FIELDS[step as 1 | 2 | 3]);
    if (!ok) {
      toast.error("Please check the highlighted fields", { description: "Some details are missing or invalid." });
      return;
    }
    if (step === 2) {
      if (slugCheck.state === "taken") {
        form.setError("slug", { message: slugCheck.reason ?? "This subdomain is already taken — try another" });
        return;
      }
      if (slugCheck.state === "checking") {
        toast.info("Still checking that web address", { description: "Give it a second and try again." });
        return;
      }
    }
    if (step === 3) {
      await form.handleSubmit(submit, onInvalid)();
      return;
    }
    goTo((step + 1) as SignupStep);
  };

  const onInvalid = (errors: FieldErrors<SignupDraft>) => {
    const first = Object.keys(errors)[0] as keyof SignupFormValues | undefined;
    if (first) {
      const target = stepOfField(first);
      if (target !== step) {
        setStep(target);
        toast.error("A few details need another look", {
          description: first === "password" ? "For your security we don't keep passwords between visits — please enter it again." : "Fix the highlighted field to continue.",
        });
      }
    }
  };

  const submit = async (data: SignupDraft) => {
    setIsSubmitting(true);
    const id = toast.loading("Creating your academy...", { description: `Setting up ${data.slug}.edupro.com` });
    try {
      const { institution: created, email } = await signupInstitution(data as SignupFormValues);
      const plan = plans.find((p) => p.id === data.planId);
      const res: SignupResult = {
        institutionName: created.name,
        slug: created.slug,
        email,
        planName: plan?.name ?? data.planId,
        trialEndsAt: created.subscription.trialEndsAt,
      };
      setResult(res);
      goTo(4);
      toast.success("Your free trial has started", { id, description: `We emailed a 6-digit code to ${email} — enter it to activate your account.` });
    } catch (err) {
      const msg = errorMessage(err, "We couldn't create your academy. Please try again.");
      if (/slug|subdomain|address/i.test(msg)) {
        form.setError("slug", { message: msg });
        setStep(2);
      }
      toast.error("Signup failed", { id, description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startOver = () => {
    clearSignupSession();
    form.reset({ ...SIGNUP_DEFAULTS });
    setResult(null);
    setSlugTouched(false);
    setStep(1);
    setMaxStep(1);
  };

  const heading = TITLES[step];
  const showDone = step === 4 && result;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-6 text-left">
      <SignupStepper step={step} maxStep={maxStep} onStepClick={(s) => setStep(s)} />

      <div>
        <p className="body-xsm-medium text-brand-orange">
          Step {step} of {SIGNUP_STEPS.length}
        </p>
        <h3 className="mt-1 heading-h5 text-primary-500">{heading.title}</h3>
        <p className="mt-1 body-sm-regular text-primary-300">{heading.subtitle}</p>
      </div>

      <FormProvider {...form}>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void next();
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2, ease: "easeOut" }}>
              {step === 1 && <AccountStep />}
              {step === 2 && <InstitutionStep slugTouched={slugTouched} onSlugTouched={() => setSlugTouched(true)} slugCheck={slugCheck} />}
              {step === 3 &&
                (allPlans === null ? (
                  <div className="grid gap-3 sm:grid-cols-2 animate-pulse" aria-busy="true">
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i} className="rounded-xl border border-dash p-4 space-y-3">
                        <div className="h-4 w-24 rounded bg-slate-200" />
                        <div className="h-6 w-20 rounded bg-slate-100" />
                        <div className="h-3 w-full rounded bg-slate-100" />
                        <div className="h-3 w-3/4 rounded bg-slate-100" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <PlanStep plans={plans} />
                ))}
              {showDone && <SignupDoneStep result={result} onStartOver={startOver} />}
              {step === 4 && !result && (
                <div className="space-y-4">
                  <p className="body-sm-regular text-primary-400">We couldn&apos;t find your new academy in this session.</p>
                  <PrimaryButton onClick={startOver}>Start again</PrimaryButton>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 4 && (
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-dash pt-5">
              {step > 1 ? (
                <SecondaryButton leftIcon={<ArrowLeft />} onClick={() => setStep((step - 1) as SignupStep)} disabled={isSubmitting}>
                  Previous
                </SecondaryButton>
              ) : (
                <p className="body-sm-regular text-primary-300">
                  Already have an account?{" "}
                  <Link href="/login" className="body-sm-medium text-brand-orange hover:underline">
                    Sign in
                  </Link>
                </p>
              )}
              <PrimaryButton type="submit" isLoading={isSubmitting} rightIcon={step === 3 ? <Rocket /> : <ArrowRight />}>
                {step === 3 ? (isSubmitting ? "Creating..." : "Start free trial") : "Continue"}
              </PrimaryButton>
            </div>
          )}
        </form>
      </FormProvider>
    </motion.div>
  );
}

export default SignupWizard;
