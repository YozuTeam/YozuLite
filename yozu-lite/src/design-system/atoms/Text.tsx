"use client";

import { Typography } from "@mui/material";
import { TYPOGRAPHY } from "@/theme/typography";
import type { ReactNode } from "react";

export interface TextColor {
  text: string;
}

export type TextProps=  {
  children: ReactNode;
  colors: TextColor;
  variant?: keyof typeof TYPOGRAPHY;
};

export default function Text({
  children,
  colors,
  ...rest
}: TextProps) {
  return (
    <Typography
      variant= "h1"
      sx={{ colors: colors.text }}
      {...rest}
    >
      {children}
    </Typography>
  );
}
