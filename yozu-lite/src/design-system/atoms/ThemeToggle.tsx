"use client";

import IconButton from "@mui/material/IconButton";
import { useColorMode } from "@/app/_providers/ColorModeContext";

export function ThemeToggle() {
    const { mode, toggleMode } = useColorMode();

    const isLight = mode === "light";

    return (
        <IconButton onClick={toggleMode}>
            {isLight ? "Dark" : "Light"}
        </IconButton>
    );
}
