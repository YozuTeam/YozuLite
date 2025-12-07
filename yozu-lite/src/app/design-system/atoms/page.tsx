"use client";

import { Button } from "@/design-system/atoms/Button";
import { ThemeToggle } from "@/design-system/atoms/ThemeToggle";
import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

function Section({
  title,
  children,
  colors,
}: {
  title: string;
  children: ReactNode;
  colors: (typeof NAV_THEME)["light"] | (typeof NAV_THEME)["dark"];
}) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight="600" sx={{ color: colors.text }}>
        {title}
      </Typography>
      {children}
      <Divider sx={{ borderColor: colors.border }} />
    </Stack>
  );
}

export default function AtomsPreviewPage() {
  const { isDarkColorScheme } = useColorTheme();
  const colors = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <Container
      maxWidth="md"
      sx={{ backgroundColor: colors.background, minHeight: "100vh" }}
    >
      <Stack spacing={6} sx={{ py: 6 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" fontWeight="700" sx={{ color: colors.text }}>
            Design system – Atoms
          </Typography>
          <ThemeToggle />
        </Box>

        <Section title="Buttons – colors" colors={colors}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button themeColor="primary" colors={colors}>Primary</Button>
            <Button themeColor="secondary" colors={colors}>Secondary</Button>
            <Button themeColor="muted" colors={colors}>Muted</Button>
          </Stack>
        </Section>

        <Section title="Buttons – sizes" colors={colors}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button size="sm" colors={colors}>Small</Button>
            <Button size="md" colors={colors}>Medium</Button>
            <Button size="lg" colors={colors}>Large</Button>
          </Stack>
        </Section>

        <Section title="Buttons – states" colors={colors}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button colors={colors}>Default</Button>
            <Button disabled colors={colors}>Disabled</Button>
            <Button isLoading colors={colors}>Loading</Button>
          </Stack>
        </Section>
      </Stack>
    </Container>
  );
}
