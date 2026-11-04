import {
  ACCESS_DURATION_LABEL,
  COURSE_VISIBILITY_LABEL,
  ENROLLMENT_LABEL,
  PRICE_TYPE_LABEL,
  type CoursePublishInput,
} from "@/validations/coursePublishSchema";
import { formatMoney } from "@/lib/money";

/** 0 → "৳0.00", 49 → "৳49.00" (workspace currency). */
export const formatPrice = (price: number) => formatMoney(price, { fixed: true });

/** Short price tag for preview chips: "Free", "৳49", "৳19.99". */
export const priceTagLabel = (values: Pick<CoursePublishInput, "priceType" | "price">) => {
  if (values.priceType === "FREE" || !values.price) return "Free";
  const tag = formatMoney(values.price);
  return values.priceType === "SUBSCRIPTION" ? `${tag}/mo` : tag;
};

export const priceTypeLabel = (priceType: CoursePublishInput["priceType"]) => PRICE_TYPE_LABEL[priceType] ?? "—";

export const enrollmentLabel = (values: Pick<CoursePublishInput, "enrollment" | "enrollmentLimit">) => {
  const base = ENROLLMENT_LABEL[values.enrollment] ?? "—";
  return values.enrollmentLimit > 0 ? `${base} (max ${values.enrollmentLimit} students)` : base;
};

export const accessLabel = (values: Pick<CoursePublishInput, "accessDuration" | "accessDays">) => {
  if (values.accessDuration === "LIMITED") return `${ACCESS_DURATION_LABEL.LIMITED} (${values.accessDays} days)`;
  return ACCESS_DURATION_LABEL[values.accessDuration] ?? "—";
};

export const visibilityLabel = (visibility: CoursePublishInput["visibility"]) => COURSE_VISIBILITY_LABEL[visibility] ?? "—";

export const enabledLabel = (enabled: boolean) => (enabled ? "Enabled" : "Disabled");
