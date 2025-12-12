"use client";

import { SvgIcon, type SvgIconProps } from "@mui/material";

export interface IconProps extends SvgIconProps {
  colors: IconColors;
}

export interface IconColors {
  iconColor: string;
}

export function Icon({
  colors,
  ...rest
}: IconProps) {
  return (
    <SvgIcon
      sx={{
        color: colors.iconColor,
      }}
      {...rest}
    />
  );
}
