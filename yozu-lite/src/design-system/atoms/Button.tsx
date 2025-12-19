"use client";

import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import Text from "@/design-system/atoms/Text";

export interface ButtonColors {
  textColor: string;
  borderColor: string;
  backgroundColor: string;
}

export type ButtonProps = {
  colors: ButtonColors;
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
} & Omit<MuiButtonProps, "size" | "color">;

export function Button({ colors, size="medium", isLoading=false, ...rest }: ButtonProps) {
  return (
    <MuiButton
      style={{
        backgroundColor: colors.backgroundColor,
        color: colors.textColor,
        borderColor: colors.borderColor,
        borderWidth: 1,
        borderStyle: "solid",
      }}
      disabled={isLoading || rest.disabled}
      size={size}
      {...rest}
    >
      {isLoading ? (
        <Text color={{ text: colors.textColor }} variant="body2">
          Chargement...
        </Text>
      ) : (
        rest.children
      )}
    </MuiButton>
  );
}
