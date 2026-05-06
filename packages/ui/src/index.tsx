// Shared UI components for LWO platform

import React, { type ReactNode } from "react";

/**
 * Simple button component example
 */
export type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export function Button({ children, onClick, variant = "primary", disabled = false }: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded font-medium transition-colors";
  const variantStyles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${disabledStyles}`}
    >
      {children}
    </button>
  );
}
