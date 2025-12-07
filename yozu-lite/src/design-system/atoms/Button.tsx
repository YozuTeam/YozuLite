"use client";

import { NAV_THEME } from "@/theme/constant";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";

type ButtonSize = "sm" | "md" | "lg";
export type ThemeColor = keyof typeof NAV_THEME.light;

export type ButtonProps = {
  colors: typeof NAV_THEME.light;
  size?: ButtonSize;
  themeColor?: ThemeColor;
  isLoading?: boolean;
  className?: string;
} & Omit<MuiButtonProps, "size" | "color" | "variant">;

export function Button({
  colors,
  size = "md",
  themeColor = "primary",
  isLoading = false,
  className,
  children,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const muiSize = size === "sm" ? "small" : size === "lg" ? "large" : "medium";

  const sizeClasses =
    size === "sm"
      ? "px-3 py-1 text-sm"
      : size === "lg"
        ? "px-5 py-3 text-base"
        : "px-4 py-2 text-sm";

  const baseClasses = "rounded-xl font-medium normal-case transition-all";

  const backgroundColor = colors[themeColor];

  let color = colors.primaryForeground;

  const foregroundKey = `${themeColor}Foreground` as keyof typeof colors;

  if (colors[foregroundKey]) {
    color = colors[foregroundKey];
  } else if (themeColor === "buttonsPrimary") {
    color = colors.primaryForeground;
  } else if (themeColor === "buttonsSecondary") {
    color = colors.secondaryForeground;
  } else if (themeColor === "background" || themeColor === "card") {
    color = colors.text;
  }

  const dynamicStyle = {
    backgroundColor,
    color,
    ...style,
  };

  const combinedClassName = [baseClasses, sizeClasses, className]
    .filter(Boolean)
    .join(" ");

  return (
    <MuiButton
      size={muiSize}
      disabled={disabled || isLoading}
      className={combinedClassName}
      style={dynamicStyle}
      {...rest}
    >
      {isLoading ? "Chargement..." : children}
    </MuiButton>
  );
}
