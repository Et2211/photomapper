import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Button from "@/components/atoms/Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies primary variant classes", () => {
    render(<Button variant="primary">Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-blue-600");
  });

  it("applies secondary variant classes (default)", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-gray-700");
  });

  it("applies ghost variant classes", () => {
    render(<Button variant="ghost">Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-blue-600");
  });

  it("applies sm size classes (default)", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-3");
  });

  it("applies md size classes", () => {
    render(<Button size="md">Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-4");
  });

  it("merges custom className", () => {
    render(<Button className="custom-class">Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("fires onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Test</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>Test</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("passes disabled attribute to the button element", () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
