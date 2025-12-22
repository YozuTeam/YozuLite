"use client";

import TextField, { TextFieldProps } from "../atoms/TextField";
import { FormField } from "./FormField";

export interface TextAreaProps extends TextFieldProps {
  minRows?: number;
  maxRows?: number;
  label: string;
  required?: boolean;
}

export default function Textarea({
  minRows = 3,
  maxRows,
  label,
  required,
  ...rest
}: TextAreaProps) {
  return (
    <FormField
      label={label}
      required={required}
      colors={rest.colors}
    >
      <TextField
        {...rest}
        multiline
        minRows={minRows}
        {...(maxRows ? { maxRows } : {})}
      />
    </FormField>
  );
}
