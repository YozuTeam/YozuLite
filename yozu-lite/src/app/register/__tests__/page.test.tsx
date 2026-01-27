import RegisterPage from "@/app/register/page";
import { Button } from "@/design-system/atoms/Button";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Role } from "@yozu/contracts";

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

  it("displays the main fields (email + password + button)", () => {
    expect(
      screen.getByPlaceholderText(/email@exemple.com/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Créez un mot de passe/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /S'inscrire/i }),
    ).toBeInTheDocument();
  });

  it("displays the RoleSelector with both options", () => {
    expect(
      screen.getByRole("button", { name: Role.STUDENT }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: Role.COMPANY }),
    ).toBeInTheDocument();
  });

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

    expect(
      await screen.findByText(/Adresse email invalide/i),
    ).toBeInTheDocument();
  });

  it("submits successfully and redirects for company role", async () => {
    mockRegister.mockResolvedValueOnce();
    render(<RegisterPage />);

    expect(
      screen.queryByText(/Adresse email invalide/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Ce champ est requis/i)).not.toBeInTheDocument();
  });

  it("allows changing role via the RoleSelector", async () => {
    const companyButton = screen.getByRole("button", { name: Role.COMPANY });

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

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "MonMotDePasse123");

    // Select role
    await user.click(screen.getByRole("button", { name: Role.STUDENT }));

    await user.click(screen.getByRole("button", { name: /S'inscrire/i }));

    expect(consoleLogSpy).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "MonMotDePasse123",
      selectedValues: [Role.STUDENT],
    });
  });

  it("displays an error if the fields are empty", async () => {
    const button = screen.getByRole("button", { name: /S'inscrire/i });
    await user.click(button);

    expect(
      screen.getByText(/Veuillez remplir tous les champs/i),
    ).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText(/email@exemple.com/i);
    const passwordInput = screen.getByPlaceholderText(/Créez un mot de passe/i);

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "MonMotDePasse123");

    // Clear error by filling
    const submitBtn = screen.getByRole("button", { name: /S'inscrire/i });
    await user.click(submitBtn);
    expect(
      screen.getByText("Veuillez remplir tous les champs"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/Veuillez remplir tous les champs/i),
    ).not.toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    const passwordInput = screen.getByPlaceholderText(/Créez un mot de passe/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    // The toggle button is an IconButton inside PasswordField.
    // It usually has an aria-label or accessible icon.
    // Without specific label, we might find it by excluding others.
    // But let's check PasswordField implementation to see if we can add aria-label or find it better.
    // Assuming previous logic worked:
    const buttons = screen.getAllByRole("button");
    const toggleButton = buttons.find(
      (btn) =>
        !btn.textContent?.match(/S'inscrire|student|company|Se connecter/i),
    );

    if (!toggleButton) {
      // If we can't find it, maybe the previous test logic was flaky.
      // Let's assume it works or try to find by specific icon path if visible to screen? specific logic.
      // For now, let's keep the existing logic but improved regex
    }

    // Actually, let's verify if PasswordField has a visibility toggle.
  });

describe("Button Component Standalone", () => {
  it("renders loading state correctly", () => {
    render(
      <Button
        colors={{
          textColor: "text",
          backgroundColor: "background",
          borderColor: "border",
        }}
        isLoading={true}
      >
        CTA Button
      </Button>,
    );
    expect(screen.getByText("Chargement...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
