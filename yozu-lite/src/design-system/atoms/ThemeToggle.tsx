"use client";

import { NAV_THEME } from "@/theme/constant";
import { useColorTheme } from "@/theme/useColorTheme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { isDarkColorScheme, toggleColorScheme } = useColorTheme();
  const colors = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <button
      onClick={toggleColorScheme}
      className="inline-flex items-center justify-center rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        color: colors.text,
      }}
    >
      {isDarkColorScheme ? (
        <Moon
          className="h-[1.2rem] w-[1.2rem] transition-all"
          color={colors.text}
        />
      ) : (
        <Sun
          className="h-[1.2rem] w-[1.2rem] transition-all"
          color={colors.text}
        />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
