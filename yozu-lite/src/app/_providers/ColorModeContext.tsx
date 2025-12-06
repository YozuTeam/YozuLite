"use client";

import { createContext, useContext } from "react";


export type ColorMode = "light" | "dark";

export type ColorModeContextValue = {
    mode: ColorMode;
    toggleMode: () => void;
};


export const ColorModeContext = createContext<ColorModeContextValue | undefined>(
    undefined
);


export function useColorMode() {
    const ctx = useContext(ColorModeContext);
    if (!ctx) {
        throw new Error("useColorMode must be used within AppThemeProvider");
    }
    return ctx;
}
