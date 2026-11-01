/** Message of a react-hook-form error node (array-level errors may sit on `root`). */
export function fieldErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;
  const node = error as { message?: unknown; root?: { message?: unknown } };
  if (typeof node.message === "string" && node.message) return node.message;
  if (typeof node.root?.message === "string" && node.root.message) return node.root.message;
  return undefined;
}
