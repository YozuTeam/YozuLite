import OnboardingStudentPage from "@/app/onboarding/student/page";
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
  return jest.fn((props: any) => (
    <div data-testid="mock-form">
      <h1 data-testid="form-title">{props.labels.labelTitle}</h1>
      <button
        onClick={() => {
          props.setFormData.setInputField1("John");
          props.setFormData.setInputField2("Doe");
          props.setFormData.setTextAreaField("Bio test");
          props.setFormData.setPickerField(["Skill1"]);
          props.setFormData.setSelectorField(["Oui"]);
        }}
        data-testid="btn-fill-form"
      >
        Fill
      </button>
      <button onClick={props.onSubmit} data-testid="btn-submit">
        Submit
      </button>
    </div>
  ));
});

describe("OnboardingStudentPage", () => {
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
    it("should render the onboarding form with the correct title", () => {
      render(<OnboardingStudentPage />);
      expect(screen.getByTestId("mock-form")).toBeInTheDocument();
      expect(screen.getByTestId("form-title")).toHaveTextContent(
        "Onboarding étudiant",
      );
    });
  });

  describe("Form Submission Logic", () => {
    it("should not call API if fields are empty", async () => {
      render(<OnboardingStudentPage />);
      const submitBtn = screen.getByTestId("btn-submit");
      await user.click(submitBtn);

      expect(callApiSpy).not.toHaveBeenCalled();
    });

    it("should call callAPI with student data and redirect on success", async () => {
      callApiSpy.mockResolvedValue({ ok: true, data: { id: "1" } });
      render(<OnboardingStudentPage />);

      await user.click(screen.getByTestId("btn-fill-form"));
      await user.click(screen.getByTestId("btn-submit"));

      await waitFor(() => {
        expect(callApiSpy).toHaveBeenCalledWith({
          route: "/profiles/students/me",
          method: Method.POST,
          data: {
            firstName: "John",
            lastName: "Doe",
            bio: "Bio test",
            skills: ["Skill1"],
            contractType: ["Oui"],
          },
          isPublicRoute: false,
        });
        expect(mockReplace).toHaveBeenCalledWith("/yozu-lite/accueil");
      });
    });

    it("should log error if API call fails", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      callApiSpy.mockRejectedValue(new Error("API Failure"));

      render(<OnboardingStudentPage />);
      await user.click(screen.getByTestId("btn-fill-form"));
      await user.click(screen.getByTestId("btn-submit"));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });
      consoleSpy.mockRestore();
    });
  });
});
