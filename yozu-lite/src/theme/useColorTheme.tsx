export function useColorTheme() {
    const theme = useTheme();
    return theme.palette.mode;
}