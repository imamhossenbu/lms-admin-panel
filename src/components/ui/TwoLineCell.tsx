import React from "react";

export interface TwoLineCellProps {
  title: string;
  sub?: string;
}

export function TwoLineCell({ title, sub }: TwoLineCellProps) {
  return (
    <div className="min-w-0">
      <p
        className="body-sm-medium truncate text-primary-500"
        title={title}
      >
        {title}
      </p>
      {sub && (
        <p
          className="body-xsm-regular subtext-500 truncate mt-0.5"
          title={sub}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export default TwoLineCell;
