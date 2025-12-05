"use client";

import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { tokens } from "@/design/tokens";

// 1️⃣ Types
type ColorMode = "light" | "dark";

type ColorModeContextValue = {
    mode: ColorMode;
    toggleMode: () => void;
};

// 2️⃣ Contexte pour exposer le mode & la fonction de toggle
export const ColorModeContext = createContext<ColorModeContextValue | undefined>(
    undefined
);

// Petit hook pratique (pour ne pas répéter useContext partout)
export function useColorMode() {
    const ctx = useContext(ColorModeContext);
    if (!ctx) {
        throw new Error("useColorMode must be used within AppThemeProvider");
    }
    return ctx;
}

// 3️⃣ Provider principal de l'app
export default function AppThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<ColorMode>("light");

    const toggleMode = () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
    };

    // 4️⃣ Synchroniser Tailwind : ajouter/supprimer la classe "dark" sur <html>
    useEffect(() => {
        const root = document.documentElement;
        if (mode === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [mode]);

    // 5️⃣ Créer le thème MUI selon le mode
    const theme = useMemo(() => {
        const paletteTokens = mode === "light" ? tokens.light : tokens.dark;

        return createTheme({
            palette: {
                mode,
                primary: {
                    main: paletteTokens.primary,
                },
                background: {
                    default: paletteTokens.background,
                    paper: paletteTokens.surface,
                },
                text: {
                    primary: paletteTokens.text,
                },
            },
            shape: {
                borderRadius: tokens.radius.medium,
            },
            typography: {
                fontFamily: tokens.typography.fontFamily,
            },
        });
    }, [mode]);

    return (
        <ColorModeContext.Provider value={{ mode, toggleMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
