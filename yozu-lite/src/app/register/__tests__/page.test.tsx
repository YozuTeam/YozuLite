import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/register/page";
import { register } from "@/app/_providers/AuthProvider";

// Mock useRouter
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

// Mock useColorTheme
jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: () => ({
    colorScheme: "light",
  }),
}));

// Mock register function
jest.mock("@/app/_providers/AuthProvider", () => ({
  register: jest.fn(),
}));

const mockRegister = register as jest.MockedFunction<typeof register>;

describe("RegisterPage", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();
  });

  it("renders correctly", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Créer un compte")).toBeInTheDocument();
  });

  it("displays error when fields are empty on submit", async () => {
    render(<RegisterPage />);
    const submitBtn = screen.getByRole("button", { name: /S'inscrire/i });

    await user.click(submitBtn);

    expect(
      screen.getByText("Veuillez remplir tous les champs"),
    ).toBeInTheDocument();
  });

  it("submits successfully and redirects for student role", async () => {
    mockRegister.mockResolvedValueOnce();
    render(<RegisterPage />);

    await user.type(
      screen.getByPlaceholderText(/email@exemple.com/i),
      "test@student.com",
    );
    await user.type(
      screen.getByPlaceholderText(/Créez un mot de passe/i),
      "Password123!",
    );
    await user.type(
      screen.getByPlaceholderText("06 12 34 56 78"),
      "0612345678",
    );
    await user.click(screen.getByRole("button", { name: "student" }));

    await user.click(screen.getByRole("button", { name: /S'inscrire/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "test@student.com",
        "Password123!",
        "0612345678",
        "student",
      );
      expect(mockReplace).toHaveBeenCalledWith("/onboarding/student");
    });
  });

  it("submits successfully and redirects for company role", async () => {
    mockRegister.mockResolvedValueOnce();
    render(<RegisterPage />);

    await user.type(
      screen.getByPlaceholderText(/email@exemple.com/i),
      "hr@company.com",
    );
    await user.type(
      screen.getByPlaceholderText(/Créez un mot de passe/i),
      "Password123!",
    );
    await user.type(
      screen.getByPlaceholderText("06 12 34 56 78"),
      "0612345678",
    );
    await user.click(screen.getByRole("button", { name: "company" }));

    await user.click(screen.getByRole("button", { name: /S'inscrire/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "hr@company.com",
        "Password123!",
        "0612345678",
        "company",
      );
      expect(mockReplace).toHaveBeenCalledWith("/onboarding/company");
    });
  });

  it("displays error message from register failure (Error instance)", async () => {
    mockRegister.mockRejectedValueOnce(new Error("Email already exists"));
    render(<RegisterPage />);

    await user.type(
      screen.getByPlaceholderText(/email@exemple.com/i),
      "exists@test.com",
    );
    await user.type(
      screen.getByPlaceholderText(/Créez un mot de passe/i),
      "Password123!",
    );
    await user.type(
      screen.getByPlaceholderText("06 12 34 56 78"),
      "0612345678",
    );
    await user.click(screen.getByRole("button", { name: "student" }));

    await user.click(screen.getByRole("button", { name: /S'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });
  });

  it("displays generic error message from register failure (non-Error)", async () => {
    mockRegister.mockRejectedValueOnce("unknown error");
    render(<RegisterPage />);

    await user.type(
      screen.getByPlaceholderText(/email@exemple.com/i),
      "fail@test.com",
    );
    await user.type(
      screen.getByPlaceholderText(/Créez un mot de passe/i),
      "Password123!",
    );
    await user.type(
      screen.getByPlaceholderText("06 12 34 56 78"),
      "0612345678",
    );
    await user.click(screen.getByRole("button", { name: "student" }));

    await user.click(screen.getByRole("button", { name: /S'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
    });
  });

  it("clears error on email change", async () => {
    render(<RegisterPage />);
    const submitBtn = screen.getByRole("button", { name: /S'inscrire/i });
    await user.click(submitBtn);
    expect(
      screen.getByText("Veuillez remplir tous les champs"),
    ).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/email@exemple.com/i), "a");
    expect(
      screen.queryByText("Veuillez remplir tous les champs"),
    ).not.toBeInTheDocument();
  });

  it("clears error on password change", async () => {
    render(<RegisterPage />);
    const submitBtn = screen.getByRole("button", { name: /S'inscrire/i });
    await user.click(submitBtn);

    await user.type(screen.getByPlaceholderText(/Créez un mot de passe/i), "p");
    expect(
      screen.queryByText("Veuillez remplir tous les champs"),
    ).not.toBeInTheDocument();
  });

  it("clears error on phone number change", async () => {
    render(<RegisterPage />);
    const submitBtn = screen.getByRole("button", { name: /S'inscrire/i });
    await user.click(submitBtn);

    await user.type(screen.getByPlaceholderText("06 12 34 56 78"), "0");
    expect(
      screen.queryByText("Veuillez remplir tous les champs"),
    ).not.toBeInTheDocument();
  });
});
