"use client";

import React from "react";
import { User } from "lucide-react";
import { InstructorItem } from "@/types/instructor";
import { InstructorDetailCard } from "../InstructorDetailCard";
import { InfoRow } from "./InfoRow";

export function InstructorInfoCard({ instructor }: { instructor: InstructorItem }) {
  const isActive = instructor.status === "Active";
  return (
    <InstructorDetailCard icon={<User />} title="Instructor Information">
      <div className="divide-y divide-dash">
        <InfoRow label="Full Name">{instructor.name}</InfoRow>
        <InfoRow label="Email Address">
          <a href={`mailto:${instructor.email}`} className="text-blue hover:underline break-all">
            {instructor.email}
          </a>
        </InfoRow>
        <InfoRow label="Phone Number">{instructor.phone || "—"}</InfoRow>
        <InfoRow label="Status">
          <span className="inline-flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isActive ? "bg-green" : "bg-red"}`} />
            {instructor.status}
          </span>
        </InfoRow>
        <InfoRow label="Join Date">{instructor.joinDate}</InfoRow>
        <InfoRow label="Bio">
          <p className="max-w-md leading-relaxed">{instructor.bio || "—"}</p>
        </InfoRow>
      </div>
    </InstructorDetailCard>
  );
}

export default InstructorInfoCard;
