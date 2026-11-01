"use client";

import React, { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { KeyRound, Hash, Link2, Sparkles, Video } from "lucide-react";
import type { LivePlatform } from "@/types/liveClass";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { InputField } from "@/components/ui/InputField";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import { PLATFORM_HOSTS, type LiveClassFormValues } from "@/validations/liveClassSchema";
import { PlatformIcon } from "../shared/PlatformBadge";
import { LIVE_PLATFORM_LABEL } from "../shared/liveClassView";
import { LINK_PLACEHOLDER, generateMockMeeting } from "./liveFormUtils";

const PLATFORM_OPTIONS: ChoiceOption<LivePlatform>[] = [
  { value: "ZOOM", title: "Zoom", description: "Popular and reliable", icon: <PlatformIcon platform="ZOOM" size="md" /> },
  { value: "GOOGLE_MEET", title: "Google Meet", description: "Easy to use", icon: <PlatformIcon platform="GOOGLE_MEET" size="md" /> },
  { value: "TEAMS", title: "Microsoft Teams", description: "For organizations", icon: <PlatformIcon platform="TEAMS" size="md" /> },
  { value: "CUSTOM", title: "Custom Link", description: "Use your own link", icon: <PlatformIcon platform="CUSTOM" size="md" /> },
];

const SHORT_NAME: Record<Exclude<LivePlatform, "CUSTOM">, string> = { ZOOM: "Zoom", GOOGLE_MEET: "Meet", TEAMS: "Teams" };

const hostMatches = (platform: LivePlatform, link: string) => {
  if (platform === "CUSTOM") return true;
  try {
    return PLATFORM_HOSTS[platform].test(new URL(link).hostname);
  } catch {
    return false;
  }
};

/** Platform cards, Meeting Link (+ Generate … Meeting), Zoom ID / Passcode and "send link to students". */
export function MeetingPlatformCard() {
  const {
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<LiveClassFormValues>();
  const platform = useWatch({ control, name: "platform" });
  const [generating, setGenerating] = useState(false);
  const opts = { shouldDirty: true, shouldValidate: true } as const;

  const changePlatform = (next: LivePlatform) => {
    const link = getValues("meetingLink");
    setValue("platform", next, { shouldDirty: true });
    // Drop a link / ID that belongs to the previous provider.
    if (link && !hostMatches(next, link)) {
      setValue("meetingLink", "", { shouldDirty: true });
      setValue("meetingId", "", { shouldDirty: true });
      setValue("passcode", "", { shouldDirty: true });
    } else if (next !== "ZOOM") {
      setValue("meetingId", "", { shouldDirty: true });
      setValue("passcode", "", { shouldDirty: true });
    }
  };

  const generate = async () => {
    if (platform === "CUSTOM") return;
    setGenerating(true);
    const name = LIVE_PLATFORM_LABEL[platform];
    const toastId = toast.loading(`Generating ${name} meeting...`, { description: "Creating a new meeting room for this class." });
    try {
      const meeting = await generateMockMeeting(platform);
      setValue("meetingLink", meeting.meetingLink, opts);
      setValue("meetingId", meeting.meetingId, opts);
      setValue("passcode", meeting.passcode, opts);
      toast.success(`${name} meeting created`, {
        id: toastId,
        description: platform === "ZOOM" ? `Meeting ID ${meeting.meetingId} · Passcode ${meeting.passcode}` : "The meeting link was added to this class.",
      });
    } catch {
      toast.error("Couldn't generate the meeting", { id: toastId, description: "Please try again or paste a link manually." });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <IconSectionCard icon={<Video className="h-5 w-5" />} title="Meeting Platform" description="Where students join the live session." tone="green">
      <div className="space-y-4">
        <ChoiceCardGroup name="live-platform" aria-label="Meeting platform" value={platform} onChange={changePlatform} options={PLATFORM_OPTIONS} columns={4} />

        <div>
          <FieldLabel htmlFor="live-link" label="Meeting Link" required />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <InputField
              id="live-link"
              type="url"
              placeholder={LINK_PLACEHOLDER[platform]}
              leftElement={<Link2 className="h-4 w-4" />}
              aria-invalid={!!errors.meetingLink}
              error={errors.meetingLink?.message}
              containerClassName="flex-1 min-w-0"
              {...register("meetingLink")}
            />
            {platform !== "CUSTOM" && (
              <SecondaryButton
                type="button"
                onClick={generate}
                isLoading={generating}
                disabled={generating}
                leftIcon={<Sparkles className="h-4 w-4" />}
                className="shrink-0 whitespace-nowrap"
              >
                Generate {SHORT_NAME[platform]} Meeting
              </SecondaryButton>
            )}
          </div>
        </div>

        {platform === "ZOOM" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <FieldLabel htmlFor="live-meeting-id" label="Meeting ID" optional />
              <InputField
                id="live-meeting-id"
                placeholder="e.g. 845 2931 0472"
                leftElement={<Hash className="h-4 w-4" />}
                error={errors.meetingId?.message}
                {...register("meetingId")}
              />
            </div>
            <div>
              <FieldLabel htmlFor="live-passcode" label="Passcode" optional />
              <InputField
                id="live-passcode"
                placeholder="e.g. Xy7Kp2"
                leftElement={<KeyRound className="h-4 w-4" />}
                error={errors.passcode?.message}
                {...register("passcode")}
              />
            </div>
          </div>
        )}

        <Controller
          control={control}
          name="sendLinkToStudents"
          render={({ field }) => (
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-orange"
              />
              <span>
                <span className="block body-sm-medium text-primary-500">Send meeting link to enrolled students automatically</span>
                <span className="block body-xsm-regular text-primary-300">Students will receive an email and in-app notification with the meeting link.</span>
              </span>
            </label>
          )}
        />
      </div>
    </IconSectionCard>
  );
}

export default MeetingPlatformCard;
