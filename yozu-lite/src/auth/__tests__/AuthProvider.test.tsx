import { render, screen, waitFor } from "@testing-library/react";
import { Role } from "@yozu/contracts";
import * as navigation from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { AuthProvider } from "../providers/AuthProvider";
import { authService } from "../services";
import * as storage from "../storage";
import * as utils from "../utils";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../services");
jest.mock("../storage");
jest.mock("../utils");

const TestComponent = () => {
  const { isAuthenticated, role, isOnboarded, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth">
        {isAuthenticated === null ? "loading" : isAuthenticated.toString()}
      </div>
      <div data-testid="role">{role || "null"}</div>
      <div data-testid="onboarded">
        {isOnboarded === null ? "loading" : isOnboarded.toString()}
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthProvider", () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (navigation.useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  it("should set unauthenticated if no tokens exist", async () => {
    (storage.getAccessToken as jest.Mock).mockReturnValue(null);
    (storage.getRefreshToken as jest.Mock).mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth")).toHaveTextContent("false");
      expect(screen.getByTestId("role")).toHaveTextContent("null");
    });
  });

  it("should authenticate if valid access token exists", async () => {
    (storage.getAccessToken as jest.Mock).mockReturnValue("valid-token");
    (utils.isTokenExpired as jest.Mock).mockReturnValue(false);
    (utils.parseJwt as jest.Mock).mockReturnValue({ role: Role.STUDENT });
    (authService.getOnboardingStatus as jest.Mock).mockResolvedValue(true);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth")).toHaveTextContent("true");
      expect(screen.getByTestId("role")).toHaveTextContent(Role.STUDENT);
      expect(screen.getByTestId("onboarded")).toHaveTextContent("true");
    });
  });

  it("should try refreshing if access token is expired but refresh token is valid", async () => {
    (storage.getAccessToken as jest.Mock).mockReturnValue("expired-token");
    (storage.getRefreshToken as jest.Mock).mockReturnValue("valid-refresh");
    (utils.isTokenExpired as jest.Mock).mockImplementation(
      (token: string) => token === "expired-token",
    );
    (authService.refreshAccessToken as jest.Mock).mockResolvedValue({
      accessToken: "new-token",
    });
    (utils.parseJwt as jest.Mock).mockReturnValue({ role: Role.COMPANY });
    (authService.getOnboardingStatus as jest.Mock).mockResolvedValue(false);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(authService.refreshAccessToken).toHaveBeenCalled();
      expect(screen.getByTestId("auth")).toHaveTextContent("true");
      expect(screen.getByTestId("role")).toHaveTextContent(Role.COMPANY);
      expect(screen.getByTestId("onboarded")).toHaveTextContent("false");
    });
  });

  it("should fail auth if refresh token fails", async () => {
    (storage.getAccessToken as jest.Mock).mockReturnValue("expired-token");
    (storage.getRefreshToken as jest.Mock).mockReturnValue("valid-refresh");
    (utils.isTokenExpired as jest.Mock).mockImplementation(
      (token: string) => token === "expired-token",
    );
    (authService.refreshAccessToken as jest.Mock).mockResolvedValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(authService.refreshAccessToken).toHaveBeenCalled();
      expect(screen.getByTestId("auth")).toHaveTextContent("false");
      expect(screen.getByTestId("role")).toHaveTextContent("null");
    });
  });

  it("should fail auth if refresh token is also expired", async () => {
    (storage.getAccessToken as jest.Mock).mockReturnValue("expired-token");
    (storage.getRefreshToken as jest.Mock).mockReturnValue("expired-refresh");
    (utils.isTokenExpired as jest.Mock).mockReturnValue(true);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(authService.refreshAccessToken).not.toHaveBeenCalled();
      expect(screen.getByTestId("auth")).toHaveTextContent("false");
      expect(screen.getByTestId("role")).toHaveTextContent("null");
    });
  });

  it("should logout correctly", async () => {
    (storage.getAccessToken as jest.Mock).mockReturnValue(null);
    (storage.getRefreshToken as jest.Mock).mockReturnValue(null);

    const spyRemove = jest.spyOn(Storage.prototype, "removeItem");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    const logoutBtn = screen.getByText("Logout");
    logoutBtn.click();

    expect(spyRemove).toHaveBeenCalledWith("accessToken");
    expect(spyRemove).toHaveBeenCalledWith("refreshToken");
    expect(mockReplace).toHaveBeenCalledWith("/login");

    spyRemove.mockRestore();
  });
});
