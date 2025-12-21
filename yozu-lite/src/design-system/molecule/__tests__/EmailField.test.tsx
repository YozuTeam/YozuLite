import { render, screen, fireEvent } from "@testing-library/react";
import { EmailField } from "../EmailField";
import { NAV_THEME } from "@/theme/constant";

describe("EmailField", () => {
  it("renders correctly with label", () => {
    render(<EmailField label="Email Address" colors={NAV_THEME.light} />);
    expect(screen.getByText("Email Address")).toBeInTheDocument();
  });

  it("validates email format", () => {
    render(<EmailField label="Email" colors={NAV_THEME.light} />);
    const input = screen.getByPlaceholderText("email@exemple.com");

    fireEvent.change(input, { target: { value: "invalid-email" } });
    expect(screen.getByText("Adresse email invalide")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "test@example.com" } });
    expect(screen.queryByText("Adresse email invalide")).not.toBeInTheDocument();
  });

  it("calls onChange prop", () => {
    const handleChange = jest.fn();
    render(<EmailField label="Email" colors={NAV_THEME.light} onChange={handleChange} />);
    const input = screen.getByPlaceholderText("email@exemple.com");

    fireEvent.change(input, { target: { value: "a" } });
    expect(handleChange).toHaveBeenCalledWith("a");
  });
  it("renders correctly without colors prop", () => {
    render(<EmailField label="No Colors" />);
    expect(screen.getByText("No Colors")).toBeInTheDocument();
  });
});
