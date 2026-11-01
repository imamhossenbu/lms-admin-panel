/** Friendly message for a failed mock/API call. */
export const errorText = (e: unknown, fallback = "Something went wrong. Please try again.") =>
  e instanceof Error && e.message ? e.message : fallback;
