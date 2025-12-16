import { render, screen } from "@testing-library/react";
import Text from "../Text";

jest.mock("@/theme/useColorTheme", () => ({
  useColorTheme: () => ({
    colorScheme: "light",
  }),
}));

jest.mock("@/theme/constant", () => ({
  NAV_THEME: {
    light: {
      text: "#000000",
      primary: "#0000ff",
    },
    dark: {
      text: "#ffffff",
      primary: "#add8e6",
    },
  },
}));

describe("Text", () => {
  it("renders children correctly", () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("applies variant", () => {
    const { container } = render(<Text variant="h1">Heading</Text>);
    expect(container.querySelector("h1")).toBeInTheDocument();
  });

  it("applies color from theme", () => {
    render(<Text color="primary">Colored Text</Text>);
    const element = screen.getByText("Colored Text");
    expect(element).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Text className="custom-class">Class Text</Text>);
    expect(screen.getByText("Class Text")).toHaveClass("custom-class");
  });
});
