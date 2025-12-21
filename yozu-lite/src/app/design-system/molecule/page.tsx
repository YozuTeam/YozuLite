"use client";

import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Container, Stack, Divider } from "@mui/material";
import { useState, type ReactNode } from "react";
import Text from "@/design-system/atoms/Text";

import TextField from "@/design-system/atoms/TextField";
import IconButton from "@/design-system/molecule/IconButton";
import { FormField } from "@/design-system/molecule/FormField";
import { PasswordField } from "@/design-system/molecule/PasswordField";
import { Role, RoleSelector } from "@/design-system/molecule/RoleSelector";
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

export default function MoleculesPreviewPage() {
  const { colorScheme } = useColorTheme();
  const colors = NAV_THEME[colorScheme];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Section title="TextField" colors={colors}>
        <FormField
          label="Email"
          required
          hint="Nous ne partagerons jamais votre email."
          colors={colors}
        >
          <TextField
            colors={colors}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </FormField>
        </Section>

        <Section title="PasswordField" colors={colors}> 
        <PasswordField
          label="Mot de passe"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          colors={colors}
        />
        </Section>

        <Section title="RoleSelector" colors={colors}>
        <RoleSelector
          label="Vous êtes"
          value={role}
          onChange={setRole}
          hint="Choisissez votre rôle pour adapter l'expérience."
          colors={colors}
        />
        </Section>
        <Section title="IconButton" colors={colors}>
        <Stack direction="row" spacing={2}>
        <IconButton
          iconPath="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          colors={{
            button: {
              backgroundColor: colors.primary,
              borderColor: colors.secondary,
              textColor: colors.primaryForeground,
            },
            icon: {
              iconColor: colors.white,
            },
          }}
        />
        </Stack>          
      </Section>
      </Stack>
    </Container>
  );
}
