"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

/** Dashed "+ New Template" tile at the end of the templates grid. */
export function NewTemplateCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex min-h-80 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-dash bg-white p-6 text-center transition-colors hover:border-brand-orange hover:bg-brand-orange-light"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange-light text-brand-orange">
        <Plus className="h-6 w-6" />
      </span>
      <span className="body-medium font-semibold! text-primary-500">New Template</span>
      <span className="max-w-60 body-sm-regular text-primary-300">Design a certificate, assign it to courses and set the issue rules.</span>
    </motion.button>
  );
}

export default NewTemplateCard;
