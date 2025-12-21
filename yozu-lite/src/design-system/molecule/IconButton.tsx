"use client";

import { Button, ButtonColors, type ButtonProps } from "../atoms/Button";
import { Icon, type IconColors } from "../atoms/Icon";

export interface IconButtonColors {
  button : ButtonColors;
  icon : IconColors;

}
type IconButtonProps = Omit<ButtonProps, "children" | "colors"> & {
  iconPath: string;
  colors: IconButtonColors;
  paddingX?: number;
  paddingY?: number;
};

export default function IconButton({
  iconPath,
  colors,
  paddingX = 4,
  paddingY = 1,
  ...rest
}: IconButtonProps) {
  return (
    <Button
      {...rest}
      colors={{
        backgroundColor: colors.button.backgroundColor,
        borderColor: colors.button.borderColor,
        textColor: colors.button.textColor,
      }}size="large"
      sx={{
        position: "absolute",
        minWidth: 0,
        paddingInline: paddingX, 
        paddingBlock: paddingY,  
        ...rest.sx
      }}
    > 
      <Icon
        colors={{ iconColor: colors.icon.iconColor }}
          >
        <path d={iconPath} />
      </Icon>
    </Button>
  );
}
