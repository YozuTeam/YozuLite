"use client";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";

import { FormField } from "./FormField";
import TextField, { TextFieldColors } from "../atoms/TextField"

export interface PasswordFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  colors: TextFieldColors; 
};

export function PasswordField({
  label,
  required,
  hint,
  error,
  value,
  onChange,
  placeholder = "Votre mot de passe",
  colors,
}: PasswordFieldProps) {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField label={label} required={required} hint={hint} error={error !== undefined} errorText={error} colors={colors}>
      <TextField
        colors={{
          ...colors,
          background: colors.background,
          text: colors.text,
          border: colors.border,
        }}
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
