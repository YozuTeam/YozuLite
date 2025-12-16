import { render } from "@testing-library/react";
import { Icon } from "../Icon";

describe("Icon", () => {
  const defaultColors = {
    iconColor: "#ff0000",
  };

  it("renders correctly", () => {
    const { container } = render(
      <Icon colors={defaultColors}>
        <path d="M10 10" />
      </Icon>
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveStyle({ color: "#ff0000" });
  });

  it("passes other props to SvgIcon", () => {
    const { container } = render(
      <Icon colors={defaultColors} fontSize="large">
        <path d="M10 10" />
      </Icon>
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("MuiSvgIcon-fontSizeLarge");
  });
});
