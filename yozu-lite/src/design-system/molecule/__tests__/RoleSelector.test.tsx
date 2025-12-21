import { render, screen, fireEvent } from "@testing-library/react";
import { RoleSelector } from "../RoleSelector";

describe("RoleSelector", () => {
  it("renders buttons", () => {
    const handleChange = jest.fn();
    render(<RoleSelector label="Select Role" value="student" onChange={handleChange} />);
    expect(screen.getByText("Select Role")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Student" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Company" })).toBeInTheDocument();
  });

  it("triggers onChange when clicking Company", () => {
    const handleChange = jest.fn();
    render(<RoleSelector label="Role" value="student" onChange={handleChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Company" }));
    expect(handleChange).toHaveBeenCalledWith("company");
  });

  it("triggers onChange when clicking Student", () => {
    const handleChange = jest.fn();
    render(<RoleSelector label="Role" value="company" onChange={handleChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Student" }));
    expect(handleChange).toHaveBeenCalledWith("student");
  });
});
