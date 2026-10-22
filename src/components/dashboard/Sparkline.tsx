"use client";

import React from "react";

interface SparklineProps {
  data: number[];
  color: "orange" | "blue" | "green" | "purple";
  width?: number;
  height?: number;
}

const COLOR_MAP = {
  orange: {
    stroke: "#FF5B00",
    gradientId: "spark-orange",
    fillStop: "#FF5B00",
  },
  blue: {
    stroke: "#3B82F6",
    gradientId: "spark-blue",
    fillStop: "#3B82F6",
  },
  green: {
    stroke: "#22C55E",
    gradientId: "spark-green",
    fillStop: "#22C55E",
  },
  purple: {
    stroke: "#A855F7",
    gradientId: "spark-purple",
    fillStop: "#A855F7",
  },
};

export function Sparkline({
  data,
  color,
  width = 96,
  height = 36,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Generate points
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 6) + 3;
    const y = height - 4 - ((val - min) / range) * (height - 8);
    return { x, y };
  });

  // Build smooth bezier curve
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX = (curr.x + next.x) / 2;
    pathD += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  const palette = COLOR_MAP[color] || COLOR_MAP.orange;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={palette.gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.fillStop} stopOpacity="0.18" />
          <stop offset="100%" stopColor={palette.fillStop} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${palette.gradientId})`} />
      <path
        d={pathD}
        fill="none"
        stroke={palette.stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
