"use client";

import React from "react";
import { CardActionButton } from "@/components/ui/CardActionButton";

export interface CardHeaderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

/** Card header action ("Edit", "View All", "View Instructions") — the shared CardActionButton. */
export function CardHeaderButton(props: CardHeaderButtonProps) {
  return <CardActionButton {...props} />;
}

export default CardHeaderButton;
