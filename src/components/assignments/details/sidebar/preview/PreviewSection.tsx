import React from "react";

/** Titled block inside the student preview. */
export function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2.5">
      <h3 className="body-medium font-semibold! text-primary-500">{title}</h3>
      {children}
    </section>
  );
}

export default PreviewSection;
