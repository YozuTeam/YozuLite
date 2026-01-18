"use client";

import { Text } from "@/design-system/atoms/Text";
import IconButton from "@/design-system/molecule/IconButton";
import { NAV_THEME, ThemeColors } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Box, Stack } from "@mui/material";
import Chips from "@/design-system/atoms/Chips";
import { FormField } from "../molecule/FormField";

interface PickerProps {
    label: string;
    hint?: string;
    children: React.ReactNode;
    open: boolean;
    setOpen: (open: boolean) => void;
    options: string[];
    selectedValues: string[];
    setSelectedValues: (selectedValues: string[]) => void;
    colors?: ThemeColors;
    required?: boolean;
    error?: boolean;
    errorText?: string;
    onFocus?: () => void;
}

export default function Picker({
    label, 
    hint,
    children, 
    open, 
    setOpen, 
    options = [], 
    selectedValues = [], 
    setSelectedValues,
    colors: overrideColors,
    required,
    error,
    errorText = "Veuillez sélectionner au moins une option",
    onFocus,
}: PickerProps) {
    const { colorScheme } = useColorTheme();
    const colors = overrideColors ?? NAV_THEME[colorScheme];

    const chipItems : string[] = selectedValues.map((value) => {
        const option = options.find((o) => o === value);
        return option ?? value;
    });

    return (
    <>
    <FormField
      label={label}
      required={required}
      error={error}
      errorText={errorText}
    >
    <Box
      sx={{
        border: "1px solid",
        borderColor: colors.border,
        borderRadius: "15px",
        paddingX: "16px",
        paddingY: "8px",
        backgroundColor: colors.background,
      }}
    >
        <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ width: "100%" }}>
                {chipItems.length === 0 ? (
                    <Text variant="body1" colors={{ text: colors.muted }}>
                        {hint}
                    </Text>
                ) : (
                    <Chips
                        items={chipItems}
                        onRemove={(value) => {setSelectedValues(selectedValues.filter((v) => v !== value))}}
                        colors={{
                            primary: colors.primary,
                            text: colors.text,
                            secondary: colors.secondary,
                        }}
                    />
                )}
            </Box>

            <IconButton onClick={() => {setOpen(!open)}} onFocus={onFocus}
                iconPath="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                paddingX={2}
                paddingY={0.5}
                iconSize={24}
                aria-label="Add item"
                colors={{
                    button: {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                        textColor: colors.primaryForeground,
                    },
                    icon: {
                        iconColor: colors.white,
                    },
                }}
            />
        </Stack>
    </Box>
    {open ? children : null}
    </FormField>
    </>
    );  

}