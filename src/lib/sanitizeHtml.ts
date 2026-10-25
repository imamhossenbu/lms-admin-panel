const ALLOWED_TAGS = new Set([
  "P", "BR", "STRONG", "B", "EM", "I", "U", "S", "UL", "OL", "LI",
  "A", "H1", "H2", "H3", "BLOCKQUOTE", "CODE", "PRE", "HR",
]);

const SAFE_HREF = /^(https?:|mailto:)/i;

/**
 * Allowlist sanitizer for rich-text editor output. Unknown elements are unwrapped
 * (their text is kept), every attribute is dropped except a safe `href` on links.
 * Must run in the browser (uses DOMParser); returns "" on the server.
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") return "";
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");

  const clean = (node: Element) => {
    Array.from(node.children).forEach((child) => {
      clean(child);
      if (!ALLOWED_TAGS.has(child.tagName)) {
        if (["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED"].includes(child.tagName)) {
          child.remove();
        } else {
          child.replaceWith(...Array.from(child.childNodes));
        }
        return;
      }
      const href = child.getAttribute("href");
      Array.from(child.attributes).forEach((attr) => child.removeAttribute(attr.name));
      if (child.tagName === "A" && href && SAFE_HREF.test(href.trim())) {
        child.setAttribute("href", href.trim());
        child.setAttribute("target", "_blank");
        child.setAttribute("rel", "noopener noreferrer");
      }
    });
  };

  clean(doc.body);
  return doc.body.innerHTML;
}

/** Plain-text version of rich-text HTML (for search and previews). */
export function htmlToText(html: string): string {
  return html
    .replace(/<(br|\/p|\/li|\/h[1-3])>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}
