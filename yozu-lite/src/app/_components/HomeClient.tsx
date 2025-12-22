"use client";

import { Button } from "@/design-system/atoms/Button";
import { Text } from "@/design-system/atoms/Text";
import { useColorTheme } from "@/theme/useColorTheme";
import { NAV_THEME } from "@/theme/constant";
import { Box, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import Card from "@/design-system/organism/Card";

export default function HomeClient() {
  const { colorScheme } = useColorTheme();
  const colors = NAV_THEME[colorScheme];
  const router = useRouter();

  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
    }}
    >
    <Card colors={{ background: colors.background, border: colors.border }}>
      <Stack spacing={8} margin={2}>
        <Stack alignItems="center" spacing={1}>
          <Text variant="h4" colors={{ text: colors.text }}>
            Bienvenue sur
          </Text>
          <Text variant="h3" colors={{ text: colors.primary }}>
            YozuLite
          </Text>
        </Stack>

        <Stack spacing={2}>
          <Button variant="contained" colors={{
            textColor: colors.background,
            borderColor: colors.primary,
            backgroundColor: colors.primary,
          }} onClick={() => {router.push("/login")}}>
            Se connecter
          </Button>
          <Button variant="outlined" colors={{
            textColor: colors.primary,
            borderColor: colors.primary,
            backgroundColor: colors.background,
          }} onClick={() => {router.push("/register")}}>
            S&apos;inscrire
          </Button>
        </Stack>
      </Stack>
    </Card>
    </Box>
  );
}