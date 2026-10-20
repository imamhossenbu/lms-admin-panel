import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CoursesGridClient } from "@/components/courses/CoursesGridClient";
import { ToneBadge } from "@/components/ui/ToneBadge";

export default function CoursesManagementPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculum & Course Catalog"
        description="Author learning modules, manage lesson resources, and audit course publication status."
        badge={<ToneBadge tone="primary">AI Enabled</ToneBadge>}
      />
      <CoursesGridClient />
    </div>
  );
}
