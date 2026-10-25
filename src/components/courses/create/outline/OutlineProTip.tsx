import React from "react";
import { Lightbulb } from "lucide-react";

/** Purple "Pro Tip" reassurance box. */
export function OutlineProTip() {
  return (
    <aside className="flex items-start gap-3 rounded-xl border border-purple/30 bg-purple-14 p-4">
      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-purple" />
      <div>
        <p className="body-sm-medium text-purple">Pro Tip</p>
        <p className="mt-1 body-xsm-regular text-primary-400">
          You can always regenerate, edit or add more modules and lessons later. Nothing is final until you publish the
          course.
        </p>
      </div>
    </aside>
  );
}

export default OutlineProTip;
