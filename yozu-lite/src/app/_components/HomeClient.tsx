"use client";

import { Button } from "@/design-system/atoms/Button";
import { ThemeToggle } from "@/design-system/atoms/ThemeToggle";
import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

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
        color: colors.text,
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

      <Typography sx={{ color: colors.input }}>
        Current Theme: {colorScheme}
      </Typography>

      <Button themeColor="primary" onClick={() => setCompteur((c) => c + 100)} colors={colors}>
        Like Button : {compteur}
      </Button>

      <Button
        themeColor="secondary"
        onClick={() => setCompteur((c) => c + 100)}
        colors={colors}
      >
        Secondary Button
      </Button>

      <Button
        themeColor="notification"
        onClick={() => setCompteur((c) => c + 100)}
        colors={colors}
      >
        Destructive Button
      </Button>
    </Stack>
  );
}
