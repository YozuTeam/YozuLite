import { render, screen } from "@testing-library/react";
import OnboardingLayout from "../layout";
import { useColorTheme } from "@/theme/useColorTheme";

// Mock useColorTheme
jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: jest.fn(),
}));

describe("OnboardingLayout", () => {
  it("renders the header and children in light mode", () => {
    (useColorTheme as jest.Mock).mockReturnValue({
      colorScheme: "light",
    });

    render(
      <OnboardingLayout>
        <div data-testid="child-content">Child Content</div>
      </OnboardingLayout>
    );

    // Check for Header content
    expect(screen.getByText("YOZU")).toBeInTheDocument();
    expect(screen.getByText("Y")).toBeInTheDocument();

    // Check for Children
    expect(screen.getByTestId("child-content")).toBeInTheDocument();

    // Check for light mode specific style (partial check)
    const header = screen.getByRole("banner"); // MUI Box using component="header" should correspond to banner role
    expect(header).toHaveStyle("background-color: rgba(255, 255, 255, 0.8)");
  });

  it("renders correctly in dark mode", () => {
    (useColorTheme as jest.Mock).mockReturnValue({
      colorScheme: "dark",
    });

    render(
      <OnboardingLayout>
        <div>Dark Mode Child</div>
      </OnboardingLayout>
    );

    const header = screen.getByRole("banner");
    // Check for dark mode specific style
    expect(header).toHaveStyle("background-color: rgba(23, 23, 23, 0.8)");
  });
});
