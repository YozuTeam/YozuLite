import AccueilPage from "@/app/yozu-lite/accueil/page";
import * as authModule from "@/auth";
import { api } from "@/auth/api";
import * as themeHook from "@/theme/useColorTheme";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Role } from "@yozu/contracts";

jest.mock("@/auth", () => ({
  ...jest.requireActual("@/auth"),
  useAuth: jest.fn(),
}));

jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: jest.fn(),
}));

describe("AccueilPage", () => {
  let user: ReturnType<typeof userEvent.setup>;
  let callApiSpy: jest.SpyInstance;
  let useAuthMock: jest.Mock;
  let useColorThemeMock: jest.Mock;
  let logoutMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();

    useAuthMock = authModule.useAuth as jest.Mock;
    useColorThemeMock = themeHook.useColorTheme as jest.Mock;
    logoutMock = jest.fn();

    useColorThemeMock.mockReturnValue({
      colorScheme: "light",
      isDarkColorScheme: false,
    });

    useAuthMock.mockReturnValue({
      role: Role.STUDENT,
      logout: logoutMock,
    });

    callApiSpy = jest.spyOn(api, "callAPI");
  });

  afterEach(() => {
    callApiSpy.mockRestore();
  });

  describe("Rendering", () => {
    it("should render welcome message and role-specific dashboard title after loading", async () => {
      callApiSpy.mockResolvedValue({
        ok: true,
        data: { id: "1", firstName: "John" },
      });
      render(<AccueilPage />);

      expect(screen.getByRole("progressbar")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("Bienvenue sur Yozu Lite")).toBeInTheDocument();
        expect(
          screen.getByText(/Tableau de bord Étudiant/i),
        ).toBeInTheDocument();
      });
    });

    it("should show a loader while fetching data", async () => {
      callApiSpy.mockReturnValue(new Promise(() => {}));
      render(<AccueilPage />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  describe("Data Fetching", () => {
    it("should fetch and display student profile data on mount", async () => {
      const studentData = { id: "s1", firstName: "John", lastName: "Doe" };
      callApiSpy.mockResolvedValue({ ok: true, data: studentData });

      render(<AccueilPage />);

      await waitFor(() => {
        expect(callApiSpy).toHaveBeenCalledWith({
          route: "/profiles/students/me",
          method: authModule.Method.GET,
        });
        expect(screen.getByText(/Profil Étudiant/i)).toBeInTheDocument();
        expect(
          screen.getByText(new RegExp(studentData.firstName)),
        ).toBeInTheDocument();
      });
    });

    it("should fetch and display company profile data on mount", async () => {
      const companyData = { id: "c1", companyName: "Acme Corp" };
      useAuthMock.mockReturnValue({
        role: Role.COMPANY,
        logout: logoutMock,
      });
      callApiSpy.mockResolvedValue({ ok: true, data: companyData });

      render(<AccueilPage />);

      await waitFor(() => {
        expect(callApiSpy).toHaveBeenCalledWith({
          route: "/profiles/companies/me",
          method: authModule.Method.GET,
        });
        expect(screen.getByText(/Profil Entreprise/i)).toBeInTheDocument();
        expect(
          screen.getByText(new RegExp(companyData.companyName)),
        ).toBeInTheDocument();
      });
    });

    it("should display error message if API fails", async () => {
      const errorMessage = "Erreur serveur";
      callApiSpy.mockResolvedValue({ ok: false, errorMessage });

      render(<AccueilPage />);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe("Actions", () => {
    it("should call logout when clicking the logout button", async () => {
      callApiSpy.mockResolvedValue({ ok: true, data: {} });
      render(<AccueilPage />);

      await waitFor(() => {
        expect(screen.getByText("Bienvenue sur Yozu Lite")).toBeInTheDocument();
      });

      const logoutBtn = screen.getByRole("button", {
        name: /Se déconnecter/i,
      });
      await user.click(logoutBtn);

      expect(logoutMock).toHaveBeenCalled();
    });
  });
});
