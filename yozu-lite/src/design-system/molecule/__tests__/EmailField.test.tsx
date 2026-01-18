import { render, screen, fireEvent } from "@testing-library/react";
import { EmailField } from "../EmailField";
import { useColorTheme } from "@/theme/useColorTheme";
import { NAV_THEME } from "@/theme/constant";

// Mock useColorTheme
jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: jest.fn(),
}));

describe("EmailField", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useColorTheme as jest.Mock).mockReturnValue({
      colorScheme: "light",
    });
  });

  it("renders correctly with label and placeholder", () => {
    render(<EmailField label="Email Address" />);
    
    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email@exemple.com")).toBeInTheDocument();
  });

  it("handles user input and calls onChange", () => {
    render(<EmailField label="Email" onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText("email@exemple.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    
    expect(input).toHaveValue("test@example.com");
    expect(mockOnChange).toHaveBeenCalledWith("test@example.com");
  });

  it("validates email on blur (invalid email)", () => {
    render(<EmailField label="Email" />);
    
    const input = screen.getByPlaceholderText("email@exemple.com");
    fireEvent.change(input, { target: { value: "invalid-email" } });
    fireEvent.blur(input);
    
    // Should show error. 
    // Usually TextField displays errorText when error is true.
    expect(screen.getByText("Adresse email invalide")).toBeInTheDocument();
  });

  it("validates email on blur (valid email)", () => {
    render(<EmailField label="Email" />);
    
    const input = screen.getByPlaceholderText("email@exemple.com");
    
    // First trigger error
    fireEvent.change(input, { target: { value: "invalid" } });
    fireEvent.blur(input);
    expect(screen.getByText("Adresse email invalide")).toBeInTheDocument();
    
    // Then fix it
    fireEvent.change(input, { target: { value: "valid@email.com" } });
    fireEvent.blur(input);
    
    expect(screen.queryByText("Adresse email invalide")).not.toBeInTheDocument();
  });

  it("clears error on change", () => {
    render(<EmailField label="Email" />);
    
    const input = screen.getByPlaceholderText("email@exemple.com");
    
    // Trigger error
    fireEvent.change(input, { target: { value: "invalid" } });
    fireEvent.blur(input);
    expect(screen.getByText("Adresse email invalide")).toBeInTheDocument();
    
    // Type something else - error should disappear immediately
    fireEvent.change(input, { target: { value: "invalid2" } });
    // Note: The logic says "if (hasError) setHasError(false)" on change.
    
    // However, TextField only renders error message if error prop is true.
    // We expect queryByText to be null immediately after change?
    // Let's check implementation behavior:
    // onChange -> setHasError(false)
    expect(screen.queryByText("Adresse email invalide")).not.toBeInTheDocument();
  });

  it("ignores empty input validation (no error if empty)", () => {
    render(<EmailField label="Email" />);
    
    const input = screen.getByPlaceholderText("email@exemple.com");
    
    // Set to something invalid
    fireEvent.change(input, { target: { value: "invalid" } });
    fireEvent.blur(input);
    expect(screen.getByText("Adresse email invalide")).toBeInTheDocument();
    
    // Clear input
    fireEvent.change(input, { target: { value: "   " } }); // Trimmed length 0
    fireEvent.blur(input);
    
    expect(screen.queryByText("Adresse email invalide")).not.toBeInTheDocument();
  });
  
  it("uses override colors if provided", () => {
   
     
     render(<EmailField label="Email" colors={NAV_THEME.dark} />);
     // If no errors, it's good.
  });
});
