import { z } from "zod";
import type { WebsiteContent } from "@/types/website";

/** "" (not set) or a full https:// link — mirrors the API's rule. */
const httpsUrl = z
  .string()
  .trim()
  .max(500, "Link is too long")
  .refine((v) => v === "" || /^https:\/\/[^\s"'<>]+$/i.test(v), "Use a full https:// link (or leave it empty)");

export const WEBSITE_LIMITS = { heroTitle: 80, heroSubtitle: 240, mission: 600, appTitle: 80, appText: 300, question: 200, answer: 1200, newsTitle: 80, newsText: 240, officeHours: 120, faqs: 20 } as const;

export const websiteSchema = z.object({
  hero: z.object({
    title: z.string().trim().max(WEBSITE_LIMITS.heroTitle, `Keep the headline under ${WEBSITE_LIMITS.heroTitle} characters`),
    subtitle: z.string().trim().max(WEBSITE_LIMITS.heroSubtitle, `Keep the sub-headline under ${WEBSITE_LIMITS.heroSubtitle} characters`),
  }),
  mission: z.object({
    why: z.string().trim().max(WEBSITE_LIMITS.mission, `Keep it under ${WEBSITE_LIMITS.mission} characters`),
    what: z.string().trim().max(WEBSITE_LIMITS.mission, `Keep it under ${WEBSITE_LIMITS.mission} characters`),
    how: z.string().trim().max(WEBSITE_LIMITS.mission, `Keep it under ${WEBSITE_LIMITS.mission} characters`),
    imageUrl: httpsUrl,
  }),
  app: z
    .object({
      title: z.string().trim().max(WEBSITE_LIMITS.appTitle, "Title is too long"),
      text: z.string().trim().max(WEBSITE_LIMITS.appText, "Text is too long"),
      appStoreUrl: httpsUrl,
      playStoreUrl: httpsUrl,
      screenshotUrl: httpsUrl,
    })
    .refine((a) => !(a.title || a.text || a.screenshotUrl) || !!(a.appStoreUrl || a.playStoreUrl), { message: "Add an App Store or Google Play link to show the app section", path: ["playStoreUrl"] }),
  faqs: z
    .array(
      z.object({
        question: z.string().trim().min(3, "Write the question").max(WEBSITE_LIMITS.question, `Keep the question under ${WEBSITE_LIMITS.question} characters`),
        answer: z.string().trim().min(3, "Write the answer").max(WEBSITE_LIMITS.answer, `Keep the answer under ${WEBSITE_LIMITS.answer.toLocaleString("en-US")} characters`),
      }),
    )
    .max(WEBSITE_LIMITS.faqs, `You can add up to ${WEBSITE_LIMITS.faqs} questions`),
  socials: z.object({ facebook: httpsUrl, instagram: httpsUrl, youtube: httpsUrl, linkedin: httpsUrl, tiktok: httpsUrl }),
  newsletter: z.object({
    enabled: z.boolean(),
    title: z.string().trim().max(WEBSITE_LIMITS.newsTitle, "Title is too long"),
    text: z.string().trim().max(WEBSITE_LIMITS.newsText, "Text is too long"),
  }),
  officeHours: z.string().trim().max(WEBSITE_LIMITS.officeHours, `Keep it under ${WEBSITE_LIMITS.officeHours} characters`),
});

export type WebsiteFormValues = z.infer<typeof websiteSchema>;

/** API content (nullable blocks) → form values (every field present). */
export function toWebsiteForm(c: WebsiteContent): WebsiteFormValues {
  return {
    hero: c.hero ?? { title: "", subtitle: "" },
    mission: c.mission ?? { why: "", what: "", how: "", imageUrl: "" },
    app: c.app ?? { title: "", text: "", appStoreUrl: "", playStoreUrl: "", screenshotUrl: "" },
    faqs: c.faqs,
    socials: c.socials,
    newsletter: c.newsletter,
    officeHours: c.officeHours,
  };
}
