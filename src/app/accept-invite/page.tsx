"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ShieldCheck, UserPlus, Users } from "lucide-react";
import { AuthCardContainer } from "@/components/auth/AuthCardContainer";
import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";
import type { AuthFeature } from "@/components/auth/AuthFeatureList";
import { AcceptInviteForm } from "@/components/auth/invite/AcceptInviteForm";
import { AcceptInviteSkeleton } from "@/components/auth/invite/AcceptInviteSkeleton";
import { InvitePreviewCard } from "@/components/auth/invite/InvitePreviewCard";
import { InviteStatusMessage } from "@/components/auth/invite/InviteStatusMessage";
import { invitationApi, type InvitationPreview } from "@/lib/api/team";
import { parseApiError } from "@/lib/apiError";
import type { AcceptInviteFormData } from "@/validations/authSchema";

const INVITE_FEATURES: AuthFeature[] = [
  { icon: Users, title: "Join your team", description: "Work together in one admin panel" },
  { icon: ShieldCheck, title: "Role-based access", description: "See exactly what your role allows" },
  { icon: UserPlus, title: "Ready in a minute", description: "Set a password and sign in" },
];

type State = { kind: "loading" } | { kind: "ready"; invite: InvitationPreview } | { kind: "invalid"; message?: string } | { kind: "expired" };

/** /accept-invite?token=… — the link in a team invitation email. */
function AcceptInviteContent() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [state, setState] = useState<State>(() =>
    token ? { kind: "loading" } : { kind: "invalid", message: "The link is missing its invitation code. Open it again from your email." },
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    invitationApi
      .preview(token)
      .then((invite) => !cancelled && setState(invite.expired ? { kind: "expired" } : { kind: "ready", invite }))
      .catch((err) => !cancelled && setState({ kind: "invalid", message: parseApiError(err).status === 404 ? undefined : parseApiError(err).message }));
    return () => {
      cancelled = true;
    };
  }, [token]);

  const onSubmit = async (values: AcceptInviteFormData) => {
    if (state.kind !== "ready") return;
    setIsSubmitting(true);
    const toastId = toast.loading("Creating your account...", { description: `Joining ${state.invite.workspaceName}` });
    try {
      const res = await invitationApi.accept({ token, name: values.name.trim(), password: values.password });
      toast.success("You're on the team!", { id: toastId, description: "Sign in with your new password." });
      router.push(`/login?email=${encodeURIComponent(res.email)}`);
    } catch (err) {
      const info = parseApiError(err);
      toast.error("Couldn't accept the invitation", { id: toastId, description: info.message });
      if (info.status === 410) setState({ kind: "expired" });
      else if (info.status === 404) setState({ kind: "invalid" });
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCardContainer>
      <AuthLeftPanel
        title={
          <>
            You&apos;re
            <br />
            invited.
            <br />
            <span className="text-brand-orange">Welcome aboard.</span>
          </>
        }
        description="Create your password to join your institution's admin team."
        features={INVITE_FEATURES}
        mockupSrc="/images/edupro_mockup_clean_flush.png"
        mockupAlt="EduPro admin dashboard"
      />
      <AuthRightPanel title="Join your team 🤝" subtitle="Set up your account to accept the invitation.">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5">
          {state.kind === "loading" && <AcceptInviteSkeleton />}
          {state.kind === "invalid" && <InviteStatusMessage kind="invalid" message={state.message} />}
          {state.kind === "expired" && <InviteStatusMessage kind="expired" />}
          {state.kind === "ready" && (
            <>
              <InvitePreviewCard invite={state.invite} />
              <AcceptInviteForm isSubmitting={isSubmitting} onSubmit={onSubmit} />
            </>
          )}
        </motion.div>
      </AuthRightPanel>
    </AuthCardContainer>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <AuthCardContainer>
          <div className="w-full p-8">
            <AcceptInviteSkeleton />
          </div>
        </AuthCardContainer>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
}
