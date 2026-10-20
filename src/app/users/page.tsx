import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { UsersTableClient } from "@/components/users/UsersTableClient";
import { ToneBadge } from "@/components/ui/ToneBadge";

export default function UsersManagementPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="User & Access Directory"
        description="Oversee student enrollments, instructor credentials, and administrative authority."
        badge={<ToneBadge tone="navy">RBAC Enforced</ToneBadge>}
      />
      <UsersTableClient />
    </div>
  );
}
