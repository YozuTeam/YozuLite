"use client";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";

import { TextField } from "@/design-system/atoms/TextField";
import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { FormField } from "./FormField";

type ThemeColors = (typeof NAV_THEME)["light"] | (typeof NAV_THEME)["dark"];

export type PasswordFieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  colors?: ThemeColors; // optionnel, on va le récupérer via le hook si pas fourni
};

export function PasswordField({
  label,
  required,
  hint,
  error,
  value,
  onChange,
  placeholder = "Votre mot de passe",
  colors: overrideColors,
}: PasswordFieldProps) {
  const { colorScheme } = useColorTheme();
  const colors = overrideColors ?? NAV_THEME[colorScheme];

  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField label={label} required={required} hint={hint} error={error} colors={colors}>
      <TextField
        colors={colors}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((s) => !s)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </FormField>
  );
}
