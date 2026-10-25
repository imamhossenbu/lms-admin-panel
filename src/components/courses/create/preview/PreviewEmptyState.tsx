import React from "react";

interface PreviewEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function PreviewEmptyState({ icon, title, description }: PreviewEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-2 py-8 px-4">
      <span className="w-11 h-11 rounded-full bg-gray-bg text-primary-300 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
        {icon}
      </span>
      <p className="body-sm-medium font-semibold text-primary-500">{title}</p>
      <p className="body-xsm-regular text-primary-300 max-w-64">{description}</p>
    </div>
  );
}

export default PreviewEmptyState;
