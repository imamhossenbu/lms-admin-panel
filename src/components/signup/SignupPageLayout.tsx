import React from "react";
import Link from "next/link";
import { BadgeCheck, Globe, Rocket, ShieldCheck } from "lucide-react";
import { AuthCardContainer } from "@/components/auth/AuthCardContainer";
import { AuthLeftPanel } from "@/components/auth/AuthLeftPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";
import type { AuthFeature } from "@/components/auth/AuthFeatureList";

const SIGNUP_FEATURES: AuthFeature[] = [
  { icon: Rocket, title: "Live in minutes", description: "Your own academy at yourname.edupro.com" },
  { icon: BadgeCheck, title: "14-day free trial", description: "Every plan feature unlocked, no card needed" },
  { icon: Globe, title: "Your brand, your domain", description: "Connect a custom domain on Pro and above" },
  { icon: ShieldCheck, title: "Cancel anytime", description: "Simple monthly or yearly billing" },
];

/** Two-panel auth layout (same as /login) for the public signup wizard. */
export function SignupPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthCardContainer>
      <AuthLeftPanel
        title={
          <>
            Launch your
            <br />
            online academy.
            <br />
            <span className="text-brand-orange">Today.</span>
          </>
        }
        description="Courses, students, live classes, certificates and payments — everything your institution needs in one place."
        features={SIGNUP_FEATURES}
        mockupSrc="/images/edupro_mockup_clean_flush.png"
        mockupAlt="EduPro dashboard preview"
        footerTagline="Trusted by schools, coaching centres and creators"
      />
      <AuthRightPanel
        title="Start your free trial"
        subtitle={
          <>
            Already on EduPro?{" "}
            <Link href="/login" className="body-regular text-brand-orange hover:underline">
              Sign in
            </Link>
          </>
        }
      >
        {children}
      </AuthRightPanel>
    </AuthCardContainer>
  );
}

export default SignupPageLayout;
