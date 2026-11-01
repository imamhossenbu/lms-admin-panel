"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Award, FileX } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";

/** Shown when the certificate id doesn't exist (or was removed). */
export function CertificateNotFound() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Certificates", href: "/certificates" }, { label: "Certificate not found" }]} />
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="dashboard-card mx-auto flex max-w-lg flex-col items-center gap-4 p-10 text-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-14 text-red">
          <FileX className="h-8 w-8" />
        </span>
        <div>
          <h1 className="heading-h4 font-bold! text-primary-500">Certificate not found</h1>
          <p className="mt-1.5 body-sm-regular text-primary-300">It may have been removed, or the link is incorrect.</p>
        </div>
        <PrimaryButton leftIcon={<Award />} onClick={() => router.push("/certificates")}>
          Go to Certificates
        </PrimaryButton>
      </motion.div>
    </div>
  );
}

export default CertificateNotFound;
