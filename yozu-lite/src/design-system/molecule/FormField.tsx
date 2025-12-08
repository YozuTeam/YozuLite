"use client";

import { NAV_THEME } from "@/theme/constant";
import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export type FormFieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  colors: typeof NAV_THEME.light;
};

export function FormField({
  label,
  required,
  hint,
  error,
  colors,
  children,
}: FormFieldProps) {
  const showHint = hint && !error;
  const showError = Boolean(error);

  return (
    <Stack spacing={0.5}>
      <Typography variant="body2" fontWeight={500}>
        {label}
        {required && (
          <Typography component="span" color="error" ml={0.5}>
            *
          </Typography>
        )}
      </Typography>

      {children}

      {showError && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}

      {showHint && (
        <Typography variant="caption" style={{ color: colors.mutedForeground }}>
          {hint}
        </Typography>
      )}
    </Stack>
  );
}
