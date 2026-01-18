"use client";

import { Box } from "@mui/material";
import { ReactNode, FormEvent } from "react";

const padding = {
  xs: 2,
  sm: 5,
};
const borderRadius = "15px";
const border = "1px solid";

export interface CardColors {
  background: string;
  border: string;
}

type CardProps = {
  children: ReactNode;
  colors: CardColors;
  onSubmit?: (e: FormEvent) => void;
};

export default function Card({ colors, children, onSubmit }: CardProps) {
  return (
    <Box
      component={onSubmit ? "form" : "div"}
      onSubmit={onSubmit}
      sx={{
        backgroundColor: colors.background,
        borderRadius,
        padding,
        border: `${border} ${colors.border}`,
        boxShadow: 0,
      }}
    >
      {children}
    </Box>
  );
}
