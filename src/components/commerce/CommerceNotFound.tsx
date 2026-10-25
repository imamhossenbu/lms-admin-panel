import React from "react";
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export function CommerceNotFound({ entity, backHref, backLabel }: { entity: string; backHref: string; backLabel: string }) {
  return (
    <div className="bg-white rounded-xl border border-dash shadow-2xs p-10 flex flex-col items-center text-center gap-3">
      <span className="w-12 h-12 rounded-full bg-red-14 text-red flex items-center justify-center">
        <SearchX className="w-6 h-6" />
      </span>
      <h1 className="heading-h5 font-bold text-primary-500">{entity} not found</h1>
      <p className="body-sm-regular text-primary-300 max-w-sm">It may have been removed, or the link is incorrect.</p>
      <Link
        href={backHref}
        className="mt-2 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 body-sm-medium transition-colors shadow-2xs"
      >
        <ArrowLeft className="w-4 h-4 text-primary-400" />
        {backLabel}
      </Link>
    </div>
  );
}

export default CommerceNotFound;
