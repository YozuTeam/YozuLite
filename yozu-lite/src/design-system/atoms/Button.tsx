"use client";

import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";

type ButtonSize = "sm" | "md" | "lg";
type ButtonIntent = "primary" | "secondary" | "ghost";

export type ButtonProps = {
  size?: ButtonSize;
  intent?: ButtonIntent;
  isLoading?: boolean;
  className?: string;
} & Omit<MuiButtonProps, "size" | "color" | "variant">;

export function Button({
  size = "md",
  intent = "primary",
  isLoading = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  // 1️⃣ Mapping taille → taille MUI
  const muiSize =
    size === "sm" ? "small" : size === "lg" ? "large" : "medium";

  // 2️⃣ Mapping intent → variant / color MUI
  const color = intent === "primary" ? "primary" : "inherit";
  const variant = intent === "ghost" ? "text" : "contained";

  // 3️⃣ Classes Tailwind pour la taille / look
  const sizeClasses =
    size === "sm"
      ? "px-3 py-1 text-sm"
      : size === "lg"
        ? "px-5 py-3 text-base"
        : "px-4 py-2 text-sm";

  const baseClasses =
    "rounded-xl font-medium normal-case transition-all";

  const combinedClassName = [
    baseClasses,
    sizeClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <MuiButton
      size={muiSize}
      variant={variant}
      color={color}
      disabled={disabled || isLoading}
      className={combinedClassName}
      {...rest}
    >
      {isLoading ? "Chargement..." : children}
    </MuiButton>
  );
}
