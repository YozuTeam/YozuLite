import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTheme } from "next-themes";
import { ColorMode, COLOR_MODES } from "../ColorMode";
import { useColorTheme } from "../useColorTheme";
import { ThemeToggle } from "@/design-system/atoms/ThemeToggle";
import { NAV_THEME } from "../constant";
import { TYPOGRAPHY } from "../typography";

jest.mock("next-themes", () => ({
    useTheme: jest.fn(),
}));

jest.mock("lucide-react", () => ({
    Moon: ({ className, color }: { className?: string; color?: string }) => (
        <svg data-testid="moon-icon" className={className} color={color}>
            Moon
        </svg>
    ),
    Sun: ({ className, color }: { className?: string; color?: string }) => (
        <svg data-testid="sun-icon" className={className} color={color}>
            Sun
        </svg>
    ),
}));

// Mock Button component
jest.mock("@/design-system/atoms/Button", () => ({
    Button: ({
        children,
        onClick,
        className,
        colors,
        size,
    }: {
        children: React.ReactNode;
        onClick?: () => void;
        className?: string;
        colors?: { textColor: string; borderColor: string; backgroundColor: string };
        size?: string;
    }) => (
        <button
            onClick={onClick}
            className={className}
            data-testid="theme-toggle-button"
            data-size={size}
            style={{
                color: colors?.textColor,
                borderColor: colors?.borderColor,
                backgroundColor: colors?.backgroundColor,
            }}
        >
            {children}
        </button>
    ),
}));

describe("ColorMode", () => {
    it("should export ColorMode type", () => {
        const lightMode: ColorMode = "light";
        const darkMode: ColorMode = "dark";

        expect(lightMode).toBe("light");
        expect(darkMode).toBe("dark");
    });

    it("should export COLOR_MODES constant", () => {
        expect(COLOR_MODES).toEqual(["light", "dark"]);
        expect(COLOR_MODES).toHaveLength(2);
        expect(COLOR_MODES).toContain("light");
        expect(COLOR_MODES).toContain("dark");
    });
});

// Test component to test the hook
function TestHookComponent({
    onHookResult,
}: {
    onHookResult: (result: ReturnType<typeof useColorTheme>) => void;
}) {
    const result = useColorTheme();
    onHookResult(result);
    return null;
}

describe("useColorTheme", () => {
    const mockSetTheme = jest.fn();
    let hookResult: ReturnType<typeof useColorTheme> | null = null;

    const captureHookResult = (result: ReturnType<typeof useColorTheme>) => {
        hookResult = result;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        hookResult = null;
    });

    it("should return light theme when resolvedTheme is light", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "light",
        });

        render(<TestHookComponent onHookResult={captureHookResult} />);

        expect(hookResult).not.toBeNull();
        expect(hookResult?.colorScheme).toBe("light");
        expect(hookResult?.isDarkColorScheme).toBe(false);
        expect(typeof hookResult?.setColorScheme).toBe("function");
        expect(typeof hookResult?.toggleColorScheme).toBe("function");
    });

    it("should return dark theme when resolvedTheme is dark", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "dark",
        });

        render(<TestHookComponent onHookResult={captureHookResult} />);

        expect(hookResult).not.toBeNull();
        expect(hookResult?.colorScheme).toBe("dark");
        expect(hookResult?.isDarkColorScheme).toBe(true);
    });

    it("should return light theme when resolvedTheme is undefined", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: undefined,
        });

        render(<TestHookComponent onHookResult={captureHookResult} />);

        expect(hookResult).not.toBeNull();
        expect(hookResult?.colorScheme).toBe("light");
        expect(hookResult?.isDarkColorScheme).toBe(false);
    });

    it("should return light theme when resolvedTheme is null", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: null,
        });

        render(<TestHookComponent onHookResult={captureHookResult} />);

        expect(hookResult).not.toBeNull();
        expect(hookResult?.colorScheme).toBe("light");
        expect(hookResult?.isDarkColorScheme).toBe(false);
    });

    it("should call setTheme when setColorScheme is called", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "light",
        });

        render(<TestHookComponent onHookResult={captureHookResult} />);

        hookResult?.setColorScheme("dark");
        expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("should toggle from light to dark when toggleColorScheme is called", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "light",
        });

        render(<TestHookComponent onHookResult={captureHookResult} />);

        hookResult?.toggleColorScheme();
        expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("should toggle from dark to light when toggleColorScheme is called", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "dark",
        });

        render(<TestHookComponent onHookResult={captureHookResult} />);

        hookResult?.toggleColorScheme();
        expect(mockSetTheme).toHaveBeenCalledWith("light");
    });
});

describe("ThemeToggle", () => {
    const mockSetTheme = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render with sun icon when theme is light", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "light",
        });

        render(<ThemeToggle />);

        expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
        expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument();
    });

    it("should render with moon icon when theme is dark", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "dark",
        });

        render(<ThemeToggle />);

        expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
        expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();
    });

    it("should use light theme colors when isDarkColorScheme is false", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "light",
        });

        render(<ThemeToggle />);

        const button = screen.getByTestId("theme-toggle-button");
        expect(button).toHaveStyle({
            color: NAV_THEME.light.text,
            borderColor: NAV_THEME.light.border,
            backgroundColor: NAV_THEME.light.background,
        });
    });

    it("should use dark theme colors when isDarkColorScheme is true", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "dark",
        });

        render(<ThemeToggle />);

        const button = screen.getByTestId("theme-toggle-button");
        expect(button).toHaveStyle({
            color: NAV_THEME.dark.text,
            borderColor: NAV_THEME.dark.border,
            backgroundColor: NAV_THEME.dark.background,
        });
    });

    it("should call toggleColorScheme when button is clicked", async () => {
        const user = userEvent.setup();
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "light",
        });

        render(<ThemeToggle />);

        const button = screen.getByTestId("theme-toggle-button");
        await user.click(button);

        expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("should have correct button size", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "light",
        });

        render(<ThemeToggle />);

        const button = screen.getByTestId("theme-toggle-button");
        expect(button).toHaveAttribute("data-size", "small");
    });

    it("should have correct className", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "light",
        });

        render(<ThemeToggle />);

        const button = screen.getByTestId("theme-toggle-button");
        expect(button).toHaveClass(
            "inline-flex items-center justify-center rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        );
    });

    it("should have screen reader text", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "light",
        });

        render(<ThemeToggle />);

        expect(screen.getByText("Toggle theme")).toBeInTheDocument();
        expect(screen.getByText("Toggle theme")).toHaveClass("sr-only");
    });

    it("should pass correct color to sun icon when theme is light", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "light",
        });

        render(<ThemeToggle />);

        const sunIcon = screen.getByTestId("sun-icon");
        expect(sunIcon).toHaveAttribute("color", NAV_THEME.light.text);
    });

    it("should pass correct color to moon icon when theme is dark", () => {
        (useTheme as jest.Mock).mockReturnValue({
            setTheme: mockSetTheme,
            resolvedTheme: "dark",
        });

        render(<ThemeToggle />);

        const moonIcon = screen.getByTestId("moon-icon");
        expect(moonIcon).toHaveAttribute("color", NAV_THEME.dark.text);
    });
});

describe("Typography", () => {
    it("should export TYPOGRAPHY constant", () => {
        expect(TYPOGRAPHY).toBeDefined();
    });

    it("should include valid typography variants", () => {
        const variants = Object.keys(TYPOGRAPHY);
        expect(variants).toContain("h1");
        expect(variants).toContain("h2");
        expect(variants).toContain("h3");
        expect(variants).toContain("h4");
        expect(variants).toContain("subtitle1");
        expect(variants).toContain("subtitle2");
        expect(variants).toContain("body1");
        expect(variants).toContain("body2");
    });

    it("should have correct properties for h1", () => {
        expect(TYPOGRAPHY.h1).toHaveProperty("fontSize", "2.5rem");
        expect(TYPOGRAPHY.h1).toHaveProperty("fontWeight", 700);
        expect(TYPOGRAPHY.h1).toHaveProperty("lineHeight", 1.2);
    });

    it("should have correct properties for body1", () => {
        expect(TYPOGRAPHY.body1).toHaveProperty("fontSize", "1rem");
        expect(TYPOGRAPHY.body1).toHaveProperty("fontWeight", 400);
        expect(TYPOGRAPHY.body1).toHaveProperty("lineHeight", 1.6);
    });
});

