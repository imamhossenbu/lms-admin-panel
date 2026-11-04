import { isAxiosError } from "axios";

/** Machine-readable codes the API attaches to 403 responses. */
export type ApiErrorCode = "PLAN_FEATURE_REQUIRED" | "PLAN_LIMIT_REACHED" | "WORKSPACE_INACTIVE" | "TWO_FACTOR_SETUP_REQUIRED";

export interface ApiErrorInfo {
  status: number | null;
  code: ApiErrorCode | null;
  /** User-friendly text (never a stack trace or raw status). */
  message: string;
  /** Extra fields the API sent (e.g. feature, requiredPlanId, limit, usage, max). */
  details: Record<string, unknown>;
}

const FALLBACK = "Something went wrong. Please try again.";

/** Normalises any thrown value (Axios error, Error, string) into one shape for toasts and banners. */
export function parseApiError(err: unknown, fallback = FALLBACK): ApiErrorInfo {
  if (isAxiosError(err)) {
    const data = (err.response?.data ?? {}) as Record<string, unknown>;
    const raw = data.message;
    const message = Array.isArray(raw) ? raw.join(" · ") : typeof raw === "string" && raw ? raw : err.response ? fallback : "Can't reach the server. Check your connection and try again.";
    return { status: err.response?.status ?? null, code: (data.code as ApiErrorCode) ?? null, message, details: data };
  }
  if (err instanceof Error && err.message) return { status: null, code: null, message: err.message, details: {} };
  if (typeof err === "string" && err) return { status: null, code: null, message: err, details: {} };
  return { status: null, code: null, message: fallback, details: {} };
}

/** Shortcut when only the text is needed. */
export const apiErrorMessage = (err: unknown, fallback?: string) => parseApiError(err, fallback).message;
