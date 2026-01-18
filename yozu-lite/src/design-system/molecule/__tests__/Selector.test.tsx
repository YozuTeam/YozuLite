import { render, screen, fireEvent } from "@testing-library/react";
import { Selector } from "../Selector";
import { useColorTheme } from "@/theme/useColorTheme";

// Mock useColorTheme
jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: jest.fn(),
}));

describe("Selector", () => {
  const mockSetSelectedValues = jest.fn();
  const options = [{ value: "Option 1" }, { value: "Option 2" }, { value: "Option 3" }];

  beforeEach(() => {
    jest.clearAllMocks();
    (useColorTheme as jest.Mock).mockReturnValue({
      colorScheme: "light",
    });
  });

  it("renders label and options", () => {
    render(
      <Selector
        label="Test Selector"
        options={options}
        selectedValues={[]}
        setSelectedValues={mockSetSelectedValues}
      />
    );

    expect(screen.getByText("Test Selector")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Option 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Option 2" })).toBeInTheDocument();
  });

  it("handles selection in multiple mode (default behavior is usually multiple if not specified? check implementation)", () => {
    // Implementation: const isMultiple = props.multiple !== false;
    // So default IS multiple.
    
    render(
      <Selector
        label="Test Selector"
        options={options}
        selectedValues={[]}
        setSelectedValues={mockSetSelectedValues}
      />
    );

    const btn1 = screen.getByRole("button", { name: "Option 1" });
    fireEvent.click(btn1);
    
    expect(mockSetSelectedValues).toHaveBeenCalledWith(["Option 1"]);
  });

  it("handles deselection in multiple mode", () => {
    render(
      <Selector
        label="Test Selector"
        options={options}
        selectedValues={["Option 1"]}
        setSelectedValues={mockSetSelectedValues}
      />
    );

    const btn1 = screen.getByRole("button", { name: "Option 1" });
    fireEvent.click(btn1);
    
    expect(mockSetSelectedValues).toHaveBeenCalledWith([]);
  });

  it("handles selection in single mode", () => {
    // Implementation: if (!isMultiple) props.setSelectedValues(selected ? [] : [opt.value]);
    
    render(
      <Selector
        label="Test Selector"
        options={options}
        selectedValues={["Option 1"]}
        setSelectedValues={mockSetSelectedValues}
        multiple={false}
      />
    );
    
    // Selecting another option should replace the current one (actually implementation says [opt.value], it doesn't merge)
    // Wait, implementation:
    // props.setSelectedValues(selected ? [] : [opt.value]);
    // It ignores current selectedValues (except for checking if clicked one is selected).
    // so if I click Option 2, it sends ["Option 2"]. Correct for single select.
    
    const btn2 = screen.getByRole("button", { name: "Option 2" });
    fireEvent.click(btn2);
    
    expect(mockSetSelectedValues).toHaveBeenCalledWith(["Option 2"]);
  });
  
  it("handles deselection in single mode", () => {
      render(
      <Selector
        label="Test Selector"
        options={options}
        selectedValues={["Option 1"]}
        setSelectedValues={mockSetSelectedValues}
        multiple={false}
      />
    );
    
    const btn1 = screen.getByRole("button", { name: "Option 1" });
    fireEvent.click(btn1);
    
    expect(mockSetSelectedValues).toHaveBeenCalledWith([]);
  });

  it("calls onFocus when clicked", () => {
    const mockOnFocus = jest.fn();
    render(
      <Selector
        label="Test Selector"
        options={options}
        selectedValues={[]}
        setSelectedValues={mockSetSelectedValues}
        onFocus={mockOnFocus}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Option 1" }));
    expect(mockOnFocus).toHaveBeenCalled();
  });
  
  it("shows error text when error prop is true", () => {
      render(
      <Selector
        label="Test Selector"
        options={options}
        selectedValues={[]}
        setSelectedValues={mockSetSelectedValues}
        error={true}
      />
    );
    
    // Expect FormField to show errorText="Veuillez sélectionner au moins une option"
    expect(screen.getByText("Veuillez sélectionner au moins une option")).toBeInTheDocument();
  });
});
