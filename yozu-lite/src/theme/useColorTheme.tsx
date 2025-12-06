"use client";

import { useTheme } from "next-themes";
import { ColorMode } from "./ColorMode";

export function useColorTheme(): {
  colorScheme: ColorMode;
  isDarkColorScheme: boolean;
  setColorScheme: (theme: ColorMode) => void;
  toggleColorScheme: () => void;
} {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleColorScheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const currentTheme = resolvedTheme === "dark" ? "dark" : "light";

  return {
    colorScheme: currentTheme,
    isDarkColorScheme: currentTheme === "dark",
    setColorScheme: setTheme,
    toggleColorScheme,
  };
}
