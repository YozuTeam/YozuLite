import { render, screen, fireEvent } from "@testing-library/react";
import OnboardingCompanyPage from "../page";

// Mock the Form component
jest.mock("@/design-system/template/OnboardingForm", () => {
  return jest.fn((props) => (
    <div data-testid="mock-form">
      <div data-testid="data-name">{props.data.inputField1}</div>
      <div data-testid="data-lastname">{props.data.inputField2}</div>
      <div data-testid="data-bio">{props.data.textAreaField}</div>
      <div data-testid="data-skills">{JSON.stringify(props.data.pickerField)}</div>
      <div data-testid="data-contract">{JSON.stringify(props.data.selectorField)}</div>
      
      <div data-testid="label-title">{props.labels.labelTitle}</div>
      <div data-testid="picker-options">{JSON.stringify(props.pickerOptions)}</div>
      <div data-testid="selector-options">{JSON.stringify(props.selectorOptions)}</div>

      <button onClick={() => props.setFormData.setInputField1("My Company")} data-testid="btn-set-name" />
      <button onClick={() => props.setFormData.setInputField2("Best Slogan")} data-testid="btn-set-lastname" />
      <button onClick={() => props.setFormData.setTextAreaField("Great Bio")} data-testid="btn-set-bio" />
      <button onClick={() => props.setFormData.setPickerField(["Innovant"])} data-testid="btn-set-skills" />
      <button onClick={() => props.setFormData.setSelectorField(["CDI"])} data-testid="btn-set-contract" />
      
      {/* Simulate submit with current data */}
      <button onClick={() => props.onSubmit(props.data)} data-testid="btn-submit" />
    </div>
  ));
});

describe("OnboardingCompanyPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with correct initial values and labels", () => {
    render(<OnboardingCompanyPage />);
    
    expect(screen.getByTestId("mock-form")).toBeInTheDocument();
    expect(screen.getByTestId("label-title")).toHaveTextContent("Onboarding entreprise");
    
    // Check initial state is empty
    expect(screen.getByTestId("data-name")).toHaveTextContent("");
    expect(screen.getByTestId("data-lastname")).toHaveTextContent("");
    expect(screen.getByTestId("data-bio")).toHaveTextContent("");
    expect(screen.getByTestId("data-skills")).toHaveTextContent("[]");
    expect(screen.getByTestId("data-contract")).toHaveTextContent("[]");

    // Check options are passed
    expect(screen.getByTestId("picker-options")).toHaveTextContent("Collaboratif");
    expect(screen.getByTestId("selector-options")).toHaveTextContent("CDI");
  });

  it("updates state correctly when form setters are triggered", () => {
    render(<OnboardingCompanyPage />);
    
    // Update Name
    fireEvent.click(screen.getByTestId("btn-set-name"));
    expect(screen.getByTestId("data-name")).toHaveTextContent("My Company");

    // Update Slogan (lastName)
    fireEvent.click(screen.getByTestId("btn-set-lastname"));
    expect(screen.getByTestId("data-lastname")).toHaveTextContent("Best Slogan");

    // Update Bio
    fireEvent.click(screen.getByTestId("btn-set-bio"));
    expect(screen.getByTestId("data-bio")).toHaveTextContent("Great Bio");

    // Update Skills
    fireEvent.click(screen.getByTestId("btn-set-skills"));
    expect(screen.getByTestId("data-skills")).toHaveTextContent('["Innovant"]');

    // Update Contract
    fireEvent.click(screen.getByTestId("btn-set-contract"));
    expect(screen.getByTestId("data-contract")).toHaveTextContent('["CDI"]');
  });

  it("calls console.log on submit", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    render(<OnboardingCompanyPage />);
    
    fireEvent.click(screen.getByTestId("btn-submit"));
    
    expect(consoleSpy).toHaveBeenCalledWith("Company Data submitted");
    consoleSpy.mockRestore();
  });
});
