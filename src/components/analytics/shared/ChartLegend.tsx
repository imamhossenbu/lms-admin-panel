import React from "react";

export interface LegendItem {
  label: string;
  /** CSS colour (chartTheme CHART.* variable). */
  color: string;
  /** Render the swatch as a short line (line series). */
  line?: boolean;
}

/** Inline chart legend: coloured dot (or line) + label. */
export function ChartLegend({ items }: { items: LegendItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 whitespace-nowrap body-xsm-medium text-primary-400">
          <span
            className={item.line ? "h-0.5 w-3.5 rounded-full shrink-0" : "h-2.5 w-2.5 rounded-full shrink-0"}
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export default ChartLegend;
