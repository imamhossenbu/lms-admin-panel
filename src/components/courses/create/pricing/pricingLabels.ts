import type { CoursePublishInput } from "@/validations/coursePublishSchema";

type PriceValues = Pick<CoursePublishInput, "priceType" | "price">;
type AccessValues = Pick<CoursePublishInput, "enrollment" | "accessDuration" | "accessDays">;

const ENROLLMENT_SHORT: Record<CoursePublishInput["enrollment"], string> = {
  OPEN: "Open enrollment",
  APPROVAL: "Approval required",
  INVITE: "Invitation only",
};

const PRICE_SUFFIX: Record<Exclude<CoursePublishInput["priceType"], "FREE">, string> = {
  ONE_TIME: "One-time",
  SUBSCRIPTION: "Subscription",
  BUNDLE: "Bundle",
};

/** "$49.00" — falls back to "$0.00" for empty / invalid input. */
export function formatPrice(price: number): string {
  const safe = Number.isFinite(price) && price > 0 ? price : 0;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(safe);
}

/** "Free Course" or "$49.00 · One-time". */
export function priceSummaryLabel({ priceType, price }: PriceValues): string {
  if (priceType === "FREE") return "Free Course";
  return `${formatPrice(price)} · ${PRICE_SUFFIX[priceType]}`;
}

/** "Open enrollment • Lifetime access". */
export function accessSummaryLabel({ enrollment, accessDuration, accessDays }: AccessValues): string {
  const access =
    accessDuration === "LIFETIME"
      ? "Lifetime access"
      : accessDuration === "SUBSCRIPTION"
        ? "Subscription access"
        : Number.isFinite(accessDays) && accessDays > 0
          ? `${accessDays}-day access`
          : "Limited time access";
  return `${ENROLLMENT_SHORT[enrollment]} • ${access}`;
}

/** Info note shown next to the price input. */
export function priceInfoText({ priceType, price }: PriceValues): string {
  const amount = formatPrice(price);
  switch (priceType) {
    case "FREE":
      return "This course will be available for free. No payment will be required from students.";
    case "ONE_TIME":
      return `Students will pay ${amount} once to enroll and keep their access.`;
    case "SUBSCRIPTION":
      return `This course will be included in a subscription plan billed at ${amount}.`;
    case "BUNDLE":
      return `This course will be sold as part of a bundle priced at ${amount}.`;
  }
}
