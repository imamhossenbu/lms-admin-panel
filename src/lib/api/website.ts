import { apiClient } from "@/lib/api";
import type { ContactMessage, MessagePage, MessageStatus, Subscriber, SubscriberPage, SubscriberStatus, WebsiteResponse } from "@/types/website";
import type { WebsiteFormValues } from "@/validations/websiteSchema";

export interface WebsiteListQuery {
  q?: string;
  status?: string;
  page?: number;
  limit?: number;
}

const clean = (q: WebsiteListQuery) => Object.fromEntries(Object.entries(q).filter(([, v]) => v !== undefined && v !== "" && v !== "All"));

/** Admin panel › Website (Settings permission; the API scopes everything to this workspace). */
export const websiteApi = {
  get: async () => (await apiClient.get<WebsiteResponse>("/admin/website")).data,
  save: async (values: WebsiteFormValues) => (await apiClient.patch<WebsiteResponse>("/admin/website", values)).data,

  subscribers: async (q: WebsiteListQuery) => (await apiClient.get<SubscriberPage>("/admin/website/subscribers", { params: clean(q) })).data,
  setSubscriberStatus: async (id: string, status: SubscriberStatus) => (await apiClient.patch<Subscriber>(`/admin/website/subscribers/${encodeURIComponent(id)}`, { status })).data,
  removeSubscriber: async (id: string) => {
    await apiClient.delete(`/admin/website/subscribers/${encodeURIComponent(id)}`);
  },
  /** CSV of the matching subscribers (downloaded as a file by the caller). */
  exportSubscribers: async (q: WebsiteListQuery) => (await apiClient.get<Blob>("/admin/website/subscribers/export", { params: clean(q), responseType: "blob" })).data,

  messages: async (q: WebsiteListQuery) => (await apiClient.get<MessagePage>("/admin/website/messages", { params: clean(q) })).data,
  setMessageStatus: async (id: string, status: MessageStatus) => (await apiClient.patch<ContactMessage>(`/admin/website/messages/${encodeURIComponent(id)}`, { status })).data,
  removeMessage: async (id: string) => {
    await apiClient.delete(`/admin/website/messages/${encodeURIComponent(id)}`);
  },
};
