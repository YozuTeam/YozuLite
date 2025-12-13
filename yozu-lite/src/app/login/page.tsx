"use client";

import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useState } from "react";

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
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: colors.text,
                fontSize: { xs: "1.75rem", sm: "2rem" },
              }}
            >
              Bienvenue
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: colors.mutedForeground,
                fontSize: "0.95rem",
              }}
            >
              Connectez-vous pour continuer
            </Typography>
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
            />
            {error && <Typography style={{ color: colors.notification }}>{error}</Typography>}
            <Button
              colors={{
                text: colors.primaryForeground,
                border: colors.border,
                background: colors.primary,
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
              Se connecter
            </Button>
          </Stack>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography
              component="a"
              href="#"
              sx={{
                color: colors.primary,
                fontSize: "0.875rem",
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Mot de passe oublié ?
            </Typography>
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
            <Typography
              sx={{
                color: colors.mutedForeground,
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              OU
            </Typography>
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
            <Typography
              sx={{
                color: colors.mutedForeground,
                fontSize: "0.9rem",
              }}
            >
              Vous n'avez pas encore de compte ?
            </Typography>
            <Button
              colors={{
                text: colors.primaryForeground,
                border: colors.border,
                background: colors.primary,
              }}
              size="medium"
              href="/register"
              sx={{
                width: "100%",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Créer un compte
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
