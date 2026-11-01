"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";

/** Editor route for a template id that doesn't exist. */
export function TemplateNotFound() {
  const router = useRouter();
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8">
      <Breadcrumb items={[{ label: "Notifications", href: "/notifications" }, { label: "Templates", href: "/notifications?tab=templates" }, { label: "Not Found" }]} />
      <div className="dashboard-card shadow-2xs flex flex-col items-center gap-3 p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-bg text-primary-300">
          <SearchX className="h-6 w-6" />
        </span>
        <h2 className="heading-h5 font-bold! text-primary-500">Template not found</h2>
        <p className="max-w-md body-sm-regular text-primary-300">This automated template doesn&apos;t exist, or the link is incorrect.</p>
        <PrimaryButton className="mt-2" onClick={() => router.push("/notifications?tab=templates")}>
          View All Templates
        </PrimaryButton>
      </div>
    </motion.div>
  );
}

export default TemplateNotFound;
