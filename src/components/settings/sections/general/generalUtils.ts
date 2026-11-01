import type { GeneralSettings } from "@/validations/platformSettingsSchema";

/** Friendly audit labels for changed fields. */
export const GENERAL_LABELS: Partial<Record<keyof GeneralSettings, string>> = {
  platformName: "Platform name",
  tagline: "Tagline",
  websiteUrl: "Website URL",
  supportEmail: "Support email",
  supportPhone: "Support phone",
  address: "Address",
  timezone: "Timezone",
  dateFormat: "Date format",
  timeFormat: "Time format",
  currency: "Currency",
  weekStartsOn: "Week start",
};

export const TAGLINE_MAX = 120;
export const ADDRESS_MAX = 200;
export const PLATFORM_NAME_MAX = 60;

/** Common IANA zones (grouped west → east). */
export const COMMON_TIMEZONES = [
  "Pacific/Honolulu",
  "America/Anchorage",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Toronto",
  "America/Sao_Paulo",
  "Atlantic/Azores",
  "UTC",
  "Europe/London",
  "Europe/Lisbon",
  "Europe/Paris",
  "Europe/Berlin",
  "Africa/Lagos",
  "Africa/Cairo",
  "Europe/Istanbul",
  "Africa/Nairobi",
  "Europe/Moscow",
  "Asia/Riyadh",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Kathmandu",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Jakarta",
  "Asia/Singapore",
  "Asia/Kuala_Lumpur",
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Sydney",
  "Pacific/Auckland",
] as const;

export interface TimezoneOption {
  value: string;
  /** "Asia/Dhaka" → "Dhaka". */
  city: string;
  /** "Asia" */
  region: string;
  /** "UTC+06:00" */
  offset: string;
  /** Minutes east of UTC, for sorting. */
  offsetMinutes: number;
}

/** "GMT+5:30" → minutes. */
function offsetMinutesOf(tz: string, at: Date): number {
  try {
    const part = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" })
      .formatToParts(at)
      .find((p) => p.type === "timeZoneName")?.value;
    const m = part?.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
    if (!m) return 0;
    const mins = Number(m[2]) * 60 + Number(m[3] ?? 0);
    return m[1] === "-" ? -mins : mins;
  } catch {
    return 0;
  }
}

const fmtOffset = (mins: number) => {
  const sign = mins < 0 ? "−" : "+";
  const a = Math.abs(mins);
  return `UTC${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
};

/** Timezone options with live UTC offsets (DST-aware for today), sorted by offset. */
export function buildTimezoneOptions(current?: string, at: Date = new Date()): TimezoneOption[] {
  const zones: string[] = [...COMMON_TIMEZONES];
  if (current && !zones.includes(current)) zones.push(current);
  return zones
    .map((value) => {
      const offsetMinutes = offsetMinutesOf(value, at);
      const [region, ...rest] = value.split("/");
      return {
        value,
        region: rest.length ? region : "Universal",
        city: (rest.length ? rest[rest.length - 1] : value).replace(/_/g, " "),
        offset: fmtOffset(offsetMinutes),
        offsetMinutes,
      };
    })
    .sort((a, b) => a.offsetMinutes - b.offsetMinutes || a.city.localeCompare(b.city));
}

// ---------------------------------------------------------------- formatting

/** Date parts in the chosen timezone. */
function partsIn(date: Date, timeZone: string) {
  let tz = timeZone;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
  } catch {
    tz = "UTC";
  }
  const p = new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value ?? 0);
  return { y: get("year"), m: get("month"), d: get("day"), h: get("hour"), min: get("minute") };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");

export function formatDateAs(date: Date, format: GeneralSettings["dateFormat"], timeZone: string): string {
  const { y, m, d } = partsIn(date, timeZone);
  switch (format) {
    case "DD/MM/YYYY":
      return `${pad(d)}/${pad(m)}/${y}`;
    case "MM/DD/YYYY":
      return `${pad(m)}/${pad(d)}/${y}`;
    case "YYYY-MM-DD":
      return `${y}-${pad(m)}-${pad(d)}`;
    default:
      return `${MONTHS[m - 1]} ${d}, ${y}`;
  }
}

export function formatTimeAs(date: Date, format: GeneralSettings["timeFormat"], timeZone: string): string {
  const { h, min } = partsIn(date, timeZone);
  if (format === "24h") return `${pad(h)}:${pad(min)}`;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(min)} ${h < 12 ? "AM" : "PM"}`;
}

export const CURRENCIES: { value: GeneralSettings["currency"]; label: string; name: string; locale: string }[] = [
  { value: "USD", label: "USD — US Dollar ($)", name: "US Dollar", locale: "en-US" },
  { value: "BDT", label: "BDT — Bangladeshi Taka (৳)", name: "Bangladeshi Taka", locale: "en-BD" },
  { value: "EUR", label: "EUR — Euro (€)", name: "Euro", locale: "en-IE" },
  { value: "GBP", label: "GBP — British Pound (£)", name: "British Pound", locale: "en-GB" },
  { value: "INR", label: "INR — Indian Rupee (₹)", name: "Indian Rupee", locale: "en-IN" },
];

export function formatPrice(amount: number, currency: GeneralSettings["currency"]): string {
  const c = CURRENCIES.find((x) => x.value === currency);
  try {
    return new Intl.NumberFormat(c?.locale ?? "en-US", { style: "currency", currency, currencyDisplay: "narrowSymbol" }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export const DATE_FORMATS: GeneralSettings["dateFormat"][] = ["MMM D, YYYY", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];

export const WEEK_STARTS: { value: GeneralSettings["weekStartsOn"]; title: string }[] = [
  { value: "SATURDAY", title: "Saturday" },
  { value: "SUNDAY", title: "Sunday" },
  { value: "MONDAY", title: "Monday" },
];

/** Week-day initials starting from the chosen day (for the mini calendar strip). */
export function weekDays(start: GeneralSettings["weekStartsOn"]): string[] {
  const all = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const from = start === "SUNDAY" ? 0 : start === "MONDAY" ? 1 : 6;
  return Array.from({ length: 7 }, (_, i) => all[(from + i) % 7]);
}
