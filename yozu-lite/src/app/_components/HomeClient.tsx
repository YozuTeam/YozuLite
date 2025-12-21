"use client";

import { Button } from "@/design-system/atoms/Button";
import { ThemeToggle } from "@/design-system/atoms/ThemeToggle";
import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Text from "@/design-system/atoms/Text";

export default function HomeClient() {
  const [compteur, setCompteur] = useState(0);
  const { colorScheme, isDarkColorScheme } = useColorTheme();
  const colors = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  useEffect(() => {
    const interval = setInterval(() => {
      setCompteur((c) => c + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Stack
      alignItems="center"
      spacing={2.5}
      sx={{
        py: 6,
        backgroundColor: colors.background,
        colors: colors.text,
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          px: 4,
        }}
      >
        <ThemeToggle />
      </Box>

      <Text variant="body1" colors={{ text: colors.input }}>
        Current Theme: {colorScheme}
      </Text>

      <Button onClick={() => setCompteur((c) => c + 100)} colors={{
        textColor: colors.text,
        borderColor: colors.border,
        backgroundColor: colors.primary,
      }}>
        Like Button : {compteur}
      </Button>

      <Button
        onClick={() => setCompteur((c) => c + 100)}
        colors={{
          textColor: colors.text,
          borderColor: colors.border,
          backgroundColor: colors.secondary,
        }}
      >
        Secondary Button
      </Button>

      <Button
        onClick={() => setCompteur((c) => c + 100)}
        colors={{
          textColor: colors.text,
          borderColor: colors.border,
          backgroundColor: colors.warning,
        }}
      >
        Destructive Button
      </Button>
    </Stack>
  );
}
