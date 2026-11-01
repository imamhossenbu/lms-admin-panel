import { z } from "zod";

/**
 * Create Course → Step 3 "Pricing & Access" and Step 4 "Additional Settings".
 * One react-hook-form instance typed as `CoursePublishInput`; both step cards read it via
 * `useFormContext<CoursePublishInput>()`. Category, language and difficulty live in the
 * Step 1 form (`CourseBasicInfoInput`) and are passed to Step 4 as props.
 */

export const PRICE_TYPES = ["FREE", "ONE_TIME", "SUBSCRIPTION", "BUNDLE"] as const;
export const ENROLLMENT_MODES = ["OPEN", "APPROVAL", "INVITE"] as const;
export const ACCESS_DURATIONS = ["LIFETIME", "LIMITED", "SUBSCRIPTION"] as const;
export const COURSE_VISIBILITIES = ["PUBLIC", "PRIVATE", "UNLISTED"] as const;

export const COURSE_PRICE_MAX = 100000;
export const COURSE_ENROLLMENT_LIMIT_MAX = 100000;

export const COURSE_FEATURE_KEYS = [
  "discussions",
  "assignments",
  "reviews",
  "quizzes",
  "liveClasses",
  "downloadableResources",
] as const;
export type CourseFeatureKey = (typeof COURSE_FEATURE_KEYS)[number];

export const coursePublishSchema = z
  .object({
    // ---- Step 3: Pricing & Access ----
    priceType: z.enum(PRICE_TYPES),
    price: z
      .number({ error: "Enter a price" })
      .min(0, "Price cannot be negative")
      .max(COURSE_PRICE_MAX, `Price must be ${COURSE_PRICE_MAX} or less`),
    enrollment: z.enum(ENROLLMENT_MODES),
    /** 0 = unlimited. */
    enrollmentLimit: z
      .number({ error: "Enter a number (0 for unlimited)" })
      .int("Whole numbers only")
      .min(0, "Cannot be negative")
      .max(COURSE_ENROLLMENT_LIMIT_MAX, "Limit is too large"),
    accessDuration: z.enum(ACCESS_DURATIONS),
    /** Days of access when accessDuration = LIMITED. */
    accessDays: z.number({ error: "Enter the number of days" }).int("Whole numbers only").min(1, "Must be at least 1 day").max(3650, "Must be 3650 days or less"),

    // ---- Step 4: Additional Settings ----
    visibility: z.enum(COURSE_VISIBILITIES),
    certificateEnabled: z.boolean(),
    features: z.object({
      discussions: z.boolean(),
      assignments: z.boolean(),
      reviews: z.boolean(),
      quizzes: z.boolean(),
      liveClasses: z.boolean(),
      downloadableResources: z.boolean(),
    }),
  })
  .superRefine((v, ctx) => {
    if (v.priceType !== "FREE" && v.price <= 0) {
      ctx.addIssue({ code: "custom", path: ["price"], message: "Enter a price greater than 0 for a paid course" });
    }
  });

export type CoursePublishInput = z.infer<typeof coursePublishSchema>;
export type PriceType = (typeof PRICE_TYPES)[number];

/** Fields validated when leaving Step 3 (use with `form.trigger(PRICING_FIELDS)`). */
export const PRICING_FIELDS = ["priceType", "price", "enrollment", "enrollmentLimit", "accessDuration", "accessDays"] as const;
/** Fields validated when leaving Step 4. */
export const ADDITIONAL_SETTINGS_FIELDS = ["visibility", "certificateEnabled", "features"] as const;

export const EMPTY_COURSE_PUBLISH: CoursePublishInput = {
  priceType: "FREE",
  price: 0,
  enrollment: "OPEN",
  enrollmentLimit: 0,
  accessDuration: "LIFETIME",
  accessDays: 365,
  visibility: "PUBLIC",
  certificateEnabled: true,
  features: {
    discussions: true,
    assignments: false,
    reviews: true,
    quizzes: true,
    liveClasses: false,
    downloadableResources: false,
  },
};

export const PRICE_TYPE_LABEL: Record<PriceType, string> = {
  FREE: "Free",
  ONE_TIME: "One-time Payment",
  SUBSCRIPTION: "Subscription",
  BUNDLE: "Course Bundle",
};
export const ENROLLMENT_LABEL: Record<(typeof ENROLLMENT_MODES)[number], string> = {
  OPEN: "Open Enrollment",
  APPROVAL: "Approval Required",
  INVITE: "Invitation Only",
};
export const ACCESS_DURATION_LABEL: Record<(typeof ACCESS_DURATIONS)[number], string> = {
  LIFETIME: "Lifetime Access",
  LIMITED: "Limited Time Access",
  SUBSCRIPTION: "Subscription Access",
};
export const COURSE_VISIBILITY_LABEL: Record<(typeof COURSE_VISIBILITIES)[number], string> = {
  PUBLIC: "Public",
  PRIVATE: "Private",
  UNLISTED: "Unlisted",
};
