"use client";

import { Button } from "@/design-system/atoms/Button";
import  TextField  from "@/design-system/atoms/TextField";
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
            <Button colors={{
              text: colors.primaryForeground,
              border: colors.border,
              background: colors.buttonsPrimary,
            }}>Primary</Button>
            <Button colors={{
              text: colors.primaryForeground,
              border: colors.border,
              background: colors.buttonsSecondary,
            }}>Secondary</Button>
            <Button colors={{
              text: colors.primaryForeground,
              border: colors.border,
              background: colors.muted,
            }}>Muted</Button>
          </Stack>
        </Section>

        <Section title="Buttons – sizes" colors={colors}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button size="small" colors={{
              text: colors.primaryForeground,
              border: colors.border,
              background: colors.buttonsSecondary,
            }}>Small</Button>
            <Button size="medium" colors={{
              text: colors.primaryForeground,
              border: colors.border,
              background: colors.buttonsSecondary,
            }}>Medium</Button>
            <Button size="large" colors={{
              text: colors.primaryForeground,
              border: colors.border,
              background: colors.buttonsSecondary,
            }}>Large</Button>
          </Stack>
        </Section>

        <Section title="Buttons – states" colors={colors}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button colors={{
              text: colors.primaryForeground,
              border: colors.border,
              background: colors.primary,
            }}>Default</Button>
            <Button disabled colors={{
              text: colors.primaryForeground,
              border: colors.border,
              background: colors.primary,
            }}>Disabled</Button>
            <Button isLoading colors={{
              text: colors.primaryForeground,
              border: colors.border,
              background: colors.primary,
            }}>Loading</Button>
          </Stack>
        </Section>

        <Section title="TextFields" colors={colors}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <TextField
              colors={colors}
              label="Normal"
              placeholder="Votre nom"
            />
            <TextField
              colors={colors}
              label="Required"
              required
              placeholder="Obligatoire"
            />
            <TextField
              colors={colors}
              label="Email"
              type="email"
              placeholder="you@example.com"
            />
            <TextField
              colors={colors}
              label="Password"
              type="password"
              placeholder="••••••••"
            />
            <TextField
              colors={colors}
              label="Error"
              error
              helperText="Invalid value"
              placeholder="Erreur"
            />
            <TextField
              colors={colors}
              label="Disabled"
              disabled
              placeholder="Désactivé"
            />
          </Stack>
        </Section>


      </Stack>
    </Container>
  );
}
