"use client";

import { Typography } from "@mui/material";
import { TYPOGRAPHY } from "@/theme/typography";
import type { ReactNode } from "react";

export interface TextColor {
  text: string;
}

export type TextProps=  {
  children: ReactNode;
  variant?: keyof typeof TYPOGRAPHY;
  color?: TextColor;
};

export default function Text({
  children,
  color,
  ...rest
}: TextProps) {
  return (
    <Typography
      variant= "h1"
      sx={{ color: color?.text }}
      {...rest}
    >
      {children}
    </Typography>
  );
}
