"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";

export interface TeamNotFoundProps {
  what: "member" | "role";
}

/** Bad / stale link to a member or role. */
export function TeamNotFound({ what }: TeamNotFoundProps) {
  const router = useRouter();
  const href = what === "role" ? "/users?tab=roles" : "/users";
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8">
      <Breadcrumb items={[{ label: "Team & Roles", href: "/users" }, ...(what === "role" ? [{ label: "Roles", href }] : []), { label: "Not found" }]} />
      <div className="dashboard-card shadow-2xs flex flex-col items-center gap-3 p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-bg text-primary-300">
          <SearchX className="h-6 w-6" />
        </span>
        <h2 className="heading-h5 font-bold! text-primary-500">{what === "role" ? "Role not found" : "Team member not found"}</h2>
        <p className="max-w-md body-sm-regular text-primary-300">
          {what === "role" ? "This role may have been deleted, or the link is incorrect." : "This person may have been removed from the team, their invitation revoked, or the link is incorrect."}
        </p>
        <PrimaryButton className="mt-2" onClick={() => router.push(href)}>
          {what === "role" ? "View all roles" : "View team"}
        </PrimaryButton>
      </div>
    </motion.div>
  );
}

export default TeamNotFound;
