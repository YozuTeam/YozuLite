import { render, screen, fireEvent } from "@testing-library/react";
import { PasswordField } from "../PasswordField";
import { TextFieldColors } from "../../atoms/TextField";

// Mock colors object satisfying TextFieldColors interface
const mockColors: TextFieldColors = {
  background: "#ffffff",
  text: "#000000",
  border: "#cccccc",
  primary: "#0000ff",
  mutedForeground: "#999999",
  notification: "#ff0000",
};

describe("PasswordField", () => {
  it("renders with label and default placeholder", () => {
    render(<PasswordField label="Mot de passe" colors={mockColors} />);
    expect(screen.getByText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Votre mot de passe")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(
      <PasswordField
        label="Mot de passe"
        colors={mockColors}
        placeholder="Custom Placeholder"
      />
    );
    expect(screen.getByPlaceholderText("Custom Placeholder")).toBeInTheDocument();
  });

  it("is type password by default", () => {
    render(<PasswordField label="Password" colors={mockColors} />);
    const input = screen.getByPlaceholderText("Votre mot de passe");
    expect(input).toHaveAttribute("type", "password");
  });

  it("toggles password visibility", () => {
    render(<PasswordField label="Password" colors={mockColors} />);
    const input = screen.getByPlaceholderText("Votre mot de passe");
    const toggleButton = screen.getByRole("button");

    // Default: password hidden
    expect(input).toHaveAttribute("type", "password");
    
    // Click to show
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");
    
    // Click to hide
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("calls onChange when typing", () => {
    const handleChange = jest.fn();
    render(
      <PasswordField
        label="Password"
        colors={mockColors}
        onChange={handleChange}
      />
    );
    const input = screen.getByPlaceholderText("Votre mot de passe");
    fireEvent.change(input, { target: { value: "secret" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("renders with value (controlled)", () => {
    const handleChange = jest.fn();
    render(
      <PasswordField
        label="Password"
        colors={mockColors}
        value="mySecretValue"
        onChange={handleChange}
      />
    );
    const input = screen.getByDisplayValue("mySecretValue");
    expect(input).toBeInTheDocument();
  });

  it("passes required, hint, and error props correctly", () => {
    // Test render with error (hint should be hidden)
    const { rerender } = render(
      <PasswordField
        label="Password"
        colors={mockColors}
        required={true}
        hint="My Hint"
        error="My Error"
      />
    );

    // Required asterisk (implementation dependent, based on FormField)
    expect(screen.getByText("*")).toBeInTheDocument();
    
    // Error message
    expect(screen.getByText("My Error")).toBeInTheDocument();
    // Hint should not be visible when error is present (based on FormField logic)
    expect(screen.queryByText("My Hint")).not.toBeInTheDocument();

    // Rerender without error to see hint
    rerender(
      <PasswordField
        label="Password"
        colors={mockColors}
        required={true}
        hint="My Hint"
        error={undefined}
      />
    );
    expect(screen.getByText("My Hint")).toBeInTheDocument();
  });
});
