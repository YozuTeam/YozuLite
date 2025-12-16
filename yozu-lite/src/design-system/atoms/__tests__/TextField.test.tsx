import { render, screen, fireEvent } from "@testing-library/react";
import TextField from "../TextField";

describe("TextField", () => {
  const defaultColors = {
    background: "#ffffff",
    text: "#000000",
    border: "#cccccc",
    primary: "#0000ff",
    mutedForeground: "#888888",
    notification: "#ff0000",
  };

  it("renders correctly", () => {
    render(<TextField colors={defaultColors} label="Test Label" />);
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("renders placeholder", () => {
    render(
      <TextField colors={defaultColors} placeholder="Enter text" />
    );
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("handles value change", () => {
    const handleChange = jest.fn();
    render(
      <TextField
        colors={defaultColors}
        value=""
        onChange={handleChange}
        label="Input"
      />
    );
    fireEvent.change(screen.getByLabelText("Input"), {
      target: { value: "New Value" },
    });
    expect(handleChange).toHaveBeenCalled();
  });

  it("displays error state", () => {
    render(
      <TextField
        colors={defaultColors}
        error
        helperText="Error message"
        label="Error Input"
      />
    );
    expect(screen.getByText("Error message")).toBeInTheDocument();
    expect(screen.getByText("Error message")).toHaveClass("Mui-error");
  });

  it("renders disabled state", () => {
    render(<TextField colors={defaultColors} disabled label="Disabled" />);
    expect(screen.getByLabelText("Disabled")).toBeDisabled();
  });
});
