"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, Copy, LayoutTemplate } from "lucide-react";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { RUBRIC_TEMPLATES, type RubricTemplate } from "./rubricTemplates";

export interface UseTemplateMenuProps {
  onPickTemplate: (template: RubricTemplate) => void;
  onCopyFromAssignment: () => void;
}

/** "Use Template ▾" dropdown (built-in templates + copy from another assignment). */
export function UseTemplateMenu({ onPickTemplate, onCopyFromAssignment }: UseTemplateMenuProps) {
  return (
    <AppDropdownMenu
      align="end"
      items={[
        ...RUBRIC_TEMPLATES.map((t) => ({ key: t.id, label: t.name, icon: <LayoutTemplate className="h-4 w-4 text-blue" />, onClick: () => onPickTemplate(t) })),
        { key: "copy", label: "Copy from another assignment…", icon: <Copy className="h-4 w-4 text-primary-400" />, onClick: onCopyFromAssignment, separatorBefore: true },
      ]}
      trigger={
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-dash bg-white px-3.5 body-sm-medium text-blue shadow-2xs transition-colors hover:bg-blue-14"
        >
          Use Template
          <ChevronDown className="h-4 w-4" />
        </motion.button>
      }
    />
  );
}

export default UseTemplateMenu;
