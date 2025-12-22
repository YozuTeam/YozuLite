import { render, screen } from "@testing-library/react";
import { Text } from "../Text";

describe("Text", () => {
  const defaultColors = {
    text: "#ff0000",
  };
  it("renders children correctly", () => {
    render(<Text colors={defaultColors}>Hello World</Text>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("applies variant", () => {
    render(<Text colors={defaultColors} variant="h1">Heading</Text>);
    expect(screen.getByText("Heading")).toHaveClass("MuiTypography-h1");
  });

  it("applies color from theme", () => {
    render(<Text colors={defaultColors}>Colored Text</Text>);
    const element = screen.getByText("Colored Text");
    expect(element).toBeInTheDocument();
  });
});
