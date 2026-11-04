import { redirect } from "next/navigation";

/** Old standalone route: categories are edited in the /categories drawer. */
export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/categories?drawer=${encodeURIComponent(id)}&mode=edit`);
}
