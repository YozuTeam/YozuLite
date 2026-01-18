"use client";

import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Card from "@/design-system/organism/Card";
import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import TextField from "@/design-system/atoms/TextField";
import { useState } from "react";
import { Text } from "@/design-system/atoms/Text";

type SelectOverlayProps = {
  onClose: () => void;
  options: string[];
  onSelect: (option: string) => void;
  selectedValue: string;
};

export default function SelectOverlay({
  onClose,
  options,
  onSelect,
  selectedValue,
}: SelectOverlayProps) {
  const { colorScheme } = useColorTheme();
  const colors = NAV_THEME[colorScheme];
  const [query, setQuery] = useState("");
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        onClick={onClose}
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
        }}
      />
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Card colors={{ background: colors.background, border: colors.border }}>
          <Box
            sx={{
              width: { xs: "90vw", sm: 420 },
              maxWidth: 520,
              height: 520,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ pb: 1 }}>
              <TextField
                label="Rechercher"
                size="small"
                colors={{
                  background: colors.background,
                  text: colors.text,
                  border: colors.border,
                  primary: colors.primary,
                  mutedForeground: colors.mutedForeground,
                  notification: colors.notification,
                  muted: colors.muted,
                }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Box>
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                pr: 1,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              {filteredOptions.map((option) => (
                <Box
                  key={option}
                  onClick={() => {
                    onSelect(option);
                    onClose();
                  }}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    cursor: "pointer",
                    backgroundColor:
                      selectedValue === option
                        ? alpha(colors.primary, 0.2)
                        : "transparent",
                    "&:hover": {
                      backgroundColor: alpha(colors.primary, 0.1),
                    },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <Text variant="body1" colors={{ text: colors.text }}>
                    {option}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
