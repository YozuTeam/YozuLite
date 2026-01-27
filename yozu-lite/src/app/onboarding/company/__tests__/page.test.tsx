import OnboardingCompanyPage from "@/app/onboarding/company/page";
import { api } from "@/auth/api";
import { Method } from "@/auth/constants";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as navigation from "next/navigation";

const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/design-system/template/OnboardingForm", () => {
  return jest.fn(
    (props: {
      labels: { labelTitle: string };
      setFormData: {
        setInputField1: (v: string) => void;
        setInputField2: (v: string) => void;
        setTextAreaField: (v: string) => void;
        setPickerField: (v: string[]) => void;
        setSelectorField: (v: string[]) => void;
      };
      onSubmit: () => void;
    }) => (
      <div data-testid="mock-form">
        <h1 data-testid="form-title">{props.labels.labelTitle}</h1>
        <button
          onClick={() => {
            props.setFormData.setInputField1("Acme Corp");
            props.setFormData.setInputField2("Secteur");
            props.setFormData.setTextAreaField("Description");
            props.setFormData.setPickerField(["Tech1"]);
            props.setFormData.setSelectorField(["CDI"]);
          }}
          data-testid="btn-fill-form"
        >
          Fill
        </button>
        <button onClick={props.onSubmit} data-testid="btn-submit">
          Submit
        </button>
      </div>
    ),
  );
});

describe("OnboardingCompanyPage", () => {
  let user: ReturnType<typeof userEvent.setup>;
  let callApiSpy: jest.SpyInstance;
  let useRouterMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();

    useRouterMock = navigation.useRouter as jest.Mock;
    useRouterMock.mockReturnValue({
      replace: mockReplace,
    });

    callApiSpy = jest.spyOn(api, "callAPI");
  });

  afterEach(() => {
    callApiSpy.mockRestore();
  });

  describe("Rendering", () => {
    it("should render the onboarding form for companies", () => {
      render(<OnboardingCompanyPage />);
      expect(screen.getByTestId("mock-form")).toBeInTheDocument();
      expect(screen.getByTestId("form-title")).toHaveTextContent(
        "Onboarding entreprise",
      );
    });
  });

  describe("Logic", () => {
    it("should prevent submission if fields are empty", async () => {
      render(<OnboardingCompanyPage />);
      await user.click(screen.getByTestId("btn-submit"));
      expect(callApiSpy).not.toHaveBeenCalled();
    });

    it("should call callAPI and redirect on success", async () => {
      callApiSpy.mockResolvedValue({ ok: true, data: { id: "company-1" } });
      render(<OnboardingCompanyPage />);

      await user.click(screen.getByTestId("btn-fill-form"));
      await user.click(screen.getByTestId("btn-submit"));

      await waitFor(() => {
        expect(callApiSpy).toHaveBeenCalledWith({
          route: "/profiles/companies/me",
          method: Method.POST,
          data: {
            companyName: "Acme Corp",
            description: "Description",
            industry: "Secteur",
            competences: ["Tech1"],
            contractType: ["CDI"],
          },
          isPublicRoute: false,
        });
        expect(mockReplace).toHaveBeenCalledWith("/yozu-lite/accueil");
      });
    });

    it("should handle error on failure", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      callApiSpy.mockRejectedValue(new Error("Network Error"));

      render(<OnboardingCompanyPage />);
      await user.click(screen.getByTestId("btn-fill-form"));
      await user.click(screen.getByTestId("btn-submit"));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });
      consoleSpy.mockRestore();
    });
  });
});
