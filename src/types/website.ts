/** Admin panel › Website — shapes of /admin/website (lms-ai-backend src/academy-site/admin). */

export interface WebsiteContent {
  hero: { title: string; subtitle: string } | null;
  mission: { why: string; what: string; how: string; imageUrl: string } | null;
  app: { title: string; text: string; appStoreUrl: string; playStoreUrl: string; screenshotUrl: string } | null;
  faqs: { question: string; answer: string }[];
  socials: { facebook: string; instagram: string; youtube: string; linkedin: string; tiktok: string };
  newsletter: { enabled: boolean; title: string; text: string };
  officeHours: string;
}

export interface WebsiteResponse {
  content: WebsiteContent;
  /** The academy site's public address (opens in a new tab). */
  siteUrl: string;
  updatedAt: string | null;
}

export type SubscriberStatus = "SUBSCRIBED" | "UNSUBSCRIBED";

export interface Subscriber {
  id: string;
  email: string;
  name: string;
  status: SubscriberStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriberPage {
  data: Subscriber[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
  stats: { total: number; subscribed: number; unsubscribed: number; last30Days: number };
}

export type MessageStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";
export type MessageTopic = "COURSE" | "ENROLLMENT" | "PAYMENT" | "TECHNICAL" | "OTHER";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: MessageTopic;
  message: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MessagePage {
  data: ContactMessage[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
  stats: { unread: number };
}
