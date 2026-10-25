"use client";

import React from "react";
import { FileText, ExternalLink, Globe } from "lucide-react";
import { InstructorDetailCard } from "../InstructorDetailCard";
import { InstructorFullDetails } from "../instructorDetailsData";
import { InfoRow } from "./InfoRow";

interface AdditionalInfoCardProps {
  specialization: string;
  website: string;
  socials: InstructorFullDetails["socials"];
}

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.94c0-1.18-.02-2.7-1.65-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden>
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
  </svg>
);

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="w-8 h-8 rounded-full bg-blue-14 text-blue flex items-center justify-center hover:bg-blue hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}

export function AdditionalInfoCard({ specialization, website, socials }: AdditionalInfoCardProps) {
  return (
    <InstructorDetailCard icon={<FileText />} title="Additional Information">
      <div className="divide-y divide-dash">
        <InfoRow label="Specialization">{specialization}</InfoRow>
        <InfoRow label="Website (Optional)">
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-blue hover:underline"
          >
            {website}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </InfoRow>
        <InfoRow label="Social Links">
          <div className="flex items-center gap-2">
            <SocialLink href={socials.linkedin} label="LinkedIn">
              <LinkedInIcon />
            </SocialLink>
            <SocialLink href={socials.twitter} label="X (Twitter)">
              <XIcon />
            </SocialLink>
            <SocialLink href={socials.website} label="Website">
              <Globe className="w-4 h-4" />
            </SocialLink>
          </div>
        </InfoRow>
      </div>
    </InstructorDetailCard>
  );
}

export default AdditionalInfoCard;
