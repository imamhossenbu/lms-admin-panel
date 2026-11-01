import React from "react";
import { Avatar } from "@/components/ui/Avatar";

/** Avatar initials + student name for analytics tables. */
export function StudentCell({ name }: { name: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Avatar name={name} size={28} />
      <span className="truncate body-sm-regular text-primary-500">{name}</span>
    </span>
  );
}

export default StudentCell;
