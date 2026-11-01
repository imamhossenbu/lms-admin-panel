"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";

/** Edit route for a template id that doesn't exist (deleted / bad link). */
export function TemplateNotFound() {
  const router = useRouter();
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8">
      <Breadcrumb
        items={[
          { label: "Certificates", href: "/certificates" },
          { label: "Templates", href: "/certificates?tab=templates" },
          { label: "Not Found" },
        ]}
      />
      <div className="dashboard-card shadow-2xs p-10 flex flex-col items-center text-center gap-3">
        <span className="w-12 h-12 rounded-full bg-gray-bg text-primary-300 flex items-center justify-center">
          <SearchX className="w-6 h-6" />
        </span>
        <h2 className="heading-h5 font-bold! text-primary-500">Template not found</h2>
        <p className="body-sm-regular text-primary-300 max-w-md">This certificate template may have been deleted, or the link is incorrect.</p>
        <PrimaryButton className="mt-2" onClick={() => router.push("/certificates?tab=templates")}>
          View All Templates
        </PrimaryButton>
      </div>
    </motion.div>
  );
}

export default TemplateNotFound;
