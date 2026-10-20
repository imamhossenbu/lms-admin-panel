"use client";

import React from "react";
import Image from "next/image";

interface CategoryIconProps {
  icon?: string | null;
  className?: string;
  imgClassName?: string;
}

export function CategoryIcon({
  icon,
  className = "w-12 h-12 text-2xl",
  imgClassName = "object-contain p-1",
}: CategoryIconProps) {
  const isImageUrl = Boolean(
    icon &&
      (icon.startsWith("http://") ||
        icon.startsWith("https://") ||
        icon.startsWith("/") ||
        icon.includes("cloudinary.com") ||
        icon.includes("/avatars/") ||
        icon.includes("/upload/"))
  );

  if (isImageUrl) {
    return (
      <div
        className={`relative rounded-[10px] overflow-hidden bg-[#F8F9FA] border border-[#EDEDED] shrink-0 flex items-center justify-center ${className}`}
      >
        <Image
          src={icon!}
          alt="Category Icon"
          fill
          unoptimized
          className={imgClassName}
          sizes="48px"
        />
      </div>
    );
  }

  const displayEmoji = icon && icon.length <= 8 && !icon.includes("/") ? icon : "📚";

  return (
    <div
      className={`rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED] flex items-center justify-center shrink-0 select-none ${className}`}
    >
      <span>{displayEmoji}</span>
    </div>
  );
}

export default CategoryIcon;
