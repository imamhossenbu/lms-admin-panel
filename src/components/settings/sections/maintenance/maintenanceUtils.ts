import type { Tone } from "@/components/ui/ToneBadge";
import type { BackupEntry, SettingsStore } from "@/lib/settingsStorage";
import type { MaintenanceSettings, SettingsSection } from "@/validations/platformSettingsSchema";

export const MAINTENANCE_LABELS: Partial<Record<keyof MaintenanceSettings, string>> = {
  maintenanceMode: "Maintenance mode",
  maintenanceMessage: "Maintenance message",
  maintenanceUntil: "Expected back",
  allowAdminsDuringMaintenance: "Admin access during maintenance",
  autoBackup: "Automatic backups",
  backupFrequency: "Backup frequency",
  backupRetentionDays: "Backup retention",
};

export const MESSAGE_MAX = 200;

export const SECTION_META: Record<SettingsSection, { label: string; tone: Tone }> = {
  general: { label: "General", tone: "navy" },
  branding: { label: "Branding", tone: "purple" },
  learning: { label: "Learning", tone: "blue" },
  payments: { label: "Payments", tone: "green" },
  email: { label: "Email", tone: "orange" },
  security: { label: "Security", tone: "red" },
  integrations: { label: "Integrations", tone: "indigo" },
  maintenance: { label: "Maintenance", tone: "yellow" },
};

export const BACKUP_KIND_META: Record<BackupEntry["kind"], { label: string; tone: Tone }> = {
  AUTO: { label: "Auto", tone: "blue" },
  MANUAL: { label: "Manual", tone: "purple" },
};

export const BACKUP_STATUS_META: Record<BackupEntry["status"], { label: string; tone: Tone }> = {
  COMPLETED: { label: "Completed", tone: "green" },
  FAILED: { label: "Failed", tone: "red" },
};

export const formatSize = (mb: number) => (mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`);

/** "Sat, Nov 1 · 3:00 PM" — for the visitor banner. */
export function formatUntil(local: string) {
  if (!local) return "";
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

/** Earliest selectable datetime-local value (now, local time). */
export function nowLocalInput() {
  const d = new Date();
  d.setSeconds(0, 0);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

/** Next scheduled automatic backup (02:00 local, daily or next Monday). */
export function nextBackupLabel(frequency: MaintenanceSettings["backupFrequency"]) {
  const d = new Date();
  d.setHours(2, 0, 0, 0);
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
  if (frequency === "WEEKLY") while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
  return d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

/** Downloads the whole mock settings store as JSON (secrets are already masked in the store). */
export function downloadStoreJson(store: SettingsStore) {
  const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), ...store }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `edupro-settings-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
