"use client";

import { useState } from "react";
import { NAV_THEME, ThemeColors } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import TextField from "../atoms/TextField";
import { FormField } from "./FormField";

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
  const [hasError, setHasError] = useState(false);
  const errorText = "Adresse email invalide";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = (v: string) => {
  const trimmed = v.trim();

  if (trimmed.length === 0) {
    setHasError(false);
    return;
  }

  setHasError(!emailRegex.test(trimmed));
};

const handleBlur = () => {
  validate(value);
};
  
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newValue = e.target.value;
  setValue(newValue);
  onChange?.(newValue);

  if (hasError) setHasError(false);
};
   

  return (
    <FormField
      label={label}
      required={required}
      hint={hint}
      colors={colors}
    >
      <TextField
        type="email"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        colors={colors}
        size="medium"
        placeholder="email@exemple.com"
        error={hasError}
        errorText={errorText}
      />
    </FormField>
  );
}
