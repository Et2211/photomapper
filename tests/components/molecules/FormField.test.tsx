import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import FormField from "@/components/molecules/FormField";

describe("FormField", () => {
  it("renders the label text", () => {
    render(<FormField label="Email" htmlFor="email"><input id="email" /></FormField>);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("sets htmlFor on the label", () => {
    render(<FormField label="Email" htmlFor="email"><input id="email" /></FormField>);
    expect(screen.getByText("Email").closest("label")).toHaveAttribute("for", "email");
  });

  it("renders children", () => {
    render(
      <FormField label="Name" htmlFor="name">
        <input id="name" placeholder="Enter name" />
      </FormField>,
    );
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  });

  it("does not render error paragraph when error is undefined", () => {
    render(<FormField label="Name" htmlFor="name"><input /></FormField>);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("renders error message when error prop is provided", () => {
    render(
      <FormField label="Name" htmlFor="name" error="Name is required">
        <input />
      </FormField>,
    );
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });
});
