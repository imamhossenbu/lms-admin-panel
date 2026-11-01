"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Bell, PanelTop, X } from "lucide-react";
import type { BrandingSettings } from "@/validations/platformSettingsSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { cn } from "@/lib/cn";
import { BrandImage } from "./BrandImage";
import { ACCENT_STYLE, type BrandingPreviews } from "./brandingUtils";

export interface AppHeaderPreviewCardProps {
  platformName: string;
  previews: BrandingPreviews;
}

/** Browser tab with the favicon + the student app header with the logo and accent nav. */
export function AppHeaderPreviewCard({ platformName, previews }: AppHeaderPreviewCardProps) {
  const { control } = useFormContext<BrandingSettings>();
  const [accentKey, logoUrl, faviconUrl] = useWatch({ control, name: ["accent", "logoUrl", "faviconUrl"] });
  const accent = ACCENT_STYLE[accentKey ?? "orange"];
  const name = platformName || "Your platform";
  const logo = previews.logoUrl ?? logoUrl ?? "";
  const favicon = previews.faviconUrl ?? faviconUrl ?? "";

  const faviconFallback = (
    <span className={cn("flex h-4 w-4 items-center justify-center rounded body-2xsm-regular font-semibold! text-white", accent.solid)}>{name.charAt(0).toUpperCase()}</span>
  );

  return (
    <IconSectionCard icon={<PanelTop className="h-5 w-5" />} title="App header & tab" description="Logo and favicon in the student app." tone="blue">
      <div className="overflow-hidden rounded-xl border border-dash">
        {/* Browser tab strip */}
        <div className="flex items-end gap-1 bg-gray-bg px-2 pt-2">
          <span className="flex min-w-0 max-w-48 items-center gap-2 rounded-t-lg border border-b-0 border-dash bg-white px-3 py-1.5">
            <BrandImage src={favicon} alt="Favicon" className="h-4 w-4 shrink-0" fallback={faviconFallback} />
            <span className="truncate body-2xsm-regular text-primary-500">{name} · My courses</span>
            <X className="h-3 w-3 shrink-0 text-primary-300" />
          </span>
          <span className="mb-1.5 flex h-5 w-5 items-center justify-center rounded-md body-xsm-regular text-primary-300">+</span>
        </div>

        {/* App header */}
        <div className="flex items-center justify-between gap-3 border-t border-dash bg-white px-3 py-2.5">
          <BrandImage
            src={logo}
            alt={`${name} logo`}
            className="h-5 w-20"
            fallback={
              <span className="flex min-w-0 items-center gap-1.5">
                <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md body-2xsm-regular font-semibold! text-white", accent.solid)}>
                  {name.charAt(0).toUpperCase()}
                </span>
                <span className="truncate body-xsm-medium font-semibold! text-primary-500">{name}</span>
              </span>
            }
          />
          <span className="flex shrink-0 items-center gap-2.5">
            <Bell className="h-3.5 w-3.5 text-primary-300" />
            <span className="h-5 w-5 rounded-full bg-slate-200" />
          </span>
        </div>
        <div className="flex items-center gap-1 border-t border-dash bg-white px-2 py-1.5">
          {["Home", "My courses", "Live", "Community"].map((item, i) => (
            <span
              key={item}
              className={cn("whitespace-nowrap rounded-md px-2 py-1 body-2xsm-regular transition-colors", i === 1 ? cn(accent.soft, accent.text, "font-semibold!") : "text-primary-300")}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </IconSectionCard>
  );
}

export default AppHeaderPreviewCard;
