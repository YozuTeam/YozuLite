"use client";

import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";

export interface TextFieldColors {
  background: string;
  text: string;
  border: string;
  primary: string;
  mutedForeground: string;
  notification: string;
}

export interface TextFieldProps
  extends Omit<MuiTextFieldProps, "size" | "color" | "variant"> {
  colors: TextFieldColors;
  size?: "small" | "medium";
  className?: string;
}

export default function TextField({
  colors,
  size = "medium",  
  className,
  ...rest
}: TextFieldProps) {


  const style = {
    backgroundColor: colors.background,
    color: colors.text,
  };

  
  
  const sx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: colors.background,
      color: colors.text,
      "& fieldset": {
        borderColor: colors.border,
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

    "& .MuiFormHelperText-root": {
      color: colors.mutedForeground,
    },

    "& .MuiFormHelperText-root.Mui-error": {
      color: colors.notification,
    },
  };

  
  return (
    <MuiTextField
      variant="outlined"
      size={size}
      className={className}
      sx={sx}
      style={style}
      {...rest} 
  
    />
  );
}
