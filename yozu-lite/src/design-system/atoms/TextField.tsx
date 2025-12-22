"use client";

import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";

export interface TextFieldColors {
  background: string;
  text: string;
  border: string;
  primary: string;
  mutedForeground: string;
  notification: string;
  muted: string;
}

export interface TextFieldProps
  extends Omit<MuiTextFieldProps, "size" | "color" | "variant"> {
  colors: TextFieldColors;
  size?: "small" | "medium";
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorText?: string;
}

export default function TextField({
  colors,
  size = "medium",  
  className,
  onChange,
  error = false,
  errorText = "Ce champ est obligatoire",
  ...rest
}: TextFieldProps) {


  const style = {
    backgroundColor: colors.background,
    colors: colors.text,
  };

  
  
  const sx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: colors.background,
      colors: colors.text,
      borderRadius: "15px",
      "& fieldset": {
        borderColor: colors.border,
        borderRadius: "15px",
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
    "& .MuiInputBase-root": {
      color: colors.text,
    },

    "& .MuiFormHelperText-root": {
      color: colors.mutedForeground,
    },

    "& .MuiFormHelperText-root.Mui-error": {
      color: colors.notification,
    },
  };

  
  return (
    <MuiTextField
      fullWidth
      variant="outlined"
      size={size}
      className={className}
      sx={sx}
      style={style}
      onChange={onChange}
      error={error}
      helperText={error ? errorText : rest.helperText}
      {...rest} 
  
    />
  );
}
