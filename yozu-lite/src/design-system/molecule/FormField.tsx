"use client";

import { Stack } from "@mui/material";
import type { ReactNode } from "react";
import Text from "@/design-system/atoms/Text";
import { TextFieldColors } from "../atoms/TextField";
import { useColorTheme } from "@/theme/useColorTheme";
import { NAV_THEME } from "@/theme/constant";

export type FormFieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  colors?: TextFieldColors;
};  

export function FormField({
  label,
  required,
  hint,
  error,
  colors: overrideColors,
  children,
}: FormFieldProps) {
  const { colorScheme } = useColorTheme();
  const colors = overrideColors ?? NAV_THEME[colorScheme];

  const showHint = hint && !error;
  const showError = Boolean(error);

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={0.5}>
        <Text variant="body2" colors={{ text: colors.text }}>
          {label}
        </Text>
        {required && (
          <Text variant="body2" colors={{ text: colors.notification }}>
            *
          </Text>
        )}
      </Stack>

      {children}

      {showError && (
        <Text variant="body2" colors={{ text: colors.notification }}>
          {error}
        </Text>
      )}

      {showHint && (
        <Text variant="body2" colors={{ text: colors.mutedForeground }}>
          {hint}
        </Text>
      )}
    </Stack>
  );
}
