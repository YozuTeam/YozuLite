"use client";

import type { ReactNode } from "react";
import { Typography } from "@mui/material";

import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import type { TextVariant } from "@/theme/typography";

type ThemeColors = (typeof NAV_THEME)["light"];
export type TextColor = keyof ThemeColors;

export interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  className?: string;
}

export default function Text({
  children,
  variant = "body1",
  color = "text",
  className,
}: TextProps) {
  const { colorScheme } = useColorTheme();
  const themeColors = NAV_THEME[colorScheme];

  return (
    <Typography
      className={className}
      variant={variant}
      sx={{ color: themeColors[color] }}
    >
      {children}
    </Typography>
  );
}
