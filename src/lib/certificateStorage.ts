"use client";

import { useEffect, useState } from "react";
import type { CertificateEvent, CertificateRecipient, CertificateTemplate, EligibleLearner, IssuedCertificate } from "@/types/certificate";
import type { IssueCertificateValues, RevokeCertificateValues, TemplateFormValues } from "@/validations/certificateSchema";
import { apiClient } from "@/lib/api";

/**
 * Certificates data layer, backed by the Certificates API (`/admin/certificates*`, workspace-scoped). Function names
 * match the earlier mock store. Reads cache what they fetch (`getCertificatesSnapshot`); every write announces
 * CERTIFICATES_UPDATED_EVENT. Errors are Axios errors (show them with apiErrorMessage).
 */

export const CERTIFICATES_UPDATED_EVENT = "edupro_certificates_updated";

/** Recent-activity row: an event + what the card links to. */
export type CertificateActivity = CertificateEvent & { code: string; recipientName: string };
/** Learner picker row: flagged when they already hold a valid certificate for the course. */
export type CertificateLearner = CertificateRecipient & { hasCertificate: boolean };

/** Workspace-wide numbers for the Certificates page (GET /admin/certificates/stats). */
export interface CertificateOverview {
  total: number;
  valid: number;
  revoked: number;
  expired: number;
  last30: number;
  last30Delta: number | null;
  expiringSoon: number;
  verifications: number;
  downloads: number;
  autoShare: number;
  monthly: { month: string; label: string; count: number }[];
  byCourse: { courseId: string; courseTitle: string; count: number }[];
  templateUsage: { templateId: string; issued: number; lastIssuedAt: string | null }[];
  counts: { templates: number; eligible: number };
}

/** Everything the Certificates list page shows besides the Issued table (which loads page by page). */
export interface CertificateData {
  templates: CertificateTemplate[];
  overview: CertificateOverview;
  /** Latest workspace events (Recent Activity card). */
  events: CertificateActivity[];
  eligible: EligibleLearner[];
}

/** Issued-tab filters as the API takes them ("All" / "" = no filter). */
export interface IssuedQuery {
  q?: string;
  courseId?: string;
  templateId?: string;
  status?: string;
  method?: string;
  from?: string;
  to?: string;
  page: number;
  limit: number;
}

export interface CertificateDetail {
  certificate: IssuedCertificate;
  template: CertificateTemplate | null;
  events: CertificateEvent[];
}

interface Page<T> {
  data: T[];
  meta: { totalPages: number; total?: number };
}

const enc = encodeURIComponent;
const announce = () => typeof window !== "undefined" && window.dispatchEvent(new Event(CERTIFICATES_UPDATED_EVENT));
const isNotFound = (err: unknown) => (err as { response?: { status?: number } }).response?.status === 404;

const EMPTY_OVERVIEW: CertificateOverview = {
  total: 0,
  valid: 0,
  revoked: 0,
  expired: 0,
  last30: 0,
  last30Delta: null,
  expiringSoon: 0,
  verifications: 0,
  downloads: 0,
  autoShare: 0,
  monthly: [],
  byCourse: [],
  templateUsage: [],
  counts: { templates: 0, eligible: 0 },
};
let cache: CertificateData = { templates: [], overview: EMPTY_OVERVIEW, events: [], eligible: [] };
let templatesLoaded = false;


// ---------------------------------------------------------------- reads

export const getCertificatesSnapshot = (): CertificateData => cache;

/** Templates, the workspace stats, recent activity and the eligible queue. */
export async function fetchCertificates(): Promise<CertificateData> {
  const [templates, overview, events, eligible] = await Promise.all([
    fetchTemplates(),
    apiClient.get<CertificateOverview>("/admin/certificates/stats").then((r) => r.data),
    apiClient.get<CertificateActivity[]>("/admin/certificates/activity", { params: { limit: 20 } }).then((r) => r.data),
    apiClient.get<EligibleLearner[]>("/admin/certificates/eligible").then((r) => r.data),
  ]);
  cache = { templates, overview, events, eligible };
  return cache;
}

/** One page of issued certificates (newest first) matching the filters. */
export async function fetchIssuedPage(q: IssuedQuery): Promise<{ rows: IssuedCertificate[]; total: number }> {
  const params: Record<string, unknown> = { page: q.page, limit: q.limit, sortBy: "issuedAt", sortOrder: "desc" };
  for (const k of ["q", "courseId", "templateId", "status", "method", "from", "to"] as const) {
    const v = q[k]?.trim();
    if (v && v !== "All") params[k] = v;
  }
  const { data } = await apiClient.get<Page<IssuedCertificate>>("/admin/certificates", { params });
  return { rows: data.data, total: data.meta.total ?? data.data.length };
}

/** Every template of the workspace (cached for the designer's "course already used" warning and the issue modal). */
export async function fetchTemplates(): Promise<CertificateTemplate[]> {
  const { data } = await apiClient.get<CertificateTemplate[]>("/admin/certificates/templates");
  cache = { ...cache, templates: data };
  templatesLoaded = true;
  return data;
}

/** Templates, loading them once when nothing is cached yet (null while loading). */
export function useCertificateTemplates(enabled = true): CertificateTemplate[] | null {
  const [templates, setTemplates] = useState<CertificateTemplate[] | null>(templatesLoaded ? cache.templates : null);
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    const sync = () => alive && setTemplates(cache.templates);
    if (templatesLoaded) sync();
    else void fetchTemplates().then(sync, () => alive && setTemplates([]));
    window.addEventListener(CERTIFICATES_UPDATED_EVENT, sync);
    return () => {
      alive = false;
      window.removeEventListener(CERTIFICATES_UPDATED_EVENT, sync);
    };
  }, [enabled]);
  return templates;
}

/** Certificate + its template + its event log, or null when it isn't in this workspace. */
export async function fetchCertificate(id: string): Promise<CertificateDetail | null> {
  try {
    return (await apiClient.get<CertificateDetail>(`/admin/certificates/${enc(id)}`)).data;
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

export async function fetchTemplate(id: string): Promise<CertificateTemplate | null> {
  try {
    return (await apiClient.get<CertificateTemplate>(`/admin/certificates/templates/${enc(id)}`)).data;
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

/** Workspace students for the learner picker (enrolled in `courseId` when given; `q` searches name / email). */
export async function fetchCertificateLearners(courseId?: string, q?: string): Promise<CertificateLearner[]> {
  const { data } = await apiClient.get<CertificateLearner[]>("/admin/certificates/learners", {
    params: { ...(courseId && { courseId }), ...(q?.trim() && { q: q.trim() }), limit: 100 },
  });
  return data;
}

/** Verification by code (case-insensitive, counts the check); null when no certificate matches. */
export async function verifyCertificateCode(code: string): Promise<IssuedCertificate | null> {
  try {
    const { data } = await apiClient.post<IssuedCertificate>("/admin/certificates/verify", { code: code.trim() });
    announce();
    return data;
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

// ---------------------------------------------------------------- templates

/** A course can only be in ONE active template — the API moves it out of the others on activation. */
export async function createTemplate(v: TemplateFormValues): Promise<CertificateTemplate> {
  const { data } = await apiClient.post<CertificateTemplate>("/admin/certificates/templates", v);
  announce();
  return data;
}

export async function updateTemplate(id: string, patch: Partial<TemplateFormValues>): Promise<CertificateTemplate> {
  const { data } = await apiClient.patch<CertificateTemplate>(`/admin/certificates/templates/${enc(id)}`, patch);
  announce();
  return data;
}

/** Copy as DRAFT without courses. */
export async function duplicateTemplate(id: string): Promise<CertificateTemplate> {
  const { data } = await apiClient.post<CertificateTemplate>(`/admin/certificates/templates/${enc(id)}/duplicate`);
  announce();
  return data;
}

/** Templates with issued certificates can't be deleted (the API answers with "archive it instead"). */
export async function deleteTemplate(id: string): Promise<void> {
  await apiClient.delete(`/admin/certificates/templates/${enc(id)}`);
  announce();
}

// ---------------------------------------------------------------- issued certificates

export async function issueCertificate(v: IssueCertificateValues): Promise<IssuedCertificate> {
  const { data } = await apiClient.post<IssuedCertificate>("/admin/certificates/issue", v);
  announce();
  return data;
}

type RevokeInput = Pick<RevokeCertificateValues, "reason" | "details" | "notifyLearner">;

export async function revokeCertificate(id: string, v: RevokeInput): Promise<void> {
  await apiClient.post(`/admin/certificates/${enc(id)}/revoke`, { reason: v.reason, details: v.details, notifyLearner: v.notifyLearner });
  announce();
}

/** Revoke several at once; resolves how many were revoked. */
export async function bulkRevokeCertificates(ids: string[], v: RevokeInput): Promise<number> {
  const { data } = await apiClient.post<{ revoked: number }>("/admin/certificates/bulk/revoke", { ids, reason: v.reason, details: v.details, notifyLearner: v.notifyLearner });
  announce();
  return data.revoked;
}

export async function restoreCertificate(id: string): Promise<void> {
  await apiClient.post(`/admin/certificates/${enc(id)}/restore`);
  announce();
}

/** Re-send the certificate email. */
export async function emailCertificate(id: string): Promise<void> {
  await apiClient.post(`/admin/certificates/${enc(id)}/email`);
  announce();
}

/** Email several at once (revoked ones are skipped). */
export async function bulkEmailCertificates(ids: string[]): Promise<{ emailed: number; skipped: number }> {
  const { data } = await apiClient.post<{ emailed: number; skipped: number }>("/admin/certificates/bulk/email", { ids });
  announce();
  return data;
}

/** Count a download (the page renders the file client-side). */
export async function recordDownload(id: string): Promise<void> {
  await apiClient.post(`/admin/certificates/${enc(id)}/downloads`);
  announce();
}

/** Issue to everyone in the eligible queue for a course (skips anyone who already holds one); resolves how many were issued. */
export async function issueToEligible(courseId: string, sendEmail: boolean): Promise<number> {
  const { data } = await apiClient.post<{ issued: number; skipped: number }>("/admin/certificates/issue-eligible", { courseId, sendEmail });
  announce();
  return data.issued;
}
