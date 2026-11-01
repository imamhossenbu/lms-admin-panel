import { redirect } from "next/navigation";

/** /users/roles → the Roles & permissions tab. */
export default function RolesIndexPage() {
  redirect("/users?tab=roles");
}
