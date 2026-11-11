import React from "react";

/** Empty-table message: icon tile, title, one line. */
export function EmptyRow({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-light text-brand-orange">{icon}</span>
      <p className="mt-3 body-medium font-semibold text-primary-500">{title}</p>
      <p className="mt-1 max-w-sm body-sm-regular text-primary-300">{text}</p>
    </div>
  );
}

export default EmptyRow;
