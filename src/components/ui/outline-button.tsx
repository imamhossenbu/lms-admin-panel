"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export interface OutlineButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const OutlineButton = React.forwardRef<
  HTMLButtonElement,
  OutlineButtonProps
>(
  (
    {
      children,
      icon,
      leftIcon,
      rightIcon,
      size = "md",
      fullWidth = false,
      isLoading = false,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const effectiveLeftIcon = leftIcon || icon;

    // Unified Button Heights: Default md is 40px
    const sizeStyles: Record<string, string> = {
      sm: "h-[34px] px-3 py-1.5 body-xsm-medium rounded-[8px] gap-1.5",
      md: "h-[40px] px-4 py-[10px] body-sm-medium rounded-[8px] gap-2",
      lg: "h-[44px] px-5 py-2.5 body-medium rounded-[10px] gap-2.5",
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
        transition={{ duration: 0.12 }}
        className={`
          inline-flex items-center justify-center whitespace-nowrap
          bg-white text-brand-orange border border-brand-orange/40
          hover:bg-brand-orange-light hover:border-brand-orange active:bg-brand-orange-soft
          shadow-2xs
          transition-colors duration-150 select-none
          cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
          focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/30 focus-visible:ring-offset-2
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : "w-auto min-w-fit"}
          ${className}
        `}
        {...props}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <svg
            className="animate-spin w-4 h-4 shrink-0 text-brand-orange"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Left Icon (18px x 18px) */}
        {!isLoading && effectiveLeftIcon && (
          <span className="w-[18px] h-[18px] flex items-center justify-center shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px]">
            {effectiveLeftIcon}
          </span>
        )}

        {/* Button Text */}
        {children && <span>{children}</span>}

        {/* Right Icon (18px x 18px) */}
        {!isLoading && rightIcon && (
          <span className="w-[18px] h-[18px] flex items-center justify-center shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px]">
            {rightIcon}
          </span>
        )}
      </motion.button>
    );
  }
);

OutlineButton.displayName = "OutlineButton";
export default OutlineButton;
