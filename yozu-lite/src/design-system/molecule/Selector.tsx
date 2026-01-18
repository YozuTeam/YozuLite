"use client";

import { Button } from "@/design-system/atoms/Button";
import { FormField } from "@/design-system/molecule/FormField";
import { NAV_THEME, ThemeColors } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Stack } from "@mui/material";

export type SelectorOption = {
  value: string;
};

export type SelectorProps = {
  label: string;
  required?: boolean;
  options: SelectorOption[];
  selectedValues: string[];
  setSelectedValues: (selectedValues: string[]) => void;
  colors?: ThemeColors;
  multiple?: boolean;
  error?: boolean;
  errorText?: string;
  onFocus?: () => void;
};

export function Selector(props: SelectorProps) {
  const { colorScheme } = useColorTheme();
  const colors = NAV_THEME[colorScheme];

  

  return (
    <FormField
      label={props.label}
      required={props.required}
      colors={colors}
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
                      : [...props.selectedValues, opt.value]
                  );
                } else {
                  props.setSelectedValues(selected ? [] : [opt.value]);
                }
              }}
              colors={{
                textColor: selected ? colors.primaryForeground : colors.primary,
                borderColor: selected ? colors.border : colors.primary,
                backgroundColor: selected ? colors.primary : colors.background,
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

