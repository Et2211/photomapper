import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import Input from "@/components/atoms/Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("forwards ref to the underlying input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("spreads HTML input props (placeholder, type)", () => {
    render(<Input placeholder="Enter email" type="email" />);
    const input = screen.getByPlaceholderText("Enter email");
    expect(input).toHaveAttribute("type", "email");
  });

  it("applies base CSS classes", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toHaveClass("w-full", "border", "rounded-lg");
  });

  it("merges additional className", () => {
    render(<Input className="extra-class" />);
    expect(screen.getByRole("textbox")).toHaveClass("extra-class");
  });

  it("has displayName Input", () => {
    expect(Input.displayName).toBe("Input");
  });
});
