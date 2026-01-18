"use client";

import { Chip, Stack } from "@mui/material";

export interface ChipsColors {
  primary: string;
  text: string;
  secondary: string;
};

type ChipsProps = {
  items: string[];
  onRemove: (value: string) => void;
  colors: ChipsColors;
};  

export default function Chips({
  items,
  onRemove,
  colors,
}: ChipsProps) {
  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      {items.map((item) => (
        <Chip
          key={item}
          label={item}
          onDelete={() => onRemove(item)}
          variant="outlined"
          sx={
            {
                  borderColor: colors.primary,
                  color: colors.text,
                  backgroundColor: colors.secondary,
                }
          }
        />
      ))}
    </Stack>
  );
}
