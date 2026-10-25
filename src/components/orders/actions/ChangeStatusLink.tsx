import React from "react";
import { RefreshCw } from "lucide-react";

/** Small inline "Change" link shown next to a status badge in the order/payment drawers. */
export const ChangeStatusLink = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1 body-xsm-medium text-blue hover:underline cursor-pointer whitespace-nowrap"
  >
    <RefreshCw className="w-3.5 h-3.5" />
    Change
  </button>
);

export default ChangeStatusLink;
