import * as themeHook from "@/theme/useColorTheme";
import { render, screen } from "@testing-library/react";
import OnboardingLayout from "../layout";

jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: jest.fn(),
}));

jest.mock("@/auth", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("OnboardingLayout", () => {
  let useColorThemeMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    useColorThemeMock = themeHook.useColorTheme as jest.Mock;
  });

  it("renders the header and children in light mode", () => {
    useColorThemeMock.mockReturnValue({
      colorScheme: "light",
    });

    render(
      <OnboardingLayout>
        <div data-testid="child-content">Child Content</div>
      </OnboardingLayout>,
    );

    expect(screen.getByText("YOZU")).toBeInTheDocument();
    expect(screen.getByText("Y")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();

    const header = screen.getByRole("banner");
    expect(header).toHaveStyle("background-color: rgba(255, 255, 255, 0.8)");
  });

  it("renders correctly in dark mode", () => {
    useColorThemeMock.mockReturnValue({
      colorScheme: "dark",
    });

    render(
      <OnboardingLayout>
        <div>Dark Mode Child</div>
      </OnboardingLayout>,
    );

    const header = screen.getByRole("banner");
    expect(header).toHaveStyle("background-color: rgba(23, 23, 23, 0.8)");
  });
});
