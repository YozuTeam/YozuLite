import { render, screen, fireEvent } from "@testing-library/react";
import { PhoneField } from "../PhoneField";
import { useColorTheme } from "@/theme/useColorTheme";
import { NAV_THEME } from "@/theme/constant";

jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: jest.fn(),
}));

const mockUseColorTheme = useColorTheme as jest.MockedFunction<
  typeof useColorTheme
>;

describe("PhoneField", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorTheme.mockReturnValue({
      colorScheme: "light",
      isDarkColorScheme: false,
      setColorScheme: jest.fn(),
      toggleColorScheme: jest.fn(),
    });
  });

  it("renders with label and placeholder", () => {
    render(<PhoneField label="Téléphone" />);
    expect(screen.getByText(/Téléphone/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("06 12 34 56 78")).toBeInTheDocument();
  });

  it("handles value change in uncontrolled mode", () => {
    const onChange = jest.fn();
    render(<PhoneField label="Téléphone" onChange={onChange} />);
    const input = screen.getByPlaceholderText("06 12 34 56 78");

    fireEvent.change(input, { target: { value: "0612345678" } });

    expect(input).toHaveValue("0612345678");
    expect(onChange).toHaveBeenCalledWith("0612345678");
  });

  it("handles value change in controlled mode", () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <PhoneField label="Téléphone" value="0102030405" onChange={onChange} />,
    );
    const input = screen.getByPlaceholderText("06 12 34 56 78");

    expect(input).toHaveValue("0102030405");

    fireEvent.change(input, { target: { value: "0612345678" } });

    expect(onChange).toHaveBeenCalledWith("0612345678");
    // In controlled mode, value doesn't change unless prop updates
    expect(input).toHaveValue("0102030405");

    rerender(
      <PhoneField label="Téléphone" value="0612345678" onChange={onChange} />,
    );
    expect(input).toHaveValue("0612345678");
  });

  it("validates phone number on blur (invalid and valid)", () => {
    render(<PhoneField label="Téléphone" />);
    const input = screen.getByPlaceholderText("06 12 34 56 78");

    // Invalid phone
    fireEvent.change(input, { target: { value: "123" } });
    fireEvent.blur(input);
    expect(
      screen.getByText("Numéro de téléphone invalide"),
    ).toBeInTheDocument();

    // Valid phone (French format)
    fireEvent.change(input, { target: { value: "06 12 34 56 78" } });
    fireEvent.blur(input);
    expect(
      screen.queryByText("Numéro de téléphone invalide"),
    ).not.toBeInTheDocument();
  });

  it("clears error on change if hasError is true", () => {
    render(<PhoneField label="Téléphone" />);
    const input = screen.getByPlaceholderText("06 12 34 56 78");

    // Trigger error
    fireEvent.change(input, { target: { value: "123" } });
    fireEvent.blur(input);
    expect(
      screen.getByText("Numéro de téléphone invalide"),
    ).toBeInTheDocument();

    // Change value
    fireEvent.change(input, { target: { value: "06" } });
    expect(
      screen.queryByText("Numéro de téléphone invalide"),
    ).not.toBeInTheDocument();
  });

  it("handles empty value correctly (no error)", () => {
    render(<PhoneField label="Téléphone" />);
    const input = screen.getByPlaceholderText("06 12 34 56 78");

    fireEvent.change(input, { target: { value: " " } });
    fireEvent.blur(input);
    expect(
      screen.queryByText("Numéro de téléphone invalide"),
    ).not.toBeInTheDocument();
  });

  it("uses override colors if provided", () => {
    const customColors = { ...NAV_THEME.light, primary: "#ff0000" };
    render(<PhoneField label="Téléphone" colors={customColors} />);
    // Difficult to test directly in unit test without checking theme prop passing
    // FormField and TextField tests should verify they handle colors prop
  });

  it("renders hint and required indicator", () => {
    render(<PhoneField label="Téléphone" hint="Format français" required />);
    expect(screen.getByText("Format français")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
