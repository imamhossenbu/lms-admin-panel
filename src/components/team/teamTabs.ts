export type TeamTab = "members" | "invitations" | "roles" | "activity";

export const TEAM_TABS: { id: TeamTab; label: string }[] = [
  { id: "members", label: "Members" },
  { id: "invitations", label: "Invitations" },
  { id: "roles", label: "Roles & permissions" },
  { id: "activity", label: "Activity" },
];

export const parseTeamTab = (v: string): TeamTab => (v === "invitations" || v === "roles" || v === "activity" ? v : "members");
