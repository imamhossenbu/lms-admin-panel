import React from "react";
import { cn } from "@/lib/cn";

export interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const PrimaryButton = React.forwardRef<
  HTMLButtonElement,
  PrimaryButtonProps
>(
  (
    {
      children,
      icon,
      leftIcon,
      rightIcon,
      variant = "primary",
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

    const variantStyles = {
      primary:
        "bg-brand-primary hover:bg-[#163e72] active:bg-[#0F2854] text-white shadow-sm border border-transparent",
      secondary:
        "bg-[#BDE8F5]/30 hover:bg-[#BDE8F5]/50 active:bg-[#BDE8F5]/70 text-brand-navy border border-brand-accent/30",
      outline:
        "bg-transparent hover:bg-slate-50 active:bg-slate-100 text-brand-navy border border-dash",
      ghost:
        "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-brand-navy border border-transparent",
    };

    const sizeStyles = {
      sm: "h-[32px] px-3 py-1.5 body-xsm-medium rounded-[6px] gap-1.5",
      md: "h-[40px] px-4 py-[10px] body-sm-medium rounded-[8px] gap-2",
      lg: "h-[48px] px-6 py-3 body-medium rounded-[10px] gap-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          effectiveLeftIcon
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";
