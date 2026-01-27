"use client";

import { Button } from "@/design-system/atoms/Button";
import { FormField } from "@/design-system/molecule/FormField";
import { ThemeColors } from "@/theme/constant";
import { Stack } from "@mui/material";

export type SelectorOption<T extends string> = {
  value: T;
};

export type SelectorProps<T extends string> = {
  label: string;
  required?: boolean;
  options: SelectorOption<T>[];
  selectedValues: T[];
  setSelectedValues: (selectedValues: T[]) => void;
  colors: ThemeColors;
  multiple?: boolean;
  error?: boolean;
  errorText?: string;
  onFocus?: () => void;
};

export function Selector<T extends string>(props: SelectorProps<T>) {
  return (
    <FormField
      label={props.label}
      required={props.required}
      colors={props.colors}
      error={props.error}
      errorText="Veuillez sélectionner au moins une option"
    >
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {props.options.map((opt) => {
          const selected = props.selectedValues.includes(opt.value);

          return (
            <Button
              key={opt.value}
              onClick={() => {
                props.onFocus?.();
                const isMultiple = props.multiple !== false;
                if (isMultiple) {
                  props.setSelectedValues(
                    selected
                      ? props.selectedValues.filter((v) => v !== opt.value)
                      : [...props.selectedValues, opt.value],
                  );
                } else {
                  props.setSelectedValues(selected ? [] : [opt.value]);
                }
              }}
              colors={{
                textColor: selected
                  ? props.colors?.primaryForeground
                  : props.colors?.primary,
                borderColor: selected
                  ? props.colors?.border
                  : props.colors?.primary,
                backgroundColor: selected
                  ? props.colors?.primary
                  : props.colors?.background,
              }}
            >
              {opt.value}
            </Button>
          );
        })}
      </Stack>
    </FormField>
  );
}
