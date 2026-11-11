"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

/** Page title + "View live site". */
export function WebsiteHeader({ siteUrl }: { siteUrl: string | null }) {
  return (
    <PageHeader
      title="Website"
      description="Edit your academy website, read messages from the Contact page and manage newsletter subscribers."
      action={
        siteUrl ? (
          <motion.a whileTap={{ scale: 0.96 }} href={siteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-orange px-4 body-sm-medium text-white transition-colors hover:bg-brand-orange-hover">
            <ExternalLink className="h-4 w-4" />
            View live site
          </motion.a>
        ) : undefined
      }
    />
  );
}

export default WebsiteHeader;
