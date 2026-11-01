import React from "react";

type Token = { text: string; kind: "tag" | "text" | "attr" };

const LINES: Token[][] = [
  [{ text: "<!DOCTYPE html>", kind: "tag" }],
  [{ text: "<html>", kind: "tag" }],
  [{ text: "  <head>", kind: "tag" }],
  [{ text: "    <title>", kind: "tag" }, { text: "My Page", kind: "text" }, { text: "</title>", kind: "tag" }],
  [{ text: "  </head>", kind: "tag" }],
  [{ text: "  <body>", kind: "tag" }],
  [{ text: "    <h1>", kind: "tag" }, { text: "Welcome", kind: "text" }, { text: "</h1>", kind: "tag" }],
  [{ text: "    <p>", kind: "tag" }, { text: "This is a paragraph.", kind: "text" }, { text: "</p>", kind: "tag" }],
  [{ text: "    <a ", kind: "tag" }, { text: 'href="#"', kind: "attr" }, { text: ">", kind: "tag" }, { text: "Learn more", kind: "text" }, { text: "</a>", kind: "tag" }],
  [{ text: "  </body>", kind: "tag" }],
  [{ text: "</html>", kind: "tag" }],
];

const KIND_CLASS: Record<Token["kind"], string> = {
  tag: "text-brand-orange",
  text: "text-white",
  attr: "text-green",
};

/** Static "code vs rendered page" illustration (no images) for the Submission Preview card. */
export function CodePreviewIllustration() {
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-dash sm:grid-cols-2" aria-hidden>
      <pre className="overflow-x-auto bg-primary-500 p-3 body-2xsm-regular">
        {LINES.map((tokens, i) => (
          <div key={i} className="flex gap-3 whitespace-pre">
            <span className="w-4 shrink-0 text-right text-primary-300">{i + 1}</span>
            <span>
              {tokens.map((t, j) => (
                <span key={j} className={KIND_CLASS[t.kind]}>
                  {t.text}
                </span>
              ))}
            </span>
          </div>
        ))}
      </pre>
      <div className="flex flex-col bg-white">
        <div className="flex items-center gap-1 border-b border-dash bg-gray-bg px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-red" />
          <span className="h-1.5 w-1.5 rounded-full bg-yellow" />
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
        </div>
        <div className="space-y-2 p-4">
          <p className="heading-h5 font-bold! text-primary-500">Welcome</p>
          <p className="body-sm-regular text-primary-400">This is a paragraph.</p>
          <p className="body-sm-medium text-blue underline">Learn more</p>
        </div>
      </div>
    </div>
  );
}

export default CodePreviewIllustration;
