"use client";

import { useState } from "react";
import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import TextField from "../atoms/TextField";
import { FormField } from "./FormField";

type ThemeColors = (typeof NAV_THEME)["light"] | (typeof NAV_THEME)["dark"];

export interface EmailFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  colors?: ThemeColors;
  onChange?: (value: string) => void;
}

export function EmailField({
  label,
  required = false,
  hint,
  colors: overrideColors,
  onChange,
}: EmailFieldProps) {
  const { colorScheme } = useColorTheme();
  const colors = overrideColors ?? NAV_THEME[colorScheme];

  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  
    if (newValue.length > 0 && !emailRegex.test(newValue)) {
      setError("Adresse email invalide");
    } else {
      setError(null);
    }

    onChange?.(newValue);
  };

  return (
    <FormField
      label={label}
      required={required}
      hint={hint}
      error={error || undefined}
      colors={colors}
    >
      <TextField
        type="email"
        value={value}
        onChange={handleChange}
        colors={colors}
        size="medium"
        placeholder="email@exemple.com"
      />
    </FormField>
  );
}
