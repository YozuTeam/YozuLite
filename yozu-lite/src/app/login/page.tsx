"use client";

import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Box, Container, Stack } from "@mui/material";
import { useState } from "react";
import Text from "@/design-system/atoms/Text";

import { Button } from "@/design-system/atoms/Button";
import { PasswordField } from "@/design-system/molecule/PasswordField";
import { EmailField } from "@/design-system/molecule/EmailField";

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
            boxShadow: `0 8px 32px ${colorScheme === "dark" ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.08)"}`,
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* Header */}
          <Stack spacing={1} mb={4} textAlign="center">
            <Text
              variant="h4"
              color={{ text: colors.text }}
            >
              Bienvenue
            </Text>
            <Text
              variant="body1"
              color={{ text: colors.mutedForeground }}
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
            {error && <Text color={{ text: colors.notification }}>{error}</Text>}
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
              color={{ text: colors.primary }}
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
              color={{ text: colors.mutedForeground }}
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
              color={{ text: colors.mutedForeground }}
            >
              Vous n&apos;avez pas encore de compte ?
            </Text>
            <Button
              colors={{
                textColor: colors.primaryForeground,
                borderColor: colors.border,
                backgroundColor: colors.primary,
              }}
              size="medium"
              href="/register"
            >
              Créer un compte
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
