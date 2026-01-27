import RegisterPage from "@/app/register/page";
import { authService } from "@/auth";
import * as themeHook from "@/theme/useColorTheme";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Role } from "@yozu/contracts";
import * as navigation from "next/navigation";

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: jest.fn(),
}));

describe("RegisterPage", () => {
  let user: ReturnType<typeof userEvent.setup>;
  let registerSpy: jest.SpyInstance;
  let useColorThemeMock: jest.Mock;
  let useRouterMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();

    // Setup Mocks and Spies
    useRouterMock = navigation.useRouter as jest.Mock;
    useColorThemeMock = themeHook.useColorTheme as jest.Mock;

    useRouterMock.mockReturnValue({
      replace: mockReplace,
      push: jest.fn(),
      prefetch: jest.fn(),
    });

    useColorThemeMock.mockReturnValue({
      colorScheme: "light",
      isDarkColorScheme: false,
      setColorScheme: jest.fn(),
      toggleColorScheme: jest.fn(),
    });

    // We can use SpyInstance on authService because it's an object we control
    registerSpy = jest.spyOn(authService, "register");
  });

  afterEach(() => {
    registerSpy.mockRestore();
  });

  describe("Rendering", () => {
    it("should render the registration title and subtitle", () => {
      render(<RegisterPage />);
      expect(screen.getByText("Créer un compte")).toBeInTheDocument();
      expect(
        screen.getByText("Rejoignez-nous dès aujourd'hui"),
      ).toBeInTheDocument();
    });

    it("should display all required input fields", () => {
      render(<RegisterPage />);
      expect(
        screen.getByPlaceholderText(/email@exemple.com/i),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Créez un mot de passe/i),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("06 12 34 56 78")).toBeInTheDocument();
    });

    it("should display role selection options", () => {
      render(<RegisterPage />);
      expect(
        screen.getByRole("button", { name: Role.STUDENT }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: Role.COMPANY }),
      ).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should show an error message if fields are empty on submission", async () => {
      render(<RegisterPage />);
      const submitBtn = screen.getByRole("button", { name: /S'inscrire/i });
      await user.click(submitBtn);

      expect(
        screen.getByText("Veuillez remplir tous les champs"),
      ).toBeInTheDocument();
      expect(registerSpy).not.toHaveBeenCalled();
    });

    it("should show an email validation error for invalid email format", async () => {
      render(<RegisterPage />);

      await user.type(
        screen.getByPlaceholderText(/email@exemple.com/i),
        "invalid-email",
      );
      await user.type(
        screen.getByPlaceholderText(/Créez un mot de passe/i),
        "Password123!",
      );
      await user.type(
        screen.getByPlaceholderText("06 12 34 56 78"),
        "0612345678",
      );
      await user.click(screen.getByRole("button", { name: Role.STUDENT }));

      await user.click(screen.getByRole("button", { name: /S'inscrire/i }));

      await user.tab(); // trigger blur

      expect(
        await screen.findByText(/Adresse email invalide/i),
      ).toBeInTheDocument();
    });
  });

  describe("Authentication Logic (Unit Tests / Backend Mocking)", () => {
    it("should call authService.register with correct data and redirect a student", async () => {
      registerSpy.mockResolvedValue({
        accessToken: "abc",
        refreshToken: "def",
      });
      render(<RegisterPage />);

      await user.type(
        screen.getByPlaceholderText(/email@exemple.com/i),
        "student@test.com",
      );
      await user.type(
        screen.getByPlaceholderText(/Créez un mot de passe/i),
        "Password123!",
      );
      await user.type(
        screen.getByPlaceholderText("06 12 34 56 78"),
        "0612345678",
      );

      // Select role
      await user.click(screen.getByRole("button", { name: Role.STUDENT }));

      await user.click(screen.getByRole("button", { name: /S'inscrire/i }));

      await waitFor(() => {
        expect(registerSpy).toHaveBeenCalledWith(
          "student@test.com",
          "Password123!",
          "0612345678",
          Role.STUDENT,
        );
        expect(mockReplace).toHaveBeenCalledWith("/onboarding/student");
      });
    });

    it("should call authService.register and redirect a company", async () => {
      registerSpy.mockResolvedValue({
        accessToken: "abc",
        refreshToken: "def",
      });
      render(<RegisterPage />);

      await user.type(
        screen.getByPlaceholderText(/email@exemple.com/i),
        "company@test.com",
      );
      await user.type(
        screen.getByPlaceholderText(/Créez un mot de passe/i),
        "Password123!",
      );
      await user.type(
        screen.getByPlaceholderText("06 12 34 56 78"),
        "0612345678",
      );

      // Select role
      await user.click(screen.getByRole("button", { name: Role.COMPANY }));

      await user.click(screen.getByRole("button", { name: /S'inscrire/i }));

      await waitFor(() => {
        expect(registerSpy).toHaveBeenCalledWith(
          "company@test.com",
          "Password123!",
          "0612345678",
          Role.COMPANY,
        );
        expect(mockReplace).toHaveBeenCalledWith("/onboarding/company");
      });
    });

    it("should display a specific error message if registration fails", async () => {
      const errorMessage = "Cet email est déjà utilisé";
      registerSpy.mockRejectedValue(new Error(errorMessage));
      render(<RegisterPage />);

      await user.type(
        screen.getByPlaceholderText(/email@exemple.com/i),
        "existing@test.com",
      );
      await user.type(
        screen.getByPlaceholderText(/Créez un mot de passe/i),
        "Password123!",
      );
      await user.type(
        screen.getByPlaceholderText("06 12 34 56 78"),
        "0612345678",
      );
      await user.click(screen.getByRole("button", { name: Role.STUDENT }));

      await user.click(screen.getByRole("button", { name: /S'inscrire/i }));

      expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe("UI Interactions", () => {
    it("should toggle password visibility when clicking the visibility icon", async () => {
      render(<RegisterPage />);
      const passwordInput = screen.getByPlaceholderText(
        /Créez un mot de passe/i,
      );
      expect(passwordInput).toHaveAttribute("type", "password");

      // Find the visibility icon button (it has an svg)
      const buttons = screen.getAllByRole("button");
      const visibilityToggle = buttons.find((b) => b.querySelector("svg"));

      if (visibilityToggle) {
        await user.click(visibilityToggle);
        expect(passwordInput).toHaveAttribute("type", "text");
        await user.click(visibilityToggle);
        expect(passwordInput).toHaveAttribute("type", "password");
      }
    });
  });
});
