"use client";

import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Container, Box, Stack } from "@mui/material";
import { useState } from "react";
import { Text } from "@/design-system/atoms/Text";

import { Button } from "@/design-system/atoms/Button";
import { PasswordField } from "@/design-system/molecule/PasswordField";
import { EmailField } from "@/design-system/molecule/EmailField";
import Card from "@/design-system/organism/Card";

export default function LoginPage() {
  const { colorScheme } = useColorTheme();
  const colors = NAV_THEME[colorScheme];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email==="" || password==="") {
      setError("Veuillez remplir tous les champs");
      return;
    }
    console.log({ email, password });
    setError(null);
    // Logique de connexion ici
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
        backgroundColor: colors.secondaryBackground,
        py: 4,
      }}
    >
    <Container maxWidth="sm">
      <Card
        colors={{
          background: colors.background,
          border: colors.border,
        }}
        onSubmit={handleSubmit}
      >
          {/* Header */}
          <Stack spacing={1} mb={4} textAlign="center">
            <Text
              variant="h4"
              colors={{ text: colors.primary }}
            >
              Bienvenue
            </Text>
            <Text
              variant="body1"
              colors={{ text: colors.mutedForeground }}
            >
              Connectez-vous pour continuer
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
              colors={colors}
            />
            {error && <Text colors={{ text: colors.notification }}>{error}</Text>}
            <Button
              colors={{
                textColor: colors.primaryForeground,
                borderColor: colors.border,
                backgroundColor: colors.primary,
              }}
              size="large"
              type="submit"
            >
              Se connecter
            </Button>
          </Stack>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Text
              variant="body2"
              colors={{ text: colors.primary }}
            >
              Mot de passe oublié ?
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

          {/* Register Link */}
          <Stack spacing={2} alignItems="center">
            <Text
              variant="body2"
              colors={{ text: colors.mutedForeground }}
            >
              Vous n&apos;avez pas encore de compte ?
            </Text>
            <Button
              colors={{
                textColor: colors.primary,
                borderColor: colors.background,
                backgroundColor: colors.background,
              }}
              size="medium"
              href="/register"
            >
              Créer un compte
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
