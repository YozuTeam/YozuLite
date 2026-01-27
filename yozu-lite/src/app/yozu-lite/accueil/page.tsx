"use client";

import { callAPI, Method, useAuth } from "@/auth";
import { Button } from "@/design-system/atoms/Button";
import { Text } from "@/design-system/atoms/Text";
import Card from "@/design-system/organism/Card";
import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Box, CircularProgress, Stack } from "@mui/material";
import {
  ICompanyProfileResponse,
  IStudentProfileResponse,
  Role,
} from "@yozu/contracts";
import { useEffect, useState } from "react";

export default function AccueilPage() {
  const { colorScheme } = useColorTheme();
  const colors = NAV_THEME[colorScheme];
  const { role, logout } = useAuth();

  const [studentProfile, setStudentProfile] =
    useState<IStudentProfileResponse | null>(null);
  const [companyProfile, setCompanyProfile] =
    useState<ICompanyProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!role) return;

      setIsLoading(true);
      setError(null);

      const profileResponse = await callAPI<
        void,
        IStudentProfileResponse | ICompanyProfileResponse
      >({
        route:
          role === Role.STUDENT
            ? `/profiles/students/me`
            : `/profiles/companies/me`,
        method: Method.GET,
      });
      if (profileResponse.ok && profileResponse.data) {
        if (role === Role.STUDENT) {
          setStudentProfile(profileResponse.data as IStudentProfileResponse);
        } else {
          setCompanyProfile(profileResponse.data as ICompanyProfileResponse);
        }
      } else {
        setError(
          profileResponse.errorMessage || "Impossible de récupérer le profil",
        );
      }

      setIsLoading(false);
    };

    if (role) {
      fetchData();
    }
  }, [role]);

  if (isLoading && role) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: colors.secondaryBackground,
        }}
      >
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: colors.secondaryBackground,
        p: 2,
      }}
    >
      <Card colors={{ background: colors.background, border: colors.border }}>
        <Stack spacing={"24px"} direction={"column"} alignItems={"center"}>
          <Text variant="h4" colors={{ text: colors.primary }}>
            Bienvenue sur Yozu Lite
          </Text>

          {role && (
            <Stack spacing={1} alignItems="center">
              <Text variant="h4" colors={{ text: colors.primary }}>
                Tableau de bord{" "}
                {role === Role.STUDENT ? "Étudiant" : "Entreprise"}
              </Text>
              <Text variant="body2" colors={{ text: colors.mutedForeground }}>
                Rôle : {role}
              </Text>
            </Stack>
          )}

          {studentProfile && (
            <Box
              sx={{
                width: "100%",
                p: 2,
                borderRadius: 2,
                bgcolor: colors.secondaryBackground,
              }}
            >
              <Text
                variant="subtitle1"
                colors={{ text: colors.primary }}
                sx={{ mb: 1 }}
              >
                Profil Étudiant
              </Text>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  color: colors.primary,
                }}
              >
                {JSON.stringify(studentProfile, null, 2)}
              </pre>
            </Box>
          )}

          {companyProfile && (
            <Box
              sx={{
                width: "100%",
                p: 2,
                borderRadius: 2,
                bgcolor: colors.secondaryBackground,
              }}
            >
              <Text
                variant="subtitle1"
                colors={{ text: colors.primary }}
                sx={{ mb: 1 }}
              >
                Profil Entreprise
              </Text>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  color: colors.primary,
                }}
              >
                {JSON.stringify(companyProfile, null, 2)}
              </pre>
            </Box>
          )}

          {error && (
            <Text variant="body2" colors={{ text: colors.notification }}>
              {error}
            </Text>
          )}

          <Button
            onClick={logout}
            colors={{
              textColor: colors.primaryForeground,
              borderColor: colors.border,
              backgroundColor: colors.primary,
            }}
            size="large"
          >
            Se déconnecter
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
