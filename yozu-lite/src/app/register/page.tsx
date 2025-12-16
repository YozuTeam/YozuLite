"use client";

import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useState } from "react";

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
            boxShadow: `0 8px 32px ${colorScheme === "dark" ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.08)"}`,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Stack spacing={1} mb={4} textAlign="center">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: colors.text,
                fontSize: { xs: "1.75rem", sm: "2rem" },
              }}
            >
              Créer un compte
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: colors.mutedForeground,
                fontSize: "0.95rem",
              }}
            >
              Rejoignez-nous dès aujourd'hui
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
              placeholder="Créez un mot de passe"
            />

            <RoleSelector
              label="Vous êtes"
              value={role}
              onChange={setRole}
              hint="Choisissez votre rôle pour adapter l'expérience"
            />

            {error && <Typography style={{ color: colors.notification }}>{error}</Typography>}

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
            <Typography
              sx={{
                color: colors.mutedForeground,
                fontSize: "0.8rem",
              }}
            >
              En vous inscrivant, vous acceptez nos{" "}
              <Typography
                component="a"
                href="#"
                sx={{
                  color: colors.primary,
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                conditions d'utilisation
              </Typography>
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

          <Stack spacing={2} alignItems="center">
            <Typography
              sx={{
                color: colors.mutedForeground,
                fontSize: "0.9rem",
              }}
            >
              Vous avez déjà un compte ?
            </Typography>
            <Button
              colors={{
                textColor: colors.primaryForeground,
                borderColor: colors.border,
                backgroundColor: colors.primary,
              }}
              size="medium"
              href="/login"
              sx={{
                width: "100%",
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Se connecter
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
