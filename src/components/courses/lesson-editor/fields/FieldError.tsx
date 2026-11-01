import React from "react";

/** Field-level validation message shown below an input. */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 body-xsm-regular text-red">{message}</p>;
}

export default FieldError;
