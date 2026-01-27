import { render, screen, fireEvent } from "@testing-library/react";
import OnboardingCompanyPage from "../page";
import { callAPI } from "@/app/_providers/AuthProvider";

// Mock callAPI
jest.mock("@/app/_providers/AuthProvider", () => ({
  callAPI: jest.fn(),
}));

// Mock useRouter
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

// Mock the Form component
jest.mock("@/design-system/template/OnboardingForm", () => {
  return jest.fn((props) => (
    <div data-testid="mock-form">
      <button
        onClick={() => {
          props.setFormData.setInputField1("Acme Corp");
          props.setFormData.setInputField2("Secteur");
          props.setFormData.setTextAreaField("Description");
          props.setFormData.setPickerField(["Tech1"]);
          props.setFormData.setSelectorField(["CDI"]);
        }}
        data-testid="btn-fill-form"
      />
      <button onClick={props.onSubmit} data-testid="btn-submit" />
    </div>
  ));
});

describe("OnboardingCompanyPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form", () => {
    render(<OnboardingCompanyPage />);
    expect(screen.getByTestId("mock-form")).toBeInTheDocument();
  });

  it("does not call API if fields are missing", async () => {
    render(<OnboardingCompanyPage />);
    fireEvent.click(screen.getByTestId("btn-submit"));
    expect(callAPI).not.toHaveBeenCalled();
  });

  it("calls callAPI and redirects on successful submit", async () => {
    render(<OnboardingCompanyPage />);

    // Fill the form
    fireEvent.click(screen.getByTestId("btn-fill-form"));

    // Submit
    fireEvent.click(screen.getByTestId("btn-submit"));

    expect(callAPI).toHaveBeenCalledWith({
      route: "/profiles/companies/me",
      method: expect.any(String),
      data: expect.objectContaining({
        companyName: "Acme Corp",
        description: "Description",
        industry: "Secteur",
      }),
      isPublicRoute: false,
    });

    expect(mockReplace).toHaveBeenCalledWith("/yozu-lite/accueil");
  });

  it("handles API error gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    (callAPI as jest.Mock).mockImplementationOnce(() => {
      throw new Error("API Error");
    });

    render(<OnboardingCompanyPage />);
    fireEvent.click(screen.getByTestId("btn-fill-form"));
    fireEvent.click(screen.getByTestId("btn-submit"));

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    consoleSpy.mockRestore();
  });
});
