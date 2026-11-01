"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";

/** "Visible" / "Hidden" badge; click to toggle student visibility. */
export function VisibilityBadgeButton({ visible, title, onToggle }: { visible: boolean; title: string; onToggle: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={onToggle}
      aria-pressed={visible}
      aria-label={`${title} is ${visible ? "visible" : "hidden"}. Click to ${visible ? "hide it from" : "show it to"} students.`}
      title={visible ? "Click to hide from students" : "Click to show to students"}
      className="inline-flex cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
    >
      <ToneBadge tone={visible ? "green" : "gray"} icon={visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}>
        {visible ? "Visible" : "Hidden"}
      </ToneBadge>
    </motion.button>
  );
}

export default VisibilityBadgeButton;
