import { render, screen, fireEvent } from "@testing-library/react";
import SelectOverlay from "../SelectOverlay";
import { useColorTheme } from "@/theme/useColorTheme";

// Mock useColorTheme
jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: jest.fn(),
}));

describe("SelectOverlay", () => {
  const mockOnClose = jest.fn();
  const mockOnSelect = jest.fn();
  const options = ["Option 1", "Option 2", "Another Option"];

  beforeEach(() => {
    jest.clearAllMocks();
    (useColorTheme as jest.Mock).mockReturnValue({
      colorScheme: "light", 
    });
  });

  it("renders correctly with options", () => {
    render(
      <SelectOverlay
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={options}
        selectedValue=""
      />
    );

    expect(screen.getByLabelText("Rechercher")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Another Option")).toBeInTheDocument();
  });

  it("filters options based on search input", () => {
    render(
      <SelectOverlay
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={options}
        selectedValue=""
      />
    );

    const searchInput = screen.getByLabelText("Rechercher");
    fireEvent.change(searchInput, { target: { value: "Another" } });

    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
    expect(screen.getByText("Another Option")).toBeInTheDocument();
  });

  it("calls onSelect and onClose when an option is clicked", () => {
    render(
      <SelectOverlay
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={options}
        selectedValue=""
      />
    );

    fireEvent.click(screen.getByText("Option 1"));

    expect(mockOnSelect).toHaveBeenCalledWith("Option 1");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when the backdrop is clicked", () => {
    render(
      <SelectOverlay
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={options}
        selectedValue=""
      />
    );

    // The backdrop is the first element with the specified style or we can find it by specific attributes?
    // Looking at the code: 
    // <Box onClick={onClose} sx={{ position: "absolute", inset: 0, ... }} />
    // It's a bit hard to select blindly. But it is an absolute positioned Box handling the click.
    // It's the sibling of the content box.
    // We can rely on implementation detail or try to find by specific styling/class if possible, 
    // or we can assume it's one of the divs.
    
    // A more robust way might be to check if the root container has click listener? 
    // Actually the code structure is:
    // Box (Fixed wrapper)
    //   -> Box (Backdrop, onClick=onClose)
    //   -> Box (Content, onClick=stopProp)

    // Let's try to click the 'wrapper' or backdrop.
    // Since the backdrop covers everything (inset 0), we can try to find it.
    // However, the content is ON TOP of it (Index 1).
    // Let's render and inspect rendering structure conceptually.
    
    // We can use a testId in the component or select by class/style.
    // Given I can't modify the component right now unless strictly needed, 
    // I check if I can select it.
    // It has `backgroundColor: "rgba(0,0,0,0.45)"`.
    
    // Let's modify the component slightly to add data-testid if needed? 
    // The user asked to improve the TEST, not necessarily the code, but coverage usually implies running code.
    // If I can't click it easily, I might miss that branch.
    // The backdrop is the first child of the root.
    
    // Let's try to find it via having NO text content?
    // Or we can just click rendering container? No, that's "Fixed wrapper".
    
    // Let's assume the render returns the container.
    // container.firstChild.firstChild might be the backdrop.
    
    const { container } = render(
        <SelectOverlay
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={options}
        selectedValue=""
      />
    );
    
    // Root is the fixed box (MUI render might wrap it).
    // container.firstChild is the Fixed Box.
    // inside it: Backdrop Box, Content Box.
    const fixedBox = container.firstChild as HTMLElement;
    const backdrop = fixedBox.childNodes[0] as HTMLElement; // First child is backdrop
    
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("does not call onClose when the content is clicked (propagation check)", () => {
    render(
      <SelectOverlay
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={options}
        selectedValue=""
      />
    );

    const searchInput = screen.getByLabelText("Rechercher");
    // Clicking inside the content (e.g., the input) should stop propagation to backdrop
    fireEvent.click(searchInput);

    expect(mockOnClose).not.toHaveBeenCalled();
  });
  
  it("highlights the selected value", () => {
     render(
      <SelectOverlay
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        options={options}
        selectedValue="Option 1"
      />
    );
    
    // Option 1 should have primary color background alpha
    // Option 2 should be transparent
    
    // We can check this by verifying style or computing style.
    const option1 = screen.getByText("Option 1").closest('div'); // The box wrapper
    const option2 = screen.getByText("Option 2").closest('div');
    
    expect(option1).not.toHaveStyle({ backgroundColor: "transparent" });
    // Wait, we mocked useColorTheme. We don't know the exact color value in NAV_THEME.
    // We know useColorTheme returns 'light'. 
    // Ideally we should mock NAV_THEME or just check it's NOT transparent.
    
    expect(option1).not.toHaveStyle({ backgroundColor: "transparent" });
    expect(option2).toHaveStyle({ backgroundColor: "transparent" });
  });
});
