"use client";

import React, { Suspense } from "react";
import { WebsiteView } from "@/components/website/WebsiteView";
import { WebsiteSkeleton } from "@/components/website/WebsiteSkeleton";

/** Academy website: content, contact messages and newsletter subscribers (`?tab=` survives reloads). */
export default function WebsitePage() {
  return (
    <Suspense fallback={<WebsiteSkeleton />}>
      <WebsiteView />
    </Suspense>
  );
}
