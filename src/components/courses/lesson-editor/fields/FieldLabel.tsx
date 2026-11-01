import React from "react";

export interface EditorFieldLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}

/** Label used above Edit Lesson inputs ("Lesson Title *"). */
export function EditorFieldLabel({ htmlFor, children, required }: EditorFieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block body-sm-medium text-primary-500 select-none">
      {children}
      {required && <span className="ml-0.5 text-red">*</span>}
    </label>
  );
}

export default EditorFieldLabel;
