import { render, screen, fireEvent } from "@testing-library/react";
import OnboardingStudentPage from "../page";

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

      <button onClick={() => props.setFormData.setInputField1("John")} data-testid="btn-set-name" />
      <button onClick={() => props.setFormData.setInputField2("Doe")} data-testid="btn-set-lastname" />
      <button onClick={() => props.setFormData.setTextAreaField("Student Bio")} data-testid="btn-set-bio" />
      <button onClick={() => props.setFormData.setPickerField(["Organisé"])} data-testid="btn-set-skills" />
      <button onClick={() => props.setFormData.setSelectorField(["Alternance"])} data-testid="btn-set-contract" />
      
      {/* Simulate submit with current data */}
      <button onClick={() => props.onSubmit(props.data)} data-testid="btn-submit" />
    </div>
  ));
});

describe("OnboardingStudentPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with correct initial values and labels", () => {
    render(<OnboardingStudentPage />);
    
    expect(screen.getByTestId("mock-form")).toBeInTheDocument();
    expect(screen.getByTestId("label-title")).toHaveTextContent("Onboarding étudiant");
    
    // Check initial state is empty
    expect(screen.getByTestId("data-name")).toHaveTextContent("");
    expect(screen.getByTestId("data-lastname")).toHaveTextContent("");
    
    // Check options
    expect(screen.getByTestId("selector-options")).toHaveTextContent("Alternance");
  });

  it("updates state correctly when form setters are triggered", () => {
    render(<OnboardingStudentPage />);
    
    // Update Name
    fireEvent.click(screen.getByTestId("btn-set-name"));
    expect(screen.getByTestId("data-name")).toHaveTextContent("John");

    // Update LastName
    fireEvent.click(screen.getByTestId("btn-set-lastname"));
    expect(screen.getByTestId("data-lastname")).toHaveTextContent("Doe");

    // Update Bio
    fireEvent.click(screen.getByTestId("btn-set-bio"));
    expect(screen.getByTestId("data-bio")).toHaveTextContent("Student Bio");

    // Update Skills
    fireEvent.click(screen.getByTestId("btn-set-skills"));
    expect(screen.getByTestId("data-skills")).toHaveTextContent('["Organisé"]');

    // Update Contract
    fireEvent.click(screen.getByTestId("btn-set-contract"));
    expect(screen.getByTestId("data-contract")).toHaveTextContent('["Alternance"]');
  });

  it("calls console.warn with data on submit", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    render(<OnboardingStudentPage />);
    
    // Set some data first
    fireEvent.click(screen.getByTestId("btn-set-name"));
    fireEvent.click(screen.getByTestId("btn-set-lastname"));
    
    fireEvent.click(screen.getByTestId("btn-submit"));
    
    expect(consoleSpy).toHaveBeenCalledWith("Student Data submitted:", expect.objectContaining({
        inputField1: "John",
        inputField2: "Doe",
        // other fields empty or default
    }));
    consoleSpy.mockRestore();
  });
});
