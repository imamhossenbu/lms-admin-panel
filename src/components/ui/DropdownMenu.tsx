"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface DropdownMenuProps {
  open: boolean;
  onClose: () => void;
  items: DropdownItem[];
  align?: "left" | "right";
  anchorEl?: HTMLElement | null;
}

const MENU_WIDTH = 192;
const GAP = 8;

export function DropdownMenu({
  open,
  onClose,
  items,
  align = "right",
  anchorEl,
}: DropdownMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (anchorEl?.contains(target)) return;
      if (ref.current && !ref.current.contains(target)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open, onClose, anchorEl]);

  useLayoutEffect(() => {
    if (!open || !anchorEl) return;
    const anchor = anchorEl.getBoundingClientRect();
    const menuHeight = ref.current?.offsetHeight ?? 0;
    const fitsBelow = anchor.bottom + GAP + menuHeight <= window.innerHeight;
    const top = fitsBelow ? anchor.bottom + GAP : anchor.top - GAP - menuHeight;
    const left = align === "right" ? anchor.right - MENU_WIDTH : anchor.left;
    setPosition((prev) =>
      prev?.top === top && prev.left === left ? prev : { top, left }
    );

    window.addEventListener("scroll", onClose, true);
    window.addEventListener("resize", onClose);
    return () => {
      window.removeEventListener("scroll", onClose, true);
      window.removeEventListener("resize", onClose);
    };
  }, [open, anchorEl, align, onClose]);

  if (!open) return null;

  const menu = (
    <div
      ref={ref}
      className={cn(
        "z-[100] rounded-[10px] border border-[#EDEDED] bg-white py-1.5 shadow-lg",
        anchorEl
          ? "fixed"
          : cn("absolute mt-2", align === "right" ? "right-0" : "left-0"),
        anchorEl && !position && "invisible"
      )}
      style={{
        width: MENU_WIDTH,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
        ...(anchorEl && position),
      }}
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => {
            item.onClick?.();
            onClose();
          }}
          className={cn(
            "flex w-full items-center gap-2 px-3.5 py-2 text-left body-sm-regular text-primary-500 transition-colors hover:bg-[#F8F9FA] cursor-pointer",
            item.className
          )}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );

  return anchorEl && typeof document !== "undefined"
    ? createPortal(menu, document.body)
    : menu;
}

export default DropdownMenu;
