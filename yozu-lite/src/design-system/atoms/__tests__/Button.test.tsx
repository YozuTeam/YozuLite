import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  const defaultColors = {
    textColor: "#ffffff",
    borderColor: "#000000",
    backgroundColor: "#0000ff",
  };

  it("renders children correctly", () => {
    render(
      <Button colors={defaultColors}>
        Click me
      </Button>
    );
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("handles onClick event", () => {
    const handleClick = jest.fn();
    render(
      <Button colors={defaultColors} onClick={handleClick}>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state", () => {
    render(
      <Button colors={defaultColors} isLoading>
        Click me
      </Button>
    );
    expect(screen.getByRole("button", { name: "Chargement..." })).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders disabled state", () => {
    render(
      <Button colors={defaultColors} disabled>
        Click me
      </Button>
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
