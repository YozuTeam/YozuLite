"use client";

import { NAV_THEME } from "@/theme/constant";
import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";

// Taille logique de ton design system (tu peux en rajouter plus tard)
type FieldSize = "sm" | "md" | "lg";

// Type pour les couleurs, basé sur ton NAV_THEME (light / dark)
type ThemeColors = (typeof NAV_THEME)["light"] | (typeof NAV_THEME)["dark"];

export type TextFieldProps = {
  colors: ThemeColors;           // tes couleurs de thème (light/dark)
  size?: FieldSize;              // taille DS
  className?: string;
  sx?: SxProps<Theme>;           // pour override au besoin
} & Omit<MuiTextFieldProps, "size" | "variant" | "color">; // on contrôle size / variant / color

export function TextField({
  colors,
  size = "md",
  className,
  sx,
  ...rest
}: TextFieldProps) {
  // MUI n’a que "small" et "medium"
  const muiSize: MuiTextFieldProps["size"] =
    size === "sm" ? "small" : "medium";

  const baseSx: SxProps<Theme> = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: colors.input,
      color: colors.text,
      "& fieldset": {
        borderColor: colors.border,
      },
      "&:hover fieldset": {
        borderColor: colors.primary,
      },
      "&.Mui-focused fieldset": {
        borderColor: colors.primary,
      },
      "&.Mui-disabled": {
        opacity: 0.6,
      },
    },
    "& .MuiInputLabel-root": {
      color: colors.mutedForeground,
      "&.Mui-focused": {
        color: colors.primary,
      },
      "&.Mui-disabled": {
        color: colors.mutedForeground,
      },
    },
    "& .MuiFormHelperText-root": {
      color: colors.mutedForeground,
    },
    "& .MuiFormHelperText-root.Mui-error": {
      color: colors.notification,
    },
  };

  const mergedSx = { ...baseSx, ...sx };

  return (
    <MuiTextField
      variant="outlined"       // toujours OUTLINED par défaut
      size={muiSize}
      className={className}
      sx={mergedSx}
      {...rest}                // label, type, required, error, helperText, etc.
    />
  );
}
