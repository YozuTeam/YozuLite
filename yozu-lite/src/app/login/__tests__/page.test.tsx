import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LoginPage from "@/app/login/page";

describe("LoginPage UI", () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();
    render(<LoginPage />);
  });

  it("affiche les champs de base (email + mot de passe + bouton)", () => {

    expect(screen.getByPlaceholderText(/email@exemple.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Votre mot de passe/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Se connecter/i })
    ).toBeInTheDocument();
  });

  it("affiche une erreur si l'email n'est pas valide", async () => {
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

  it("contient un lien vers la page d'inscription", () => {
    const link = screen.getByRole("link", { name: /Créer un compte/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/register");
  });

  it("soumet le formulaire et log l'email et le mot de passe", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    const emailInput = screen.getByPlaceholderText(/email@exemple.com/i);
    const passwordInput = screen.getByPlaceholderText(/Votre mot de passe/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "MonMotDePasse123");

    const button = screen.getByRole("button", { name: /Se connecter/i });
    await user.click(button);

  
    expect(consoleLogSpy).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "MonMotDePasse123",
    });

  });

  it("affiche une erreur si les champs sont vides", async () => {

    const button = screen.getByRole("button", { name: /Se connecter/i });
    await user.click(button);

    expect(screen.getByText(/Veuillez remplir tous les champs/i)).toBeInTheDocument();
    
    const emailInput = screen.getByPlaceholderText(/email@exemple.com/i);
    const passwordInput = screen.getByPlaceholderText(/Votre mot de passe/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "MonMotDePasse123");

    expect(screen.queryByText(/Veuillez remplir tous les champs/i)).not.toBeInTheDocument();
  });

  
});
