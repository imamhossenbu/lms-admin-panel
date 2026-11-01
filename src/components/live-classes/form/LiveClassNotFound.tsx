"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PrimaryButton } from "@/components/ui/primary-button";

/** Edit route for an id that doesn't exist (deleted / bad link). */
export function LiveClassNotFound() {
  const router = useRouter();
  return (
    <div className="space-y-5 pb-8">
      <Breadcrumb items={[{ label: "Live Classes", href: "/live-classes" }, { label: "Not Found" }]} />
      <div className="dashboard-card shadow-2xs p-10 flex flex-col items-center text-center gap-3">
        <span className="w-12 h-12 rounded-full bg-gray-bg text-primary-300 flex items-center justify-center">
          <SearchX className="w-6 h-6" />
        </span>
        <h2 className="heading-h5 font-bold! text-primary-500">Live class not found</h2>
        <p className="body-sm-regular text-primary-300 max-w-md">This class may have been deleted, or the link is incorrect.</p>
        <PrimaryButton className="mt-2" onClick={() => router.push("/live-classes")}>
          View All Live Classes
        </PrimaryButton>
      </div>
    </div>
  );
}

export default LiveClassNotFound;
