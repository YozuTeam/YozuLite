import { render, screen, fireEvent } from "@testing-library/react";
import { PasswordField } from "../PasswordField";
import * as useColorThemeModule from "@/theme/useColorTheme";

jest.mock("@/theme/constant", () => ({
  NAV_THEME: {
    light: {
      background: "#fff",
      text: "#000",
      border: "#ccc",
      primary: "#blue",
      mutedForeground: "#gray",
      notification: "#red",
    },
    dark: {
      background: "#000",
      text: "#fff",
      border: "#333",
      primary: "#lightblue",
      mutedForeground: "#lightgray",
      notification: "#pink",
    },
  },
}));

jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: jest.fn(),
}));

describe("PasswordField", () => {
  beforeEach(() => {
    (useColorThemeModule.useColorTheme as jest.Mock).mockReturnValue({
      colorScheme: "light",
    });
  });

  it("renders with label", () => {
    render(<PasswordField label="Password" />);
    expect(screen.getByText("Password")).toBeInTheDocument();
  });

  it("is type password by default", () => {
    render(<PasswordField label="Password" placeholder="Enter pass" />);
    const input = screen.getByPlaceholderText("Enter pass");
    expect(input).toHaveAttribute("type", "password");
  });

  it("toggles password visibility", () => {
    render(<PasswordField label="Password" placeholder="Enter pass" />);
    const input = screen.getByPlaceholderText("Enter pass");
    const toggleButton = screen.getByRole("button");

    expect(input).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("calls onChange", () => {
    const handleChange = jest.fn();
    render(<PasswordField label="Password" onChange={handleChange} placeholder="pass" />);
    const input = screen.getByPlaceholderText("pass");
    fireEvent.change(input, { target: { value: "secret" } });
    expect(handleChange).toHaveBeenCalled();
  });
});
