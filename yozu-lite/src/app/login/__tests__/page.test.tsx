import LoginPage from "@/app/login/page";
import { authService } from "@/auth";
import * as themeHook from "@/theme/useColorTheme";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as navigation from "next/navigation";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: jest.fn(),
}));

describe("LoginPage", () => {
  let user: ReturnType<typeof userEvent.setup>;
  let loginSpy: jest.SpyInstance;
  let useColorThemeMock: jest.Mock;
  let useRouterMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();

    useRouterMock = navigation.useRouter as jest.Mock;
    useColorThemeMock = themeHook.useColorTheme as jest.Mock;

    useRouterMock.mockReturnValue({
      replace: mockReplace,
    });

    useColorThemeMock.mockReturnValue({
      colorScheme: "light",
      isDarkColorScheme: false,
    });

    loginSpy = jest.spyOn(authService, "login");
  });

  afterEach(() => {
    loginSpy.mockRestore();
  });

  describe("Rendering", () => {
    it("should render the login title and fields", () => {
      render(<LoginPage />);
      expect(screen.getByText("Bienvenue")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/email@exemple.com/i),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Votre mot de passe/i),
      ).toBeInTheDocument();
    });

    it("should contain a link to the registration page", () => {
      render(<LoginPage />);
      const link = screen.getByRole("link", { name: /Créer un compte/i });
      expect(link).toHaveAttribute("href", "/register");
    });
  });

  describe("Form Validation", () => {
    it("should display an error if fields are empty", async () => {
      render(<LoginPage />);
      const button = screen.getByRole("button", { name: /Se connecter/i });
      await user.click(button);

      expect(
        screen.getByText("Veuillez remplir tous les champs"),
      ).toBeInTheDocument();
      expect(loginSpy).not.toHaveBeenCalled();
    });

    it("should show an email validation error for invalid email format", async () => {
      render(<LoginPage />);
      const emailInput = screen.getByPlaceholderText(/email@exemple.com/i);

      await user.type(emailInput, "invalid-email");
      await user.tab();

      expect(
        await screen.findByText("Adresse email invalide"),
      ).toBeInTheDocument();
    });
  });

  describe("Authentication Logic", () => {
    it("should call authService.login and redirect on success", async () => {
      loginSpy.mockResolvedValue({ accessToken: "token" });
      render(<LoginPage />);

      await user.type(
        screen.getByPlaceholderText(/email@exemple.com/i),
        "test@example.com",
      );
      await user.type(
        screen.getByPlaceholderText(/Votre mot de passe/i),
        "Password123",
      );

      await user.click(screen.getByRole("button", { name: /Se connecter/i }));

      await waitFor(() => {
        expect(loginSpy).toHaveBeenCalledWith(
          "test@example.com",
          "Password123",
        );
        expect(mockReplace).toHaveBeenCalledWith("/yozu-lite/accueil");
      });
    });

    it("should display an error message if login fails", async () => {
      const errorMessage = "Identifiants invalides";
      loginSpy.mockRejectedValue(new Error(errorMessage));
      render(<LoginPage />);

      await user.type(
        screen.getByPlaceholderText(/email@exemple.com/i),
        "test@example.com",
      );
      await user.type(
        screen.getByPlaceholderText(/Votre mot de passe/i),
        "wrong-password",
      );

      await user.click(screen.getByRole("button", { name: /Se connecter/i }));

      expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    });
  });
});
