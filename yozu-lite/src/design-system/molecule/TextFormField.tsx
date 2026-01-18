"use client";

import { FormField } from "./FormField";
import TextField from "../atoms/TextField";
import { TextFieldColors } from "../atoms/TextField";

interface TextFormFieldProps {
    label: string;
    colors: TextFieldColors;
    required?: boolean;
    error?: boolean;
    errorText?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export default function TextFormField({
    label,
    required,
    error = false,
    errorText = "Ce champ est obligatoire",
    colors,
    onChange,
    onFocus,
}: TextFormFieldProps) {
    return (
        <FormField label={label} required={required} error={error} colors={colors}>
        <TextField
            required={required}
            colors={colors}
            onChange={onChange}
            error={error}
            errorText={errorText}
            onFocus={onFocus}
        />
        </FormField>
    );
}