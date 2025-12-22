"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import Card from "@/design-system/organism/Card";
import Picker from "../organism/Picker";
import SelectOverlay from "../organism/SelectOverlay";
import { Button } from "../atoms/Button";
import Textarea from "../molecule/TextArea";
import { Selector, SelectorOption } from "../molecule/Selector";
import { Text } from "../atoms/Text";
import TextFormField from "../molecule/TextFormField";  

export type PickerOption = { label: string; value: string };



export type FormData = {
  inputField1: string;
  inputField2: string;
  textAreaField: string;
  pickerField: string[];
  selectorField: string[];
};

export type FormErrors = {
  inputField1?: boolean;
  inputField2?: boolean;
  textAreaField?: boolean;
  pickerField?: boolean;
  selectorField?: boolean;
};

export type SetFormData = {
    setInputField1: (inputField1: string) => void;
    setInputField2: (inputField2: string) => void;
    setTextAreaField: (textAreaField: string) => void;
    setPickerField: (pickerField: string[]) => void;
    setSelectorField: (selectorField: string[]) => void;
};

export interface Labels {
    labelInputField1: string;
    labelInputField2: string;
    labelTextAreaField: string;
    labelPickerField: string;
    labelSelectorField: string;
    labelTitle: string;
}

type FormTemplateProps = {
    data: FormData;
    setFormData: SetFormData;
    onSubmit: (data: FormData) => void;
    labels: Labels;
    selectorOptions?: string[];
    pickerOptions?: string[];
};

export default function Form({ data, setFormData, onSubmit, labels, selectorOptions, pickerOptions }: FormTemplateProps) {
    const { colorScheme } = useColorTheme();
    const colors = NAV_THEME[colorScheme];
    const [pickerOpen, setPickerOpen] = useState(false);
    const formattedSelectorOptions: SelectorOption[] = (selectorOptions || []).map(opt => ({ value: opt }));
    const formattedPickerOptions: string[] = pickerOptions || [];
    const [errors, setErrors] = useState<FormErrors>({});

    const clearError = (key: keyof FormErrors) => {
        setErrors((prev) => ({ ...prev, [key]: false }));
    };

    const validateOnSubmit = () => {
        const newErrors: FormErrors = {
            inputField1: data.inputField1.trim().length === 0,
            inputField2: data.inputField2.trim().length === 0,
            textAreaField: data.textAreaField.trim().length === 0,
            pickerField: data.pickerField.length === 0,
            selectorField: data.selectorField.length === 0,
        };

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData: FormData = {
            inputField1: data.inputField1,
            inputField2: data.inputField2,
            textAreaField: data.textAreaField,
            pickerField: data.pickerField,
            selectorField: data.selectorField,
        };
        if (validateOnSubmit()) {
            onSubmit(formData);
        } 
    };
    
    return (
        <Box
      sx={{
        maxWidth: 520,
        mx: "auto",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.secondaryBackground,
        py: 4,
      }}
    >
            <Card colors={{background: colors.background, border: colors.border}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: "32px" }}>
                    <Text variant="h4" colors={{text: colors.primary}} sx={{ textAlign: "center", display: "block" }}>{labels.labelTitle}</Text>
                    <TextFormField
                        label={labels.labelInputField1}
                        required
                        error={errors.inputField1}
                        onChange={(e) => setFormData.setInputField1(e.target.value)}
                        onFocus={() => clearError("inputField1")}
                        colors={colors}
                    />
                    
                    <TextFormField
                        label={labels.labelInputField2}
                        required
                        error={errors.inputField2}
                        onChange={(e) => setFormData.setInputField2(e.target.value)}
                        onFocus={() => clearError("inputField2")}
                        colors={colors}
                    />
                    <Textarea
                        label={labels.labelTextAreaField}
                        required
                        error={errors.textAreaField}
                        onChange={(e) => setFormData.setTextAreaField(e.target.value)}
                        onFocus={() => clearError("textAreaField")}
                        colors={colors}
                    />

                    <Selector
                        label={labels.labelSelectorField}
                        required
                        multiple
                        error={errors.selectorField}
                        options={formattedSelectorOptions}
                        selectedValues={data.selectorField}
                        setSelectedValues={setFormData.setSelectorField}
                        colors={colors}
                        onFocus={() => clearError("selectorField")}
                    />


                    <Picker
                        label={labels.labelPickerField}
                        hint="Ajoute une compétence"
                        required
                        error={errors.pickerField}
                        options={formattedPickerOptions}
                        selectedValues={data.pickerField}
                        setSelectedValues={setFormData.setPickerField}
                        open={pickerOpen}
                        setOpen={setPickerOpen}
                        onFocus={() => clearError("pickerField")}
                    >
                        <SelectOverlay 
                            onClose={() => setPickerOpen(false)}
                            options={formattedPickerOptions}
                            onSelect={(option) => setFormData.setPickerField([...data.pickerField, option])}
                            selectedValue=""
                        />
                    </Picker>
                    <Button onClick={handleSubmit}
                        colors={{
                            textColor: colors.primaryForeground,
                            borderColor: colors.border,
                            backgroundColor: colors.primary,
                        }}
                        size="large"
                        type="submit"
                        sx={{ mt: 2 }}
                    >
                        Continuer
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}