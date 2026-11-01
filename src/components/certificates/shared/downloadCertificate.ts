import type { CertificateAccent, IssuedCertificate } from "@/types/certificate";
import { recordDownload } from "@/lib/certificateStorage";
import { certificateStatus, formatCertDate, renderCertificateText, verifyUrl } from "@/lib/certificateStats";
import type { CertificateRenderTemplate } from "./certificateRenderTypes";
import { QR_SIZE, qrMatrix } from "./certificateQr";

/**
 * Client-side "Download PDF" without extra dependencies: opens a print-ready window with a standalone
 * certificate document and calls print() (the browser's "Save as PDF"). The inline CSS below lives ONLY
 * inside that generated print document (same approach as orders/actions/orderInvoice.ts).
 */

export interface CertificateDownloadInput {
  certificate: IssuedCertificate;
  template: CertificateRenderTemplate;
  courseTitle: string;
}

const escape = (value: string) => value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

/** Print-document palette (mirrors the globals.css accent tokens). */
const PRINT_ACCENT: Record<CertificateAccent, { main: string; soft: string }> = {
  orange: { main: "#FF5B00", soft: "#FFF4ED" },
  blue: { main: "#2570FC", soft: "#EAF1FF" },
  green: { main: "#0DC34A", soft: "#E6FFEE" },
  purple: { main: "#C218FB", soft: "#F9E8FF" },
  navy: { main: "#0B101B", soft: "#F1F5F9" },
};

function qrHtml(code: string) {
  const cells = qrMatrix(code)
    .map((on) => `<i style="background:${on ? "#0F172A" : "#FFFFFF"}"></i>`)
    .join("");
  return `<div class="qr"><div class="qr-grid">${cells}</div><span>${escape(code)}</span></div>`;
}

function signersHtml(signers: CertificateRenderTemplate["signers"]) {
  return signers
    .map(
      (s) => `<div class="signer">${
        s.signatureUrl ? `<img src="${escape(s.signatureUrl)}" alt="">` : `<div class="sig">${escape(s.name)}</div>`
      }<div class="line"></div><strong>${escape(s.name)}</strong><span>${escape(s.title)}</span></div>`
    )
    .join("");
}

/** Standalone, printable HTML certificate (A4, template orientation). */
export function buildCertificateHtml({ certificate, template, courseTitle }: CertificateDownloadInput): string {
  const accent = PRINT_ACCENT[template.accent] ?? PRINT_ACCENT.orange;
  const portrait = template.orientation === "PORTRAIT";
  const data = {
    studentName: certificate.recipient.name,
    courseTitle,
    completionDate: formatCertDate(certificate.completedAt),
    grade: certificate.grade,
    instructorName: template.signers[0]?.name ?? "EduPro",
    certificateId: certificate.code,
  };
  const body = escape(renderCertificateText(template.bodyText, data));
  const status = certificateStatus(certificate);
  const watermark = status === "VALID" ? "" : `<div class="watermark">${status === "REVOKED" ? "REVOKED" : "EXPIRED"}</div>`;
  const logo = template.showLogo ? `<div class="logo">Edu<b>Pro</b></div>` : "";
  const grade = template.showGrade ? `<div class="grade">Grade ${certificate.grade === null ? "—" : `${certificate.grade}%`}</div>` : "";
  const qr = template.showQr ? qrHtml(certificate.code) : "";
  const seal = `<div class="seal"><div>★</div></div>`;
  const name = escape(data.studentName);
  const heading = escape(template.heading);
  const date = escape(data.completionDate);

  let sheet: string;
  if (template.layout === "MODERN") {
    sheet = `<div class="sheet modern"><aside>${logo}${seal}${portrait ? "" : qr}</aside><main>
      <p class="eyebrow accent">Official certificate</p><h1>${heading}</h1>
      <div><p class="eyebrow">Presented to</p><h2>${name}</h2><div class="rule"></div><p class="body">${body}</p>${grade}</div>
      <footer><div class="signers">${signersHtml(template.signers)}</div><div class="meta"><span>Completed</span><strong>${date}</strong>${portrait ? qr : ""}</div></footer>
    </main>${watermark}</div>`;
  } else if (template.layout === "MINIMAL") {
    sheet = `<div class="sheet minimal"><main>
      <div class="center">${logo}<div class="rule"></div><p class="eyebrow accent">${heading}</p></div>
      <div class="center"><h2>${name}</h2><div class="thin"></div><p class="body muted">${body}</p>${grade}</div>
      <footer><div class="signers">${signersHtml(template.signers)}</div><div class="meta"><strong>${date}</strong>${qr}</div></footer>
    </main>${watermark}</div>`;
  } else {
    sheet = `<div class="sheet classic"><div class="inner">${template.showQr ? `<div class="qr-corner">${qr}</div>` : ""}
      <div class="center">${logo}<h1 class="accent upper">${heading}</h1><div class="flourish"><i></i><b></b><i></i></div></div>
      <div class="center"><p class="eyebrow upper">Proudly presented to</p><h2>${name}</h2><div class="rule"></div><p class="body">${body}</p>${grade}</div>
      <footer class="tri"><div class="signers">${signersHtml(template.signers.filter((_, i) => i % 2 === 0))}</div><div class="center">${seal}<span class="muted">${date}</span></div><div class="signers right">${signersHtml(template.signers.filter((_, i) => i % 2 === 1))}</div></footer>
    </div>${watermark}</div>`;
  }

  const w = portrait ? "210mm" : "297mm";
  const h = portrait ? "297mm" : "210mm";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${escape(certificate.code)} — ${name}</title>
<style>
  @page{size:A4 ${portrait ? "portrait" : "landscape"};margin:0}
  *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  body{margin:0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0F172A;background:#F1F5F9}
  .sheet{position:relative;width:${w};height:${h};margin:0 auto;background:#FFFFFF;overflow:hidden}
  h1{margin:0;font-size:26px;letter-spacing:.06em}h2{margin:6px 0;font-size:44px;font-weight:700}
  p{margin:0}.accent{color:${accent.main}}.upper{text-transform:uppercase}.muted{color:#64748B}
  .eyebrow{font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#64748B}
  .body{max-width:560px;margin:10px auto 0;font-size:16px;line-height:1.6;color:#334155}
  .rule{width:90px;height:3px;border-radius:3px;background:${accent.main};margin:10px auto}
  .center{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px}
  .logo{font-size:24px;font-weight:800;color:#0F172A}.logo b{color:#FF5B00}
  .grade{display:inline-block;margin-top:10px;padding:4px 12px;border-radius:999px;font-size:13px;font-weight:600;color:${accent.main};background:${accent.soft}}
  .seal{width:72px;height:72px;border-radius:50%;border:2px dashed ${accent.main};padding:3px}
  .seal div{width:100%;height:100%;border-radius:50%;background:${accent.main};color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:30px}
  .signers{display:flex;gap:28px}.signer{width:180px;display:flex;flex-direction:column;font-size:12px;color:#64748B}
  .signer .sig{font-family:Georgia,serif;font-style:italic;font-size:22px;color:#0F172A}.signer img{height:40px;object-fit:contain}
  .signer .line{border-top:1px solid #64748B;margin:4px 0}.signer strong{font-size:14px;color:#0F172A}
  .qr{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px;color:#64748B}
  .qr-grid{display:grid;grid-template-columns:repeat(${QR_SIZE},1fr);gap:1px;width:80px;padding:3px;background:#FFFFFF;border:1px solid #E2E8F0}
  .qr-grid i{display:block;aspect-ratio:1}
  footer{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;width:100%}
  .meta{display:flex;align-items:flex-end;gap:16px;font-size:12px;color:#64748B}.meta strong{color:#0F172A}
  .classic{border:10px double ${accent.main};padding:12px}
  .classic .inner{position:relative;height:100%;border:1px solid ${accent.main}55;padding:48px 64px;display:flex;flex-direction:column;justify-content:space-between;align-items:center;text-align:center}
  .classic .signer{align-items:center;text-align:center}.classic .qr-corner{position:absolute;top:18px;right:18px}
  .tri{display:grid;grid-template-columns:1fr auto 1fr}.signers.right{justify-content:flex-end}
  .flourish{display:flex;align-items:center;gap:8px}.flourish i{width:60px;height:1px;background:${accent.main}}.flourish b{width:8px;height:8px;transform:rotate(45deg);background:${accent.main}}
  .modern{display:flex;flex-direction:${portrait ? "column" : "row"}}
  .modern aside{background:${accent.main};${portrait ? "height:16%;padding:0 40px;flex-direction:row" : "width:25%;padding:40px 24px;flex-direction:column"};display:flex;align-items:center;justify-content:space-between}
  .modern aside .logo{background:#FFFFFF;padding:8px 12px;border-radius:10px}.modern aside .seal{border-color:#FFFFFF}.modern aside .seal div{background:#FFFFFF;color:${accent.main}}
  .modern aside .qr{color:#FFFFFF}
  .modern main{flex:1;padding:56px;display:flex;flex-direction:column;justify-content:space-between}
  .modern .rule{margin:10px 0}.modern .body{margin:10px 0 0}.modern h1{font-size:30px;letter-spacing:0}
  .minimal{border:1px solid #E2E8F0;padding:16px}.minimal main{height:100%;padding:72px 96px;display:flex;flex-direction:column;justify-content:space-between}
  .minimal .rule{height:2px;width:56px}.minimal .thin{width:33%;height:1px;background:#E2E8F0;margin:6px auto}
  .watermark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:120px;font-weight:800;color:#DF1C41;opacity:.12;transform:rotate(-24deg);pointer-events:none}
  @media print{body{background:#FFFFFF}}
</style></head><body>${sheet}</body></html>`;
}

/**
 * Opens the print dialog for the certificate (choose "Save as PDF") and counts the download.
 * Throws a friendly Error when the browser blocks the pop-up.
 */
export async function downloadCertificatePdf(input: CertificateDownloadInput): Promise<void> {
  if (typeof window === "undefined") throw new Error("Downloads are only available in the browser.");
  const win = window.open("", "_blank", "width=1180,height=860");
  if (!win) throw new Error("Your browser blocked the download window. Allow pop-ups for this site and try again.");
  win.document.open();
  win.document.write(buildCertificateHtml(input));
  win.document.close();
  win.document.title = `${input.certificate.code}`;
  const print = () => {
    win.focus();
    win.print();
  };
  if (win.document.readyState === "complete") setTimeout(print, 250);
  else win.addEventListener("load", () => setTimeout(print, 100), { once: true });
  await recordDownload(input.certificate.id);
}

/** Public verification link for a certificate (re-exported for convenience). */
export const certificateVerifyUrl = (c: Pick<IssuedCertificate, "code">) => verifyUrl(c.code);

export default downloadCertificatePdf;
