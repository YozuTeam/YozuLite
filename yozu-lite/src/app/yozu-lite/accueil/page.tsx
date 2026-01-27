"use client";

import Card from "@/design-system/organism/Card";
import { Text } from "@/design-system/atoms/Text";
import { useColorTheme } from "@/theme/useColorTheme";
import { NAV_THEME } from "@/theme/constant";
import { Box, Stack } from "@mui/material";
import { Button } from "@/design-system/atoms/Button";
import { callAPI } from "@/app/_providers/AuthProvider";
import { Method } from "@/auth/constants";
import { UserAuthResponse } from "@/auth/dto/responses/user-auth.response";
import { useState } from "react";

export default function AccueilPage() {
  const { colorScheme } = useColorTheme();
  const colors = NAV_THEME[colorScheme];
  const [compte, setCompte] = useState<UserAuthResponse | null>(null);
  const [profile, setProfile] = useState<UserAuthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getProfile = async () => {
    const response = await callAPI<void, UserAuthResponse>({
      route:
        compte?.role === "STUDENT"
          ? `/profiles/students/me`
          : `/profiles/companies/me`,
      method: Method.GET,
    });

    if (response.ok && response.data) {
      setProfile(response.data);
    } else {
      setError(response.errorMessage || "Une erreur est survenue");
    }
  };
  const getCompte = async () => {
    const response = await callAPI<void, UserAuthResponse>({
      route: `/profiles/me`,
      method: Method.GET,
    });

    if (response.ok && response.data) {
      setCompte(response.data);
    } else {
      setError(response.errorMessage || "Une erreur est survenue");
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card colors={{ background: colors.background, border: colors.border }}>
        <Stack spacing={"24px"} direction={"column"} alignItems={"center"}>
          <Text variant="h4" colors={{ text: colors.primary }}>
            Bienvenue sur Yozu Lite
          </Text>
          {profile && (
            <Text variant="body1" colors={{ text: colors.primary }}>
              {JSON.stringify(profile)}
            </Text>
          )}
          {compte && (
            <Text variant="body1" colors={{ text: colors.primary }}>
              {compte.email}
              {compte.phoneNumber}
              {compte.role}
            </Text>
          )}
        </Stack>
        <Stack spacing={"16px"} direction={"row"}>
          <Button
            onClick={getProfile}
            colors={{
              textColor: colors.primaryForeground,
              borderColor: colors.border,
              backgroundColor: colors.primary,
            }}
            size="large"
            type="submit"
          >
            Voir mon profil
          </Button>

          <Button
            onClick={getCompte}
            colors={{
              textColor: colors.primaryForeground,
              borderColor: colors.border,
              backgroundColor: colors.primary,
            }}
            size="large"
            type="submit"
          >
            Infos du compte
          </Button>
          <Button
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
            }}
            colors={{
              textColor: colors.primaryForeground,
              borderColor: colors.border,
              backgroundColor: colors.primary,
            }}
            size="large"
            type="submit"
          >
            Se déconnecter
          </Button>
        </Stack>
        {error && (
          <Text variant="body2" colors={{ text: colors.notification }}>
            {error}
          </Text>
        )}
      </Card>
    </Box>
  );
}
