import type { SignupFormValues } from "@/validations/saasSchema";

export type SignupStep = 1 | 2 | 3 | 4;

export const SIGNUP_STEPS: { id: SignupStep; label: string; hint: string }[] = [
  { id: 1, label: "Your account", hint: "Who's signing up" },
  { id: 2, label: "Your institution", hint: "Name & web address" },
  { id: 3, label: "Choose plan", hint: "Free 14-day trial" },
  { id: 4, label: "Done", hint: "You're all set" },
];

/** Fields validated before leaving each step. */
export const STEP_FIELDS: Record<1 | 2 | 3, (keyof SignupFormValues)[]> = {
  1: ["name", "email", "password"],
  2: ["institutionName", "type", "country", "slug"],
  3: ["planId", "cycle", "agreeTerms"],
};

export const stepOfField = (field: keyof SignupFormValues): 1 | 2 | 3 =>
  (([1, 2, 3] as const).find((s) => STEP_FIELDS[s].includes(field)) ?? 1);

/** Form values while filling in (agreeTerms starts unchecked). */
export type SignupDraft = Omit<SignupFormValues, "agreeTerms"> & { agreeTerms: boolean };

export const SIGNUP_DEFAULTS: SignupDraft = {
  name: "",
  email: "",
  password: "",
  institutionName: "",
  type: "SCHOOL",
  country: "Bangladesh",
  slug: "",
  planId: "growth",
  cycle: "MONTHLY",
  agreeTerms: false,
};

export interface SignupResult {
  institutionName: string;
  slug: string;
  email: string;
  planName: string;
  trialEndsAt: string | null;
}

export interface SignupSession {
  step: SignupStep;
  /** Furthest step reached (Previous is always allowed, never skipping ahead of this). */
  maxStep: SignupStep;
  /** Everything except the password, which is never written to storage. */
  values: Omit<SignupDraft, "password">;
  /** Whether the user edited the subdomain by hand (stops auto-suggest from the name). */
  slugTouched: boolean;
  result: SignupResult | null;
}

const KEY = "edupro_signup_wizard_v1";

export function loadSignupSession(): SignupSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SignupSession;
    if (![1, 2, 3, 4].includes(parsed.step)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSignupSession(session: SignupSession) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* storage full / disabled — the wizard still works, it just won't resume */
  }
}

export function clearSignupSession() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
