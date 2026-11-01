import React from "react";
import { Info } from "lucide-react";

const TIPS = [
  "Use a clear and descriptive title with your main keyword.",
  "Write a concise and engaging meta description.",
  "Keep your URL short and keyword-rich.",
  "Add relevant keywords.",
  "Make sure your lesson content is high quality and valuable.",
];

/** Blue "Tips for Better SEO" box. */
export function SeoTipsCard() {
  return (
    <aside className="flex items-start gap-3 rounded-xl border border-blue/20 bg-blue-14 p-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue text-white">
        <Info className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="body-sm-medium font-semibold! text-primary-500">Tips for Better SEO</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4 body-xsm-regular text-primary-400">
          {TIPS.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

export default SeoTipsCard;
