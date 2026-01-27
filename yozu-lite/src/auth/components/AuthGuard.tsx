"use client";

import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Box, CircularProgress } from "@mui/material";
import { Role } from "@yozu/contracts";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isOnboarded, role } = useAuth();
  const router = useRouter();
  const { colorScheme } = useColorTheme();
  const colors = NAV_THEME[colorScheme];

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated === true && isOnboarded === false) {
      if (role === Role.STUDENT) {
        router.replace("/onboarding/student");
      } else if (role === Role.COMPANY) {
        router.replace("/onboarding/company");
      }
    }
  }, [isAuthenticated, isOnboarded, role, router]);

  if (isAuthenticated !== true || isOnboarded !== true) {
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

  return <>{children}</>;
}
