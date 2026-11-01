"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { TeamRole, TeamSeed } from "@/types/team";
import { membersByRole, sortRoles } from "@/lib/teamStats";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ProTipCard } from "@/components/ui/ProTipCard";
import type { TeamActions } from "../shared/useTeamActions";
import { plural } from "../shared/teamFormat";
import { RoleCard } from "./RoleCard";

export interface RolesTabProps {
  data: TeamSeed;
  actions: TeamActions;
}

/** Roles & permissions: system + custom role cards (Edit/View, Duplicate, Delete) and "Create role". */
export function RolesTab({ data, actions }: RolesTabProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<TeamRole | null>(null);
  const roles = useMemo(() => sortRoles(data.roles), [data.roles]);
  const holders = useMemo(() => membersByRole(data.members), [data.members]);
  const custom = roles.filter((r) => !r.isSystem).length;

  const askDelete = (r: TeamRole) => {
    const n = holders[r.id]?.length ?? 0;
    if (n > 0) {
      toast.error("This role is still in use", { description: `${plural(n, "person has", "people have")} the ${r.name} role. Move them to another role first.` });
      return;
    }
    setDeleting(r);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="body-md-medium font-semibold! text-primary-500">Roles &amp; permissions</h3>
          <p className="body-sm-regular text-primary-300">
            {roles.length - custom} system roles · {plural(custom, "custom role")}. System roles are read-only — duplicate one to customise it.
          </p>
        </div>
        <PrimaryButton leftIcon={<Plus className="h-4 w-4" />} onClick={() => router.push("/users/roles/new")}>
          Create role
        </PrimaryButton>
      </div>

      <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
        <AnimatePresence initial={false}>
          {roles.map((r) => (
            <RoleCard
              key={r.id}
              role={r}
              members={holders[r.id] ?? []}
              busy={actions.busyId === r.id}
              onOpen={() => router.push(`/users/roles/${r.id}/edit`)}
              onDuplicate={() =>
                void actions
                  .duplicate(r)
                  .then((copy) => router.push(`/users/roles/${copy.id}/edit`))
                  .catch(() => {})
              }
              onDelete={() => askDelete(r)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <ProTipCard title="Least privilege">
        Give people the smallest role that lets them do their job. Create a custom role (for example &quot;Teaching Assistant&quot;) instead of handing out Admin.
      </ProTipCard>

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete role?"
        subtitle={deleting?.name}
        message="This custom role will be removed permanently. No one is assigned to it, so nobody loses access."
        confirmLabel="Delete role"
        pendingLabel="Deleting..."
        confirmIcon={<Trash2 className="h-4 w-4" />}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (deleting) await actions.removeRole(deleting);
        }}
      />
    </div>
  );
}

export default RolesTab;
