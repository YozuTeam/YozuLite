"use client";

import { Text } from "@/design-system/atoms/Text";
import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Box, Container, Stack } from "@mui/material";
import { useState } from "react";

import { Button } from "@/design-system/atoms/Button";
import { EmailField } from "@/design-system/molecule/EmailField";
import { PasswordField } from "@/design-system/molecule/PasswordField";
import { Selector } from "@/design-system/molecule/Selector";
import { EmailField } from "@/design-system/molecule/EmailField";
import { PhoneField } from "@/design-system/molecule/PhoneField";
import Card from "@/design-system/organism/Card";
import { Role } from "@yozu/contracts";
import { useRouter } from "next/navigation";
import { register } from "@/app/_providers/AuthProvider";

export default function RegisterPage() {
  const { colorScheme } = useColorTheme();
  const colors = NAV_THEME[colorScheme];
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      email === "" ||
      password === "" ||
      !selectedValues[0] ||
      phoneNumber === ""
    ) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    console.log({ email, password, selectedValues });
    setError(null);
    try {
      await register(email, password, phoneNumber, selectedValues[0]);
      router.replace(
        selectedValues[0] === "ADMIN"
          ? "/onboarding/student"
          : "/onboarding/company",
      );
    } catch (error: unknown) {
      console.error("Register Error:", error);
      setError(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError(null);
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
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
          <Stack spacing={1} mb={4} textAlign="center">
            <Text variant="h4" colors={{ text: colors.primary }}>
              Créer un compte
            </Text>
            <Text variant="body1" colors={{ text: colors.mutedForeground }}>
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

            <PhoneField
              label="Numéro de téléphone"
              required
              value={phoneNumber}
              onChange={(value) => handlePhoneNumberChange(value)}
              colors={colors}
            />

            <Selector
              label="Vous êtes :"
              multiple={false}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              options={[{ value: Role.STUDENT }, { value: Role.COMPANY }]}
              colors={colors}
            />

            {error && (
              <Text variant="body2" colors={{ text: colors.notification }}>
                {error}
              </Text>
            )}

            <Button
              colors={{
                textColor: colors.primaryForeground,
                borderColor: colors.border,
                backgroundColor: colors.primary,
              }}
              size="large"
              type="submit"
            >
              S'inscrire
            </Button>
          </Stack>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Text variant="body2" colors={{ text: colors.mutedForeground }}>
              En vous inscrivant, vous acceptez nos{" "}
              <Text variant="body2" colors={{ text: colors.primary }}>
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
            <Text variant="body2" colors={{ text: colors.mutedForeground }}>
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
            <Text variant="body2" colors={{ text: colors.mutedForeground }}>
              Vous avez déjà un compte ?
            </Text>
            <Button
              colors={{
                textColor: colors.primary,
                borderColor: colors.background,
                backgroundColor: colors.background,
              }}
              size="medium"
              href="/login"
            >
              Se connecter
            </Button>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
