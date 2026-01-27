import * as ThemeHook from "@/theme/useColorTheme";
import { render, screen, waitFor } from "@testing-library/react";
import { Role } from "@yozu/contracts";
import * as Navigation from "next/navigation";
import { AuthGuard } from "../components/AuthGuard";
import * as AuthContextModule from "../contexts/AuthContext";

// Mocks
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: jest.fn(),
}));

describe("AuthGuard", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (Navigation.useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });

    (ThemeHook.useColorTheme as jest.Mock).mockReturnValue({
      colorScheme: "light",
    });
  });

  it("should render loading state when authentication status is null", () => {
    (AuthContextModule.useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: null,
      isOnboarded: null,
      role: null,
    });

    render(
      <AuthGuard>
        <div data-testid="child">Child Content</div>
      </AuthGuard>,
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
  });

  it("should redirect to login if not authenticated", async () => {
    (AuthContextModule.useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isOnboarded: null,
      role: null,
    });

    render(
      <AuthGuard>
        <div data-testid="child">Child Content</div>
      </AuthGuard>,
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/login");
    });
    // Should still show loader or nothing while redirecting
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
  });

  it("should redirect to student onboarding if authenticated but not onboarded (student)", async () => {
    (AuthContextModule.useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isOnboarded: false,
      role: Role.STUDENT,
    });

    render(
      <AuthGuard>
        <div data-testid="child">Child Content</div>
      </AuthGuard>,
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/onboarding/student");
    });
  });

  it("should redirect to company onboarding if authenticated but not onboarded (company)", async () => {
    (AuthContextModule.useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isOnboarded: false,
      role: Role.COMPANY,
    });

    render(
      <AuthGuard>
        <div data-testid="child">Child Content</div>
      </AuthGuard>,
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/onboarding/company");
    });
  });

  it("should render children if authenticated and onboarded", () => {
    (AuthContextModule.useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isOnboarded: true,
      role: Role.STUDENT,
    });

    render(
      <AuthGuard>
        <div data-testid="child">Child Content</div>
      </AuthGuard>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
