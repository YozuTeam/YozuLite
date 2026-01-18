
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form, { FormData, Labels, SetFormData } from "../OnboardingForm";

// Mock validation of imports / modules
jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: () => ({
    colorScheme: "light",
  }),
}));

// Mock Textarea if necessary (it seems to be a default export)
// Mock SelectOverlay if necessary (but we can test integration)

jest.mock("@/theme/constant", () => ({
  NAV_THEME: {
    light: {
      background: "#ffffff",
      secondaryBackground: "#f0f0f0",
      border: "#e0e0e0",
      card: "#ffffff",
      notification: "#ff0000",
      primary: "#007bff",
      text: "#000000",
      primaryForeground: "#ffffff",
      secondary: "#6c757d",
      secondaryForeground: "#ffffff",
      muted: "#d6d8db",
      mutedForeground: "#6c757d",
      white: "#ffffff",
    },
    dark: {
      background: "#000000",
      secondaryBackground: "#1a1a1a",
      border: "#333333",
      card: "#1a1a1a",
      notification: "#ff0000",
      primary: "#007bff",
      text: "#ffffff",
      primaryForeground: "#ffffff",
      secondary: "#6c757d",
      secondaryForeground: "#ffffff",
      muted: "#d6d8db",
      mutedForeground: "#6c757d",
      white: "#ffffff",
    },
  },
}));

describe("OnboardingForm", () => {
  const mockSetFormData: SetFormData = {
    setInputField1: jest.fn(),
    setInputField2: jest.fn(),
    setTextAreaField: jest.fn(),
    setPickerField: jest.fn(),
    setSelectorField: jest.fn(),
  };

  const mockOnSubmit = jest.fn();

  const defaultData: FormData = {
    inputField1: "",
    inputField2: "",
    textAreaField: "",
    pickerField: [],
    selectorField: [],
  };

  const labels: Labels = {
    labelInputField1: "Prénom",
    labelInputField2: "Nom",
    labelTextAreaField: "Description",
    labelPickerField: "Compétences",
    labelSelectorField: "Intérêts",
    labelTitle: "Mon Formulaire",
  };

  const selectorOptions = ["Option 1", "Option 2", "Option 3"];
  const pickerOptions = ["Skill A", "Skill B", "Skill C"];

  const renderForm = (data = defaultData) => {
    return render(
      <Form
        data={data}
        setFormData={mockSetFormData}
        onSubmit={mockOnSubmit}
        labels={labels}
        selectorOptions={selectorOptions}
        pickerOptions={pickerOptions}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with title and fields", () => {
    renderForm();

    expect(screen.getByText("Mon Formulaire")).toBeInTheDocument();
    expect(screen.getByText("Prénom")).toBeInTheDocument();
    expect(screen.getByText("Nom")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Intérêts")).toBeInTheDocument();
    expect(screen.getByText("Compétences")).toBeInTheDocument();
    
    selectorOptions.forEach((opt) => {
        expect(screen.getByRole("button", { name: opt })).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /continuer/i })).toBeInTheDocument();
  });

  it("renders with default empty options", () => {
    render(
      <Form
        data={defaultData}
        setFormData={mockSetFormData}
        onSubmit={mockOnSubmit}
        labels={labels}
        // No options passed
      />
    );
    expect(screen.getByText("Mon Formulaire")).toBeInTheDocument();
  });

  it("updates text inputs correctly", async () => {
    renderForm();

    const textboxes = screen.getAllByRole("textbox");
    const input1 = textboxes[0];
    const input2 = textboxes[1];
    const textarea = textboxes[2];

    await userEvent.type(input1, "Jean");
    expect(mockSetFormData.setInputField1).toHaveBeenCalledWith("J");

    jest.clearAllMocks();
    fireEvent.change(input2, { target: { value: "Dupont" } });
    expect(mockSetFormData.setInputField2).toHaveBeenCalledWith("Dupont");

    fireEvent.change(textarea, { target: { value: "Hello world" } });
    expect(mockSetFormData.setTextAreaField).toHaveBeenCalledWith("Hello world");
  });

  it("updates selector field correctly", async () => {
    renderForm();
    const option1Btn = screen.getByRole("button", { name: "Option 1" });
    await userEvent.click(option1Btn);
    expect(mockSetFormData.setSelectorField).toHaveBeenCalledWith(["Option 1"]);
  });

  it("updates picker field correctly", async () => {
    renderForm();
    const addButton = screen.getByLabelText("Add item");
    await userEvent.click(addButton);
    
    // Check if SelectOverlay is shown (it has a search field "Rechercher")
    expect(screen.getAllByText("Rechercher").length).toBeGreaterThan(0);

    const skillA = screen.getByText("Skill A");
    await userEvent.click(skillA);
    expect(mockSetFormData.setPickerField).toHaveBeenCalledWith(["Skill A"]);
  });

  it("shows validation errors when submitting empty form", async () => {
    renderForm();
    const submitBtn = screen.getByRole("button", { name: /continuer/i });
    await userEvent.click(submitBtn);

    expect(mockOnSubmit).not.toHaveBeenCalled();
    const requiredMessages = screen.getAllByText("Ce champ est obligatoire");
    expect(requiredMessages).toHaveLength(3);
    const selectMessages = screen.getAllByText("Veuillez sélectionner au moins une option");
    expect(selectMessages).toHaveLength(2);
  });

  it("clears error on focus", async () => {
     renderForm();
     const submitBtn = screen.getByRole("button", { name: /continuer/i });
     await userEvent.click(submitBtn);
 
     const textboxes = screen.getAllByRole("textbox");
     
     expect(screen.getAllByText("Ce champ est obligatoire")).toHaveLength(3);
 
     // Focus input1
     fireEvent.focus(textboxes[0]);
     await waitFor(() => expect(screen.getAllByText("Ce champ est obligatoire")).toHaveLength(2));
     
     // Focus input2
     fireEvent.focus(textboxes[1]);
     await waitFor(() => expect(screen.getAllByText("Ce champ est obligatoire")).toHaveLength(1));

     // Focus textarea
     fireEvent.focus(textboxes[2]);
     await waitFor(() => expect(screen.queryAllByText("Ce champ est obligatoire")).toHaveLength(0));
   });

   it("clears selector error on focus (click option)", async () => {
      renderForm();
      await userEvent.click(screen.getByRole("button", { name: /continuer/i }));
      expect(screen.getAllByText("Veuillez sélectionner au moins une option")).toHaveLength(2);
      await userEvent.click(screen.getByRole("button", { name: "Option 1" }));
      expect(screen.getAllByText("Veuillez sélectionner au moins une option")).toHaveLength(1);
   });

   it("clears picker error on focus (open picker)", async () => {
        renderForm();
        await userEvent.click(screen.getByRole("button", { name: /continuer/i }));
        await userEvent.click(screen.getByLabelText("Add item"));
        await waitFor(() => {
             expect(screen.getAllByText("Veuillez sélectionner au moins une option")).toHaveLength(1);
        });
   });

   it("submits the form when valid", async () => {
     // Prepare valid data
     const validData: FormData = {
        inputField1: "Valid 1",
        inputField2: "Valid 2",
        textAreaField: "Valid Desc",
        pickerField: ["Skill A"],
        selectorField: ["Option 1"],
     };

     // Render with valid data already populated
     render(
        <Form
          data={validData}
          setFormData={mockSetFormData}
          onSubmit={mockOnSubmit}
          labels={labels}
          selectorOptions={selectorOptions}
          pickerOptions={pickerOptions}
        />
      );

     const submitBtn = screen.getByRole("button", { name: /continuer/i });
     await userEvent.click(submitBtn);

     expect(mockOnSubmit).toHaveBeenCalledWith(validData);
   });
});
