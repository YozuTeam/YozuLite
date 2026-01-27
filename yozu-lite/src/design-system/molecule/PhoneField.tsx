"use client";

import { useState } from "react";
import { NAV_THEME, ThemeColors } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import TextField from "../atoms/TextField";
import { FormField } from "./FormField";

export interface PhoneFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  colors?: ThemeColors;
  onChange?: (value: string) => void;
  value?: string;
}

export function PhoneField({
  label,
  required = false,
  hint,
  colors: overrideColors,
  onChange,
  value: controlledValue,
}: PhoneFieldProps) {
  const { colorScheme } = useColorTheme();
  const colors = overrideColors ?? NAV_THEME[colorScheme];

  const [internalValue, setInternalValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const errorText = "Numéro de téléphone invalide";

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

  const validate = (v: string) => {
    const trimmed = v.trim();

    if (trimmed.length === 0) {
      setHasError(false);
      return;
    }

    setHasError(!phoneRegex.test(trimmed));
  };

  const handleBlur = () => {
    validate(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);

    if (hasError) setHasError(false);
  };

  return (
    <FormField label={label} required={required} hint={hint} colors={colors}>
      <TextField
        type="tel"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        colors={colors}
        size="medium"
        placeholder="06 12 34 56 78"
        error={hasError}
        errorText={errorText}
      />
    </FormField>
  );
}
