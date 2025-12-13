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

  it("displays the basic fields (email + password + button)", () => {

    expect(screen.getByPlaceholderText(/email@exemple.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Votre mot de passe/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Se connecter/i })
    ).toBeInTheDocument();
  });

  it("displays an error if the email is not valid", async () => {
    const emailInput = screen.getByPlaceholderText(/email@exemple.com/i);

    await user.type(emailInput, "pas-un-mail");

    expect(
      await screen.findByText(/Adresse email invalide/i)
    ).toBeInTheDocument();
  });

  it("accepts a valid email without displaying an error", async () => {

    const emailInput = screen.getByPlaceholderText(/email@exemple.com/i);

    await user.type(emailInput, "test@example.com");

    expect(screen.queryByText(/Adresse email invalide/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ce champ est requis/i)).not.toBeInTheDocument();
  });

  it("contains a link to the registration page", () => {
    const link = screen.getByRole("link", { name: /Créer un compte/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/register");
  });

  it("submits the form and logs the email and password", async () => {
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

  it("displays an error if the fields are empty", async () => {

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
