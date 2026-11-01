"use client";

import React from "react";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

export interface FeatureToggleProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Switch with a bold title and helper text underneath. */
export function FeatureToggle({ id, title, description, checked, onChange }: FeatureToggleProps) {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <ToggleSwitch id={id} checked={checked} onChange={onChange} tone="orange" className="mt-0.5" />
      <label htmlFor={id} className="min-w-0 cursor-pointer select-none">
        <span className="block body-sm-medium text-primary-500">{title}</span>
        <span className="block body-xsm-regular text-primary-300 mt-0.5">{description}</span>
      </label>
    </div>
  );
}

export default FeatureToggle;
