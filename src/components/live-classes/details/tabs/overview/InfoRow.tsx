import React from "react";

export interface InfoRowProps {
  label: string;
  children: React.ReactNode;
}

/** One "label → value" line of the Class Information card. */
export function InfoRow({ label, children }: InfoRowProps) {
  return (
    <div className="grid grid-cols-5 items-start gap-3 py-2.5">
      <dt className="col-span-2 body-sm-regular text-primary-300">{label}</dt>
      <dd className="col-span-3 flex min-w-0 items-center gap-2 body-sm-medium text-primary-500">{children}</dd>
    </div>
  );
}

export default InfoRow;
