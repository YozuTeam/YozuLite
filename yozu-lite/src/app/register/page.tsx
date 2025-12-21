"use client";

import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Box, Container, Stack } from "@mui/material";
import { useState } from "react";
import Text from "@/design-system/atoms/Text";

import { Button } from "@/design-system/atoms/Button";
import { PasswordField } from "@/design-system/molecule/PasswordField";
import { Role, RoleSelector } from "@/design-system/molecule/RoleSelector";
import { EmailField } from "@/design-system/molecule/EmailField";

export default function RegisterPage() {
  const { colorScheme } = useColorTheme();
  const colors = NAV_THEME[colorScheme];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setError("Veuillez remplir tous les champs");
      return;
    }
    console.log({ email, password, role });
    setError(null);
    // Logique d'inscription ici
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: colors.card,
            borderRadius: "24px",
            padding: { xs: 3, sm: 5 },
            boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Stack spacing={1} mb={4} textAlign="center">
            <Text
              variant="h4"
              colors={{ text: colors.text }}
            >
              Créer un compte
            </Text>
            <Text
              variant="body1"
              colors={{ text: colors.mutedForeground }}
            >
              Rejoignez-nous dès aujourd&apos;hui
            </Text>
          </Stack>

          <Stack spacing={3}>
            <EmailField 
              label="Email" 
              required 
              colors={colors}
              onChange={(value) => handleEmailChange(value)}
            />

            <PasswordField
              label="Mot de passe"
              required
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Créez un mot de passe"
              colors={colors}
            />

            <RoleSelector
              label="Vous êtes"
              value={role}
              onChange={setRole}
              hint="Choisissez votre rôle pour adapter l'expérience"
              colors={colors}
            />

            {error && <Text variant="body2" colors={{ text: colors.notification }}>{error}</Text>}

            <Button
              colors={{
                textColor: colors.primaryForeground,
                borderColor: colors.border,
                backgroundColor: colors.primary,
              }}
              size="large"
              type="submit"
              sx={{
                mt: 2,
                width: "100%",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              S'inscrire
            </Button>
          </Stack>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Text
              variant="body2"
              colors={{ text: colors.mutedForeground }}
            >
              En vous inscrivant, vous acceptez nos{" "}
              <Text
                variant="body2"
                colors={{ text: colors.primary }}
              >
                conditions d&apos;utilisation
              </Text>
            </Text>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              my: 4,
              gap: 2,
            }}
          >
            <Box
              sx={{
                flex: 1,
                height: "1px",
                backgroundColor: colors.border,
              }}
            />
            <Text
              variant="body2"
              colors={{ text: colors.mutedForeground }}
            >
              OU
            </Text>
            <Box
              sx={{
                flex: 1,
                height: "1px",
                backgroundColor: colors.border,
              }}
            />
          </Box>

          <Stack spacing={2} alignItems="center">
            <Text
              variant="body2"
              colors={{ text: colors.mutedForeground }}
            >
              Vous avez déjà un compte ?
            </Text>
            <Button
              colors={{
                textColor: colors.primaryForeground,
                borderColor: colors.border,
                backgroundColor: colors.primary,
              }}
              size="medium"
              href="/login"
            >
              Se connecter
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
