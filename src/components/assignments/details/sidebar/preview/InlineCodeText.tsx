import React from "react";

/** Renders text where `backtick` segments become inline code chips. */
export function InlineCodeText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
          <code key={i} className="rounded bg-slate-100 px-1.5 py-0.5 body-xsm-medium text-red-dark">
            {part.slice(1, -1)}
          </code>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export default InlineCodeText;
