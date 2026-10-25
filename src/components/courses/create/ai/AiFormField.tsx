import React from "react";

export interface AiFormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}

/** Label + control + helper text / field-level error for the AI form. */
export function AiFormField({ label, htmlFor, required, helper, error, children }: AiFormFieldProps) {
  return (
    <div className="w-full min-w-0">
      <label htmlFor={htmlFor} className="mb-2 block select-none body-sm-medium text-primary-500">
        {label}
        {required && <span className="ml-0.5 text-red">*</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 body-xsm-regular text-red">
          {error}
        </p>
      ) : (
        helper && <p className="mt-1.5 body-xsm-regular text-primary-300">{helper}</p>
      )}
    </div>
  );
}

export default AiFormField;
