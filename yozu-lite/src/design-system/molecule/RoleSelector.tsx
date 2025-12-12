"use client";

import { Button } from "@/design-system/atoms/Button";
import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Stack } from "@mui/material";
import { FormField } from "./FormField";

type ThemeColors = (typeof NAV_THEME)["light"] | (typeof NAV_THEME)["dark"];

export type Role = "student" | "company";

export type RoleSelectorProps = {
  label: string;
  value: Role;
  onChange: (role: Role) => void;
  hint?: string;
  error?: string;
  colors?: ThemeColors;
};

export function RoleSelector({
  label,
  value,
  onChange,
  hint,
  error,
  colors: overrideColors,
}: RoleSelectorProps) {
  const { colorScheme } = useColorTheme();
  const colors = overrideColors ?? NAV_THEME[colorScheme];

  const isStudent = value === "student";
  const isCompany = value === "company";

  return (
    <FormField label={label} hint={hint} error={error} colors={colors}>
      <Stack direction="row" spacing={2}>
        <Button
          colors={{
            textColor: colors.primaryForeground,
            borderColor: colors.background,
            backgroundColor: isStudent ? colors.primary : colors.muted,
          }}
          onClick={() => onChange("student")}
        >
          Student
        </Button>
        <Button
          colors={{
            textColor: colors.primaryForeground,
            borderColor: colors.background,
            backgroundColor: isCompany ? colors.primary : colors.muted,
          }}
          onClick={() => onChange("company")}
        >
          Company
        </Button>
      </Stack>
    </FormField>
  );
}
