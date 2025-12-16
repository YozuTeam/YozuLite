import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "../ThemeToggle";
import * as useColorThemeModule from "@/theme/useColorTheme";

jest.mock("@/theme/constant", () => ({
  NAV_THEME: {
    light: {
      text: "#000000",
      border: "#cccccc",
      background: "#ffffff",
    },
    dark: {
      text: "#ffffff",
      border: "#333333",
      background: "#000000",
    },
  },
}));

jest.mock("lucide-react", () => ({
  Moon: () => <div data-testid="moon-icon" />,
  Sun: () => <div data-testid="sun-icon" />,
}));
jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: jest.fn(),
}));

describe("ThemeToggle", () => {
  const mockToggleColorScheme = jest.fn();

  beforeEach(() => {
    mockToggleColorScheme.mockClear();
  });

  it("renders Sun icon in light mode", () => {
    (useColorThemeModule.useColorTheme as jest.Mock).mockReturnValue({
      isDarkColorScheme: false,
      toggleColorScheme: mockToggleColorScheme,
    });

    render(<ThemeToggle />);
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument();
  });

  it("renders Moon icon in dark mode", () => {
    (useColorThemeModule.useColorTheme as jest.Mock).mockReturnValue({
      isDarkColorScheme: true,
      toggleColorScheme: mockToggleColorScheme,
    });

    render(<ThemeToggle />);
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();
  });

  it("calls toggleColorScheme on click", () => {
    (useColorThemeModule.useColorTheme as jest.Mock).mockReturnValue({
      isDarkColorScheme: false,
      toggleColorScheme: mockToggleColorScheme,
    });

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockToggleColorScheme).toHaveBeenCalledTimes(1);
  });
});
