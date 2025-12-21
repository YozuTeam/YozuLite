"use client";

import { Button } from "@/design-system/atoms/Button";
import { Icon } from "@/design-system/atoms/Icon";
import  TextField  from "@/design-system/atoms/TextField";
import { ThemeToggle } from "@/design-system/atoms/ThemeToggle";
import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Box, Container, Divider, Stack } from "@mui/material";
import type { ReactNode } from "react";
import Text from "@/design-system/atoms/Text";  

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
      <Text variant="h4" colors={{ text: colors.text }}>
        {title}
      </Text>
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
          <Text variant="h2" colors={{ text: colors.text }}>
            Design system – Atoms
          </Text>
          <ThemeToggle />
        </Box>

        <Section title="Buttons – colors" colors={colors}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button colors={{
              textColor: colors.primaryForeground,
              borderColor: colors.border,
              backgroundColor: colors.buttonsPrimary,
            }}>Primary</Button>
            <Button colors={{
              textColor: colors.primaryForeground,
              borderColor: colors.border,
              backgroundColor: colors.buttonsSecondary,
            }}>Secondary</Button>
            <Button colors={{
              textColor: colors.primaryForeground,
              borderColor: colors.border,
              backgroundColor: colors.muted,
            }}>Muted</Button>
          </Stack>
        </Section>

        <Section title="Buttons – sizes" colors={colors}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button size="small" colors={{
              textColor: colors.primaryForeground,
              borderColor: colors.border,
              backgroundColor: colors.buttonsSecondary,
            }}>Small</Button>
            <Button size="medium" colors={{
              textColor: colors.primaryForeground,
              borderColor: colors.border,
              backgroundColor: colors.buttonsSecondary,
            }}>Medium</Button>
            <Button size="large" colors={{
              textColor: colors.primaryForeground,
              borderColor: colors.border,
              backgroundColor: colors.buttonsSecondary,
            }}>Large</Button>
          </Stack>
        </Section>

        <Section title="Buttons – states" colors={colors}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button colors={{
              textColor: colors.primaryForeground,
              borderColor: colors.border,
              backgroundColor: colors.primary,
            }}>Default</Button>
            <Button disabled colors={{
              textColor: colors.primaryForeground,
              borderColor: colors.border,
              backgroundColor: colors.primary,
            }}>Disabled</Button>
            <Button isLoading colors={{
              textColor: colors.primaryForeground,
              borderColor: colors.border,
              backgroundColor: colors.primary,
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

        <Section title="Icons" colors={colors}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Icon colors={{iconColor: colors.primary}}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </Icon>
            <Icon colors={{iconColor: colors.secondary}}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </Icon>
            <Icon colors={{iconColor: colors.accent}}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </Icon>
            <Icon colors={{iconColor: colors.success}}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </Icon>
            <Icon colors={{iconColor: colors.warning}}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </Icon>
            <Icon colors={{iconColor: colors.notification}}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </Icon>
          </Stack>
        </Section>

        <Section title="Text" colors={colors}>
          <Stack direction="column" spacing={2} flexWrap="wrap">
            <Text colors={colors}>Alan</Text>
            <Text variant="h2" colors={colors}>Alan</Text>
            <Text variant="h3" colors={colors}>Alan</Text>
            <Text variant="h4" colors={colors}>Alan</Text>

            <Text variant="subtitle1" colors={colors}>Alan</Text>
            <Text variant="subtitle2" colors={colors}>Alan</Text>
            <Text variant="body1" colors={colors}>Alan</Text>
            <Text variant="body2" colors={colors}>Alan</Text>
          </Stack>
        </Section>         
      </Stack>
    </Container>
  );
}
