"use client";

import { Typography, SxProps, Theme } from "@mui/material";
import type { ReactNode } from "react";
import { TextVariant } from "@/theme/typography";

export interface TextColor {
  text: string;
}

export type TextProps = {
  children: ReactNode;
  colors?: TextColor;
  variant?: TextVariant;
  sx?: SxProps<Theme>;
};

export function Text({
  variant,
  children,
  colors,
  ...rest
}: TextProps) {
  return (
    <Typography
      component="span"
      variant={variant}
      color={colors?.text}
      {...rest}
    >
      {children}
    </Typography>
  );
}
