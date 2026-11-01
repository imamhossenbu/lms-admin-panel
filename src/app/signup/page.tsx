"use client";

import React, { Suspense } from "react";
import { useSaasReady } from "@/lib/planAccess";
import { SignupPageLayout } from "@/components/signup/SignupPageLayout";
import { SignupWizard } from "@/components/signup/SignupWizard";
import { SignupSkeleton } from "@/components/signup/SignupSkeleton";

/** Wizard reads sessionStorage + the SaaS store, so it renders on the client only. */
function SignupContent() {
  const ready = useSaasReady();
  return ready ? <SignupWizard /> : <SignupSkeleton />;
}

/** Public self-signup (no admin shell): account → institution → plan → done. Resumes from sessionStorage. */
export default function SignupPage() {
  return (
    <SignupPageLayout>
      <Suspense fallback={<SignupSkeleton />}>
        <SignupContent />
      </Suspense>
    </SignupPageLayout>
  );
}
