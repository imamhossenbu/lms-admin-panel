export const formatCurrency = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatOrderDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

export const formatOrderTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

export const formatOrderDateTime = (iso: string) => `${formatOrderDate(iso)} ${formatOrderTime(iso)}`;
