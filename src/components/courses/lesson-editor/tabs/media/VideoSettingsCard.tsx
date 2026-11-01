"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Settings } from "lucide-react";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";

type PlayerKey = keyof LessonEditorValues["media"]["player"];

const PLAYER_TOGGLES: { key: PlayerKey; title: string; description: string }[] = [
  { key: "enabled", title: "Enable Video Player", description: "Allow students to watch the lesson video." },
  { key: "allowDownload", title: "Allow Download", description: "Allow students to download the video." },
  { key: "playbackSpeed", title: "Enable Playback Speed", description: "Allow students to change video speed." },
  { key: "pictureInPicture", title: "Enable Picture in Picture", description: "Allow students to use picture in picture mode." },
  { key: "showSubtitles", title: "Show Subtitles/CC", description: "Display subtitles if available." },
];

/** "Video Settings": player feature toggles (media.player.*). */
export function VideoSettingsCard() {
  const { control } = useFormContext<LessonEditorValues>();

  return (
    <IconSectionCard
      icon={<Settings className="h-5 w-5" />}
      title="Video Settings"
      description="Configure video player settings and learning experience."
      tone="blue"
      bodyClassName="space-y-5"
    >
      {PLAYER_TOGGLES.map(({ key, title, description }) => (
        <Controller
          key={key}
          control={control}
          name={`media.player.${key}`}
          render={({ field }) => <SettingToggleRow title={title} description={description} checked={field.value} onChange={field.onChange} />}
        />
      ))}
    </IconSectionCard>
  );
}

export default VideoSettingsCard;
