import { render, screen } from "@testing-library/react";
import { FormField } from "../FormField";

import { NAV_THEME } from "@/theme/constant";

describe("FormField", () => {
  const defaultColors = NAV_THEME.light;

  it("renders label and children", () => {
    render(
      <FormField label="Test Label" colors={defaultColors}>
        <input data-testid="child-input" />
      </FormField>
    );
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByTestId("child-input")).toBeInTheDocument();
  });

  it("renders required asterisk", () => {
    render(
      <FormField label="Required Field" required colors={defaultColors}>
        <input />
      </FormField>
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders hint when no error", () => {
    render(
      <FormField label="Hint Field" hint="This is a hint" colors={defaultColors}>
        <input />
      </FormField>
    );
    expect(screen.getByText("This is a hint")).toBeInTheDocument();
  });

  it("renders error instead of hint", () => {
    render(
      <FormField
        label="Error Field"
        hint="This is a hint"
        error={true}
        errorText="This is an error"
        colors={defaultColors}
      >
        <input />
      </FormField>
    );
    expect(screen.getByText("This is an error")).toBeInTheDocument();
    expect(screen.getByText("This is a hint")).toBeInTheDocument();
  });
  it("renders correctly without colors prop", () => {
    render(
      <FormField label="No Colors Prop">
        <input />
      </FormField>
    );
    expect(screen.getByText("No Colors Prop")).toBeInTheDocument();
  });
});
