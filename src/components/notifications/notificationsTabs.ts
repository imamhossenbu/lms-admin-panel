export type NotificationsTab = "inbox" | "broadcasts" | "templates";

export const NOTIFICATIONS_TABS: { id: NotificationsTab; label: string }[] = [
  { id: "inbox", label: "Inbox" },
  { id: "broadcasts", label: "Broadcasts" },
  { id: "templates", label: "Templates" },
];

export const parseNotificationsTab = (v: string): NotificationsTab => (v === "broadcasts" || v === "templates" ? v : "inbox");
