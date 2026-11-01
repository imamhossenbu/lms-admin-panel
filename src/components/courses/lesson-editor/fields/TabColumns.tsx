import React from "react";

export interface TabColumnsProps {
  /** Main cards (~2/3 width on wide screens). */
  main: React.ReactNode;
  /** Side cards (~1/3 width). */
  side: React.ReactNode;
}

/** Two-column tab body (main + side) that stacks on smaller screens. */
export function TabColumns({ main, side }: TabColumnsProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
      <div className="min-w-0 space-y-6 xl:col-span-2">{main}</div>
      <div className="min-w-0 space-y-6">{side}</div>
    </div>
  );
}

export default TabColumns;
