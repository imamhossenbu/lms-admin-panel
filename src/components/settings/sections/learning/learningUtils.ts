import type { LearningSettings } from "@/validations/platformSettingsSchema";

/** Friendly audit labels for changed fields. */
export const LEARNING_LABELS: Partial<Record<keyof LearningSettings, string>> = {
  enrollmentApproval: "Enrollment approval",
  allowGuestPreview: "Guest preview",
  completionThreshold: "Completion threshold",
  sequentialLessons: "Sequential lessons",
  allowReviews: "Course reviews",
  reviewModeration: "Review moderation",
  enableCommunity: "Community",
  autoIssueCertificates: "Auto-issue certificates",
  maxUploadMb: "Max upload size",
  defaultPassingScore: "Default passing score",
  lateSubmissionPenalty: "Late submission penalty",
};

export const UPLOAD_PRESETS = [25, 50, 100, 500] as const;

export type SummaryTone = "green" | "blue" | "orange" | "purple" | "yellow";

export interface SummaryLine {
  id: string;
  tone: SummaryTone;
  text: string;
}

const num = (n: unknown, fallback: number) => (typeof n === "number" && Number.isFinite(n) ? n : fallback);

/** Plain-language consequences of the current values ("What this means"). */
export function learningSummary(v: Partial<LearningSettings>): SummaryLine[] {
  const threshold = num(v.completionThreshold, 90);
  const pass = num(v.defaultPassingScore, 70);
  const penalty = num(v.lateSubmissionPenalty, 0);
  const upload = num(v.maxUploadMb, 50);

  const lines: SummaryLine[] = [
    {
      id: "enroll",
      tone: "blue",
      text:
        v.enrollmentApproval === "MANUAL"
          ? "Students request to join — an admin approves each enrollment before they get access."
          : "Students get access to a course the moment they enroll or pay.",
    },
    {
      id: "guest",
      tone: "purple",
      text: v.allowGuestPreview ? "Visitors can watch preview lessons without signing in." : "Only signed-in students can open any lesson.",
    },
    {
      id: "complete",
      tone: "green",
      text: `A course counts as completed once ${threshold}% of its lessons are done${v.sequentialLessons ? ", unlocked one at a time in order" : ", in any order"}.`,
    },
    {
      id: "assess",
      tone: "orange",
      text: `Quizzes and assignments need ${pass}% to pass${penalty > 0 ? `; late work loses ${penalty}% of its score` : "; late work isn't penalised"}.`,
    },
  ];

  if (v.autoIssueCertificates) lines.push({ id: "cert", tone: "green", text: "Certificates are issued automatically when a course is completed." });
  else lines.push({ id: "cert", tone: "yellow", text: "Certificates are issued manually by an admin." });

  if (v.allowReviews)
    lines.push({
      id: "reviews",
      tone: "blue",
      text: v.reviewModeration ? "Students can review courses; reviews appear after an admin approves them." : "Students can review courses; reviews are published instantly.",
    });
  else lines.push({ id: "reviews", tone: "yellow", text: "Course reviews are turned off." });

  lines.push({ id: "community", tone: "purple", text: v.enableCommunity ? "The community space is open for discussions." : "The community space is hidden." });
  lines.push({ id: "upload", tone: "orange", text: `Students and instructors can upload files up to ${upload} MB.` });

  return lines;
}
