import type { RoleTone } from "@/types/team";
import type { Tone } from "@/components/ui/ToneBadge";

/** Visual meta per role colour (token classes only). */
export const ROLE_TONE_META: Record<RoleTone, { label: string; badge: Tone; swatch: string; tile: string; ring: string }> = {
  orange: { label: "Orange", badge: "orange", swatch: "bg-brand-orange", tile: "bg-brand-orange-light text-brand-orange", ring: "ring-brand-orange" },
  blue: { label: "Blue", badge: "blue", swatch: "bg-blue", tile: "bg-blue-14 text-blue", ring: "ring-blue" },
  green: { label: "Green", badge: "green", swatch: "bg-green", tile: "bg-green-bg text-green", ring: "ring-green" },
  purple: { label: "Purple", badge: "purple", swatch: "bg-purple", tile: "bg-purple-14 text-purple", ring: "ring-purple" },
  yellow: { label: "Yellow", badge: "yellow", swatch: "bg-yellow", tile: "bg-yellow-bg text-yellow", ring: "ring-yellow" },
  red: { label: "Red", badge: "red", swatch: "bg-red", tile: "bg-red-14 text-red", ring: "ring-red" },
  gray: { label: "Slate", badge: "gray", swatch: "bg-primary-300", tile: "bg-gray-bg text-primary-400", ring: "ring-primary-300" },
};
