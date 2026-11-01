"use client";

import React from "react";
import { CardActionButton } from "@/components/ui/CardActionButton";

export interface SettingsActionButtonProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  className?: string;
}

/** Action next to a settings control ("Add New Category", "Customize Certificate") — the shared CardActionButton. */
export function SettingsActionButton(props: SettingsActionButtonProps) {
  return <CardActionButton {...props} />;
}

export default SettingsActionButton;
