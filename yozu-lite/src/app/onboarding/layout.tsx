"use client";

import { useColorTheme } from "@/theme/useColorTheme";
import { NAV_THEME } from "@/theme/constant";
import { Text } from "@/design-system/atoms/Text";
import { Box, Container } from "@mui/material";
import AuthProvider from "@/app/_providers/AuthProvider";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colorScheme } = useColorTheme();
  const colors = NAV_THEME[colorScheme];

  return (
    <AuthProvider>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: colors.background,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          component="header"
          sx={{
            height: "80px",
            display: "flex",
            alignItems: "center",
            borderBottom: `1px solid ${colors.border}`,
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(23, 23, 23, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
              >
                <Box
                  sx={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: colors.primary,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 14px 0 ${colors.primary}40`,
                  }}
                >
                  <Text
                    variant="h4"
                    colors={{ text: colors.white }}
                    sx={{
                      lineHeight: 1,
                      fontWeight: 900,
                      mb: "2px",
                      fontSize: "1.25rem",
                    }}
                  >
                    Y
                  </Text>
                </Box>
                <Text
                  variant="h4"
                  colors={{ text: colors.text }}
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "-0.05em",
                    fontSize: "1.5rem",
                  }}
                >
                  YOZU
                </Text>
              </Box>
            </Box>
          </Container>
        </Box>
        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            pt: 4,
            pb: 8,
          }}
        >
          {children}
        </Box>
      </Box>
    </AuthProvider>
  );
}
