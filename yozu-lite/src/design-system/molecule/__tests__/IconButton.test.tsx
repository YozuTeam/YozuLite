import { render, screen, fireEvent } from "@testing-library/react";
import IconButton from "../IconButton";

describe("IconButton", () => {
  const mockColors = {
    button: {
      textColor: "#000",
      borderColor: "#ccc",
      backgroundColor: "#fff",
    },
    icon: {
      iconColor: "#f00",
    },
  };

  const iconPath = "M10 10";

  it("renders correctly", () => {
    render(<IconButton iconPath={iconPath} colors={mockColors} aria-label="My Icon Button" />);
    expect(screen.getByRole("button", { name: "My Icon Button" })).toBeInTheDocument();
  });

  it("renders icon path", () => {
     const { container } = render(<IconButton iconPath={iconPath} colors={mockColors} />);
     const path = container.querySelector("path");
     expect(path).toHaveAttribute("d", iconPath);
  });

  it("handles click", () => {
    const handleClick = jest.fn();
    render(<IconButton iconPath={iconPath} colors={mockColors} onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });
});
