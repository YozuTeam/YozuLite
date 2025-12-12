import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/register/page";

describe("RegisterPage UI", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();
    render(<RegisterPage />);
  });

  it("affiche les champs principaux (email + mot de passe + bouton)", () => {
    expect(screen.getByPlaceholderText(/email@exemple.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Créez un mot de passe/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /S'inscrire/i })
    ).toBeInTheDocument();
  });

  it("affiche le RoleSelector avec les deux options", () => {
    expect(screen.getByRole("button", { name: /Student/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Company/i })).toBeInTheDocument();
  });

  it("affiche une erreur si l'email est invalide", async () => {
    const emailInput = screen.getByPlaceholderText(/email@exemple.com/i);

    await user.type(emailInput, "pas-un-mail");

    expect(
      await screen.findByText(/Adresse email invalide/i)
    ).toBeInTheDocument();
  });

  it("accepte un email valide sans afficher d'erreur", async () => {
    const emailInput = screen.getByPlaceholderText(/email@exemple.com/i);

    await user.type(emailInput, "test@example.com");

    expect(screen.queryByText(/Adresse email invalide/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ce champ est requis/i)).not.toBeInTheDocument();
  });

  it("permet de changer de rôle via le RoleSelector", async () => {
    const companyButton = screen.getByRole("button", { name: /Company/i });

    await user.click(companyButton);
    expect(companyButton).toBeInTheDocument();
  });

  it("contient un lien vers la page de connexion", () => {
    const loginLink = screen.getByRole("link", { name: /Se connecter/i });

    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it("soumet le formulaire et log l'email, le mot de passe et le rôle", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    const emailInput = screen.getByPlaceholderText(/email@exemple.com/i);
    const passwordInput = screen.getByPlaceholderText(/Créez un mot de passe/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "MonMotDePasse123");

    const button = screen.getByRole("button", { name: /S'inscrire/i });
    await user.click(button);

    expect(consoleLogSpy).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "MonMotDePasse123",
      role: "student",
    });
  });

  it("affiche une erreur si les champs sont vides", async () => {
    const button = screen.getByRole("button", { name: /S'inscrire/i });
    await user.click(button);

    expect(screen.getByText(/Veuillez remplir tous les champs/i)).toBeInTheDocument();
    
    const emailInput = screen.getByPlaceholderText(/email@exemple.com/i);
    const passwordInput = screen.getByPlaceholderText(/Créez un mot de passe/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "MonMotDePasse123");

    expect(screen.queryByText(/Veuillez remplir tous les champs/i)).not.toBeInTheDocument();
  });
});
