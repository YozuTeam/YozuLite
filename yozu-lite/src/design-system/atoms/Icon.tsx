"use client";

import { SvgIcon, type SvgIconProps } from "@mui/material";

export interface IconProps extends SvgIconProps {
  colors: IconColors;
  size?: number | string;
}

export interface IconColors {
  iconColor: string;
}

export function Icon({
  colors,
  size,
  sx,
  ...rest
}: IconProps) {
  return (
    <SvgIcon
      sx={{
        color: colors.iconColor,
        fontSize: size,
        ...sx,
      }}
      {...rest}
    />
  );
}
