import { redirect } from "next/navigation";

/** Old standalone route: categories are created in the /categories drawer. */
export default function CreateCategoryPage() {
  redirect("/categories?drawer=new");
}
