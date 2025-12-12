"use client";

import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Container, Stack } from "@mui/material";
import { useState } from "react";

import TextField from "@/design-system/atoms/TextField";
import { FormField } from "@/design-system/molecule/FormField";
import { PasswordField } from "@/design-system/molecule/PasswordField";
import { Role, RoleSelector } from "@/design-system/molecule/RoleSelector";

export default function MoleculesPreviewPage() {
  const { colorScheme } = useColorTheme();
  const colors = NAV_THEME[colorScheme];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={4}>
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

        <PasswordField
          label="Mot de passe"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <RoleSelector
          label="Vous êtes"
          value={role}
          onChange={setRole}
          hint="Choisissez votre rôle pour adapter l'expérience."
        />
      </Stack>
    </Container>
  );
}
