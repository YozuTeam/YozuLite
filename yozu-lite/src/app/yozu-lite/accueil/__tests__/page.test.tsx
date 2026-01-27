import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccueilPage from "@/app/yozu-lite/accueil/page";
import { callAPI } from "@/app/_providers/AuthProvider";
import { useColorTheme } from "@/theme/useColorTheme";
import { Method } from "@/auth/constants";

// Mock des dépendances
jest.mock("@/app/_providers/AuthProvider", () => ({
  callAPI: jest.fn(),
}));

jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: jest.fn(),
}));

const mockCallAPI = callAPI as jest.MockedFunction<typeof callAPI>;
const mockUseColorTheme = useColorTheme as jest.MockedFunction<
  typeof useColorTheme
>;

describe("AccueilPage", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();

    // Mock du thème
    mockUseColorTheme.mockReturnValue({
      colorScheme: "light",
      isDarkColorScheme: false,
      setColorScheme: jest.fn(),
      toggleColorScheme: jest.fn(),
    });

    // Mock de localStorage
    Storage.prototype.removeItem = jest.fn();
  });

  it("renders the welcome message", () => {
    render(<AccueilPage />);

    expect(screen.getByText(/Bienvenue sur Yozu Lite/i)).toBeInTheDocument();
  });

  it("renders all three buttons", () => {
    render(<AccueilPage />);

    expect(
      screen.getByRole("button", { name: /Voir mon profil/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Infos du compte/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Se déconnecter/i }),
    ).toBeInTheDocument();
  });

  describe("getCompte function", () => {
    it("fetches and displays compte data successfully", async () => {
      const mockCompteData = {
        email: "test@example.com",
        phoneNumber: "0123456789",
        role: "STUDENT",
      };

      mockCallAPI.mockResolvedValueOnce({
        ok: true,
        data: mockCompteData,
      });

      render(<AccueilPage />);

      const compteButton = screen.getByRole("button", {
        name: /Infos du compte/i,
      });
      await user.click(compteButton);

      await waitFor(() => {
        expect(mockCallAPI).toHaveBeenCalledWith({
          route: "/profiles/me",
          method: Method.GET,
        });
      });

      await waitFor(() => {
        // Les données sont affichées dans le même élément Text, donc on vérifie leur présence
        const elements = screen.getAllByText((content, element) => {
          return element?.textContent?.includes(mockCompteData.email) ?? false;
        });
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    it("displays error message when getCompte fails", async () => {
      const errorMessage = "Erreur lors de la récupération du compte";

      mockCallAPI.mockResolvedValueOnce({
        ok: false,
        errorMessage,
      });

      render(<AccueilPage />);

      const compteButton = screen.getByRole("button", {
        name: /Infos du compte/i,
      });
      await user.click(compteButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe("getProfile function", () => {
    it("fetches student profile successfully when compte role is STUDENT", async () => {
      const mockCompteData = {
        email: "student@example.com",
        phoneNumber: "0123456789",
        role: "STUDENT",
      };

      const mockProfileData = {
        id: "1",
        name: "John Doe",
        email: "student@example.com",
      };

      // Premier appel pour getCompte
      mockCallAPI.mockResolvedValueOnce({
        ok: true,
        data: mockCompteData,
      });

      render(<AccueilPage />);

      // Cliquer sur le bouton "Infos du compte" pour définir le compte
      const compteButton = screen.getByRole("button", {
        name: /Infos du compte/i,
      });
      await user.click(compteButton);

      await waitFor(() => {
        const elements = screen.getAllByText((content, element) => {
          return element?.textContent?.includes(mockCompteData.email) ?? false;
        });
        expect(elements.length).toBeGreaterThan(0);
      });

      // Deuxième appel pour getProfile
      mockCallAPI.mockResolvedValueOnce({
        ok: true,
        data: mockProfileData,
      });

      const profileButton = screen.getByRole("button", {
        name: /Voir mon profil/i,
      });
      await user.click(profileButton);

      await waitFor(() => {
        expect(mockCallAPI).toHaveBeenCalledWith({
          route: "/profiles/students/me",
          method: Method.GET,
        });
      });

      await waitFor(() => {
        expect(
          screen.getByText(JSON.stringify(mockProfileData)),
        ).toBeInTheDocument();
      });
    });

    it("fetches company profile successfully when compte role is not STUDENT", async () => {
      const mockCompteData = {
        email: "company@example.com",
        phoneNumber: "0123456789",
        role: "COMPANY",
      };

      const mockProfileData = {
        id: "2",
        name: "Acme Corp",
        email: "company@example.com",
      };

      // Premier appel pour getCompte
      mockCallAPI.mockResolvedValueOnce({
        ok: true,
        data: mockCompteData,
      });

      render(<AccueilPage />);

      const compteButton = screen.getByRole("button", {
        name: /Infos du compte/i,
      });
      await user.click(compteButton);

      await waitFor(() => {
        const elements = screen.getAllByText((content, element) => {
          return element?.textContent?.includes(mockCompteData.email) ?? false;
        });
        expect(elements.length).toBeGreaterThan(0);
      });

      // Deuxième appel pour getProfile
      mockCallAPI.mockResolvedValueOnce({
        ok: true,
        data: mockProfileData,
      });

      const profileButton = screen.getByRole("button", {
        name: /Voir mon profil/i,
      });
      await user.click(profileButton);

      await waitFor(() => {
        expect(mockCallAPI).toHaveBeenCalledWith({
          route: "/profiles/companies/me",
          method: Method.GET,
        });
      });

      await waitFor(() => {
        expect(
          screen.getByText(JSON.stringify(mockProfileData)),
        ).toBeInTheDocument();
      });
    });

    it("uses company route when compte is null", async () => {
      const mockProfileData = {
        id: "3",
        name: "Default Profile",
      };

      mockCallAPI.mockResolvedValueOnce({
        ok: true,
        data: mockProfileData,
      });

      render(<AccueilPage />);

      const profileButton = screen.getByRole("button", {
        name: /Voir mon profil/i,
      });
      await user.click(profileButton);

      await waitFor(() => {
        expect(mockCallAPI).toHaveBeenCalledWith({
          route: "/profiles/companies/me",
          method: Method.GET,
        });
      });
    });

    it("displays error message when getProfile fails", async () => {
      const errorMessage = "Erreur lors de la récupération du profil";

      mockCallAPI.mockResolvedValueOnce({
        ok: false,
        errorMessage,
      });

      render(<AccueilPage />);

      const profileButton = screen.getByRole("button", {
        name: /Voir mon profil/i,
      });
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe("logout functionality", () => {
    it("removes tokens from localStorage when clicking logout button", async () => {
      render(<AccueilPage />);

      const logoutButton = screen.getByRole("button", {
        name: /Se déconnecter/i,
      });
      await user.click(logoutButton);

      expect(localStorage.removeItem).toHaveBeenCalledWith("accessToken");
      expect(localStorage.removeItem).toHaveBeenCalledWith("refreshToken");
    });
  });

  describe("conditional rendering", () => {
    it("does not display profile data when profile is null", () => {
      render(<AccueilPage />);

      // Le profil ne devrait pas être affiché initialement
      expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
    });

    it("does not display compte data when compte is null", () => {
      render(<AccueilPage />);

      // Le compte ne devrait pas être affiché initialement
      expect(screen.queryByText(/test@example.com/i)).not.toBeInTheDocument();
    });

    it("does not display error message when error is null", () => {
      render(<AccueilPage />);

      // Aucun message d'erreur ne devrait être affiché initialement
      const errorTexts = screen.queryAllByText(/erreur/i);
      expect(errorTexts).toHaveLength(0);
    });
  });

  describe("theme integration", () => {
    it("uses dark theme colors when colorScheme is dark", () => {
      mockUseColorTheme.mockReturnValue({
        colorScheme: "dark",
        isDarkColorScheme: true,
        setColorScheme: jest.fn(),
        toggleColorScheme: jest.fn(),
      });

      render(<AccueilPage />);

      expect(screen.getByText(/Bienvenue sur Yozu Lite/i)).toBeInTheDocument();
    });
  });
});
