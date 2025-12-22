"use client";

import { Stack } from "@mui/material";
import type { ReactNode } from "react";
import { Text } from "@/design-system/atoms/Text";
import { TextFieldColors } from "../atoms/TextField";
import { useColorTheme } from "@/theme/useColorTheme";
import { NAV_THEME } from "@/theme/constant";

export type FormFieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  colors?: TextFieldColors;
  error?: boolean;
  errorText?: string;
};  

export function FormField({
  label,
  required,
  hint,
  colors: overrideColors,
  children,
  error,
  errorText,
}: FormFieldProps) {
  const { colorScheme } = useColorTheme();
  const colors = overrideColors ?? NAV_THEME[colorScheme];

  const showHint = hint;

  return (
    <Stack spacing={"8px"}>
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

      {showHint && (
        <Text variant="body2" colors={{ text: colors.mutedForeground }}>
          {hint}
        </Text>
      )}
      {error && (
        <Text variant="body2" colors={{ text: colors.notification }}>
          {errorText}
        </Text>
      )}
    </Stack>
  );
}
